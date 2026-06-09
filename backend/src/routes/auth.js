'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto   = require('crypto');
const db       = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
} = require('../middleware/rateLimiter');

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function issueTokens(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    nombre: user.nombre,
    role: user.role,
    empresa_id: user.empresa_id ?? null,
  };

  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });

  const refresh_token = jwt.sign(
    { sub: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );

  return { access_token, refresh_token };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setRefreshCookie(res, token) {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  res.cookie('reca_refresh', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/api/auth',
  });
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', registerLimiter, async (req, res) => {
  const { nombre, email, password, empresa_nombre } = req.body;

  if (!nombre || nombre.trim().length < 3)
    return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: 'Correo electrónico inválido' });

  if (!password || password.length < 8)
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });

  if (!empresa_nombre || empresa_nombre.trim().length < 3)
    return res.status(400).json({ message: 'El nombre del negocio debe tener al menos 3 caracteres' });

  const normalizedEmail = email.trim().toLowerCase();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing)
    return res.status(409).json({ message: 'Este correo ya está registrado' });

  const password_hash = await bcrypt.hash(password, 12);
  const userId        = uuidv4();
  const empresaId     = uuidv4();

  // Ensure unique slug
  let slug = slugify(empresa_nombre.trim());
  const existingSlug = db.prepare('SELECT id FROM empresas WHERE slug = ?').get(slug);
  if (existingSlug) slug = `${slug}-${Date.now()}`;

  db.transaction(() => {
    db.prepare(
      'INSERT INTO empresas (id, nombre, slug, plan, estado) VALUES (?, ?, ?, ?, ?)'
    ).run(empresaId, empresa_nombre.trim(), slug, 'start', 'activa');

    db.prepare(
      'INSERT INTO users (id, email, password_hash, nombre, role, empresa_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(userId, normalizedEmail, password_hash, nombre.trim(), 'admin_negocio', empresaId);
  })();

  res.status(201).json({ message: 'Cuenta creada exitosamente' });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Correo y contraseña requeridos' });

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare(
    'SELECT u.*, e.nombre AS empresa_nombre FROM users u LEFT JOIN empresas e ON u.empresa_id = e.id WHERE u.email = ?'
  ).get(normalizedEmail);

  if (!user || !await bcrypt.compare(password, user.password_hash))
    return res.status(401).json({ message: 'Correo o contraseña incorrectos' });

  if (!user.activo)
    return res.status(403).json({ message: 'Cuenta suspendida. Contacta a soporte.' });

  const { access_token, refresh_token } = issueTokens(user);

  // Persist refresh token
  const sessionId     = uuidv4();
  const expiresAt     = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const tokenHash     = hashToken(refresh_token);
  const ip            = req.ip;
  const ua            = req.headers['user-agent'] || '';

  db.prepare(
    `INSERT INTO sesiones (id, user_id, empresa_id, refresh_token_hash, ip_address, user_agent, expires_at, ultimo_acceso)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  ).run(sessionId, user.id, user.empresa_id, tokenHash, ip, ua, expiresAt);

  db.prepare('UPDATE users SET last_access = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

  setRefreshCookie(res, refresh_token);

  res.json({
    access_token,
    user: {
      id:             user.id,
      email:          user.email,
      nombre:         user.nombre,
      role:           user.role,
      empresa_id:     user.empresa_id,
      empresa_nombre: user.empresa_nombre,
    },
  });
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
router.post('/refresh', (req, res) => {
  const token = req.cookies?.reca_refresh;
  if (!token) return res.status(401).json({ message: 'Refresh token no encontrado' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ message: 'Refresh token inválido o expirado' });
  }

  const tokenHash = hashToken(token);
  const session   = db.prepare(
    "SELECT * FROM sesiones WHERE user_id = ? AND refresh_token_hash = ? AND estado = 'activo'"
  ).get(payload.sub, tokenHash);

  if (!session) return res.status(401).json({ message: 'Sesión no encontrada o revocada' });

  const user = db.prepare(
    'SELECT u.*, e.nombre AS empresa_nombre FROM users u LEFT JOIN empresas e ON u.empresa_id = e.id WHERE u.id = ?'
  ).get(payload.sub);

  if (!user || !user.activo)
    return res.status(403).json({ message: 'Usuario no disponible' });

  const { access_token, refresh_token: newRefresh } = issueTokens(user);

  // Rotate refresh token
  db.prepare('UPDATE sesiones SET estado = ? WHERE id = ?').run('expirado', session.id);

  const newSessionId = uuidv4();
  const expiresAt    = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(
    `INSERT INTO sesiones (id, user_id, empresa_id, refresh_token_hash, ip_address, user_agent, expires_at, ultimo_acceso)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  ).run(newSessionId, user.id, user.empresa_id, hashToken(newRefresh), req.ip, req.headers['user-agent'] || '', expiresAt);

  setRefreshCookie(res, newRefresh);

  res.json({
    access_token,
    user: {
      id:             user.id,
      email:          user.email,
      nombre:         user.nombre,
      role:           user.role,
      empresa_id:     user.empresa_id,
      empresa_nombre: user.empresa_nombre,
    },
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  const token = req.cookies?.reca_refresh;
  if (token) {
    const hash = hashToken(token);
    db.prepare(
      "UPDATE sesiones SET estado = 'cerrado' WHERE refresh_token_hash = ?"
    ).run(hash);
  }
  res.clearCookie('reca_refresh', { path: '/api/auth' });
  res.json({ message: 'Sesión cerrada' });
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', forgotPasswordLimiter, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Correo requerido' });

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());

  // Always return 200 to avoid revealing if email exists
  if (!user) return res.json({ message: 'Si el correo está registrado, recibirás un enlace de recuperación.' });

  // Invalidate previous tokens
  db.prepare('UPDATE password_resets SET usado = 1 WHERE user_id = ? AND usado = 0').run(user.id);

  const rawToken  = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.prepare(
    'INSERT INTO password_resets (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
  ).run(uuidv4(), user.id, tokenHash, expiresAt);

  // In production: send email with reset link
  // In development: expose token so it can be tested without SMTP
  const resetUrl = `${req.protocol}://${req.get('host')}/app/login/reset-password.html?token=${rawToken}`;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n[DEV] Password reset link for ${email}:\n${resetUrl}\n`);
    return res.json({
      message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
      _dev_reset_url: resetUrl,
    });
  }

  res.json({ message: 'Si el correo está registrado, recibirás un enlace de recuperación.' });
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token y nueva contraseña requeridos' });
  if (password.length < 8) return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });

  const tokenHash = hashToken(token);
  const reset = db.prepare(
    "SELECT * FROM password_resets WHERE token_hash = ? AND usado = 0 AND expires_at > CURRENT_TIMESTAMP"
  ).get(tokenHash);

  if (!reset) return res.status(400).json({ message: 'Enlace inválido o expirado' });

  const newHash = await bcrypt.hash(password, 12);

  db.transaction(() => {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, reset.user_id);
    db.prepare('UPDATE password_resets SET usado = 1 WHERE id = ?').run(reset.id);
    // Invalidate all active sessions for security
    db.prepare("UPDATE sesiones SET estado = 'cerrado' WHERE user_id = ? AND estado = 'activo'").run(reset.user_id);
  })();

  res.json({ message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(
    'SELECT u.id, u.email, u.nombre, u.role, u.empresa_id, u.last_access, e.nombre AS empresa_nombre, e.plan FROM users u LEFT JOIN empresas e ON u.empresa_id = e.id WHERE u.id = ?'
  ).get(req.user.sub);

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  res.json({ user });
});

module.exports = router;
