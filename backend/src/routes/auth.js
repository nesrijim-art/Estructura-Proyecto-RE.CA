'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto   = require('crypto');
const db       = require('../db/database');
const { requireAuth, requireRole } = require('../middleware/auth');
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
    sub:        user.id,
    email:      user.email,
    nombre:     user.nombre,
    role:       user.role,
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
  res.cookie('reca_refresh', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000,
    path:     '/api/auth',
  });
}

function superAdminExists() {
  return !!db.prepare("SELECT id FROM users WHERE role = 'super_admin' LIMIT 1").get();
}

// ─── GET /api/auth/setup/status ───────────────────────────────────────────────
// Public endpoint — tells the frontend whether initial setup is required.
router.get('/setup/status', (_req, res) => {
  res.json({ needs_setup: !superAdminExists() });
});

// ─── POST /api/auth/setup ─────────────────────────────────────────────────────
// Creates the one and only Super Administrator.
// Protected by SETUP_KEY from .env — not a public registration form.
router.post('/setup', async (req, res) => {
  if (superAdminExists())
    return res.status(409).json({ message: 'El sistema ya está configurado. No se puede crear un segundo Super Administrador.' });

  const { nombre, email, password, setup_key } = req.body;

  const expectedKey = process.env.SETUP_KEY;
  if (!expectedKey || setup_key !== expectedKey)
    return res.status(403).json({ message: 'Clave de configuración inválida' });

  if (!nombre || nombre.trim().length < 3)
    return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: 'Correo electrónico inválido' });

  if (!password || password.length < 8)
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });

  const normalizedEmail = email.trim().toLowerCase();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail))
    return res.status(409).json({ message: 'Este correo ya está registrado' });

  const password_hash = await bcrypt.hash(password, 12);

  db.prepare(
    'INSERT INTO users (id, email, password_hash, nombre, role, empresa_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(uuidv4(), normalizedEmail, password_hash, nombre.trim(), 'super_admin', null);

  res.status(201).json({ message: 'Super Administrador creado. Ya puedes iniciar sesión.' });
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────
// Public registration — always creates admin_negocio + nueva empresa.
// Cannot create super_admin through this route (ever).
router.post('/register', registerLimiter, async (req, res) => {
  // Block if setup hasn't been completed — avoids orphan tenants without a super admin
  if (!superAdminExists())
    return res.status(503).json({ message: 'La plataforma aún no está configurada. Contacta al administrador.' });

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

  if (db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail))
    return res.status(409).json({ message: 'Este correo ya está registrado' });

  const password_hash = await bcrypt.hash(password, 12);
  const userId        = uuidv4();
  const empresaId     = uuidv4();

  let slug = slugify(empresa_nombre.trim());
  if (db.prepare('SELECT id FROM empresas WHERE slug = ?').get(slug))
    slug = `${slug}-${Date.now()}`;

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

  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(
    `INSERT INTO sesiones (id, user_id, empresa_id, refresh_token_hash, ip_address, user_agent, expires_at, ultimo_acceso)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  ).run(sessionId, user.id, user.empresa_id, hashToken(refresh_token), req.ip, req.headers['user-agent'] || '', expiresAt);

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
    db.prepare("UPDATE sesiones SET estado = 'cerrado' WHERE refresh_token_hash = ?")
      .run(hashToken(token));
  }
  res.clearCookie('reca_refresh', { path: '/api/auth' });
  res.json({ message: 'Sesión cerrada' });
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', forgotPasswordLimiter, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Correo requerido' });

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());

  if (!user) return res.json({ message: 'Si el correo está registrado, recibirás un enlace de recuperación.' });

  db.prepare('UPDATE password_resets SET usado = 1 WHERE user_id = ? AND usado = 0').run(user.id);

  const rawToken  = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  db.prepare(
    'INSERT INTO password_resets (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
  ).run(uuidv4(), user.id, tokenHash, expiresAt);

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
    db.prepare("UPDATE sesiones SET estado = 'cerrado' WHERE user_id = ? AND estado = 'activo'").run(reset.user_id);
  })();

  res.json({ message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(
    `SELECT u.id, u.email, u.nombre, u.role, u.empresa_id, u.last_access,
            e.nombre AS empresa_nombre, e.plan
     FROM users u
     LEFT JOIN empresas e ON u.empresa_id = e.id
     WHERE u.id = ?`
  ).get(req.user.sub);

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  res.json({
    user,
    // Forward impersonation context if active
    impersonating:            req.user.impersonating         ?? false,
    impersonating_empresa_id: req.user.impersonating_empresa_id ?? null,
  });
});

// ─── POST /api/auth/impersonate/:empresaId ────────────────────────────────────
// Super Admin only. Issues a short-lived access token scoped to the target
// empresa. The super admin's refresh cookie is NOT touched — calling
// /stop-impersonating (or waiting for the token to expire) returns to normal.
router.post('/impersonate/:empresaId', requireAuth, requireRole('super_admin'), (req, res) => {
  const { empresaId } = req.params;

  const empresa = db.prepare(
    "SELECT id, nombre, plan, estado FROM empresas WHERE id = ?"
  ).get(empresaId);

  if (!empresa)
    return res.status(404).json({ message: 'Empresa no encontrada' });

  if (empresa.estado !== 'activa')
    return res.status(403).json({ message: `No se puede acceder a una empresa ${empresa.estado}` });

  // Issue impersonation access token (1 hour, no refresh)
  const superAdmin = db.prepare('SELECT id, email, nombre, role FROM users WHERE id = ?').get(req.user.sub);

  const impersonationPayload = {
    sub:                        superAdmin.id,
    email:                      superAdmin.email,
    nombre:                     superAdmin.nombre,
    role:                       'super_admin',
    empresa_id:                 empresaId,        // scoped to target empresa
    impersonating:              true,
    impersonating_empresa_id:   empresaId,
  };

  const impersonation_token = jwt.sign(impersonationPayload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Audit record — not a refresh session, no refresh_token_hash needed
  // We store a deterministic hash of the token itself for audit closure
  const auditHash = hashToken(impersonation_token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  db.prepare(
    `INSERT INTO sesiones
       (id, user_id, empresa_id, refresh_token_hash, ip_address, user_agent,
        expires_at, ultimo_acceso, impersonating_empresa_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`
  ).run(
    uuidv4(), superAdmin.id, null,
    auditHash,
    req.ip, req.headers['user-agent'] || '',
    expiresAt, empresaId
  );

  console.log(`[AUDIT] Super Admin ${superAdmin.email} started impersonating empresa "${empresa.nombre}" (${empresaId})`);

  res.json({
    impersonation_token,
    empresa: {
      id:     empresa.id,
      nombre: empresa.nombre,
      plan:   empresa.plan,
    },
  });
});

// ─── POST /api/auth/stop-impersonating ───────────────────────────────────────
// Closes the impersonation audit record.
// The client discards its impersonation_token and reverts to its original
// access token (obtained from the unchanged reca_refresh cookie via /refresh).
router.post('/stop-impersonating', requireAuth, (req, res) => {
  if (!req.user.impersonating)
    return res.status(400).json({ message: 'No hay una sesión de impersonación activa' });

  // Mark the audit session closed
  const tokenFromHeader = (req.headers.authorization || '').replace('Bearer ', '');
  if (tokenFromHeader) {
    db.prepare(
      "UPDATE sesiones SET estado = 'cerrado' WHERE refresh_token_hash = ? AND impersonating_empresa_id IS NOT NULL"
    ).run(hashToken(tokenFromHeader));
  }

  console.log(`[AUDIT] Super Admin ${req.user.email} stopped impersonating empresa ${req.user.impersonating_empresa_id}`);

  res.json({ message: 'Impersonación finalizada' });
});

module.exports = router;
