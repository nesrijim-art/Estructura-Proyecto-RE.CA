'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { requireEmpresaRole } = require('../middleware/requireEmpresaRole');

const router = express.Router();

// ── Helpers ───────────────────────────────────────────────────────────────────

function hashToken(t) {
  return crypto.createHash('sha256').update(t).digest('hex');
}

/** Returns the empresa_id scoped to the current request (handles impersonation). */
function getEmpresaId(req) {
  return req.user.impersonating
    ? req.user.impersonating_empresa_id
    : req.user.empresa_id;
}

/** Check whether the empresa can add one more user, based on plan.usuarios_max. */
function userLimitCheck(empresaId) {
  const row = db.prepare(`
    SELECT p.usuarios_max
    FROM empresas e
    LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(empresaId);

  // Fallback: no plan linked yet → use start plan default (2 users)
  let max = row?.usuarios_max ?? 2;

  // Legacy empresa without plan_id — look up via text column
  if (!row) {
    const leg = db.prepare(`SELECT plan FROM empresas WHERE id = ?`).get(empresaId);
    if (leg?.plan) {
      const p = db.prepare(`SELECT usuarios_max FROM planes WHERE id = ?`).get(leg.plan);
      max = p?.usuarios_max ?? 2;
    }
  }

  if (max === 0) return { ok: true, current: null, max: 0 }; // unlimited (premium)

  const count = db.prepare(
    `SELECT COUNT(*) AS n FROM users WHERE empresa_id = ? AND activo = 1`
  ).get(empresaId).n;

  return { ok: count < max, current: count, max };
}

/** Safe public user view (strips sensitive fields). */
function publicUser(u) {
  return {
    id:           u.id,
    nombre:       u.nombre,
    email:        u.email,
    rol_empresa:  u.rol_empresa,
    activo:       !!u.activo,
    created_at:   u.created_at,
    last_access:  u.last_access,
  };
}

// ── GET /api/usuarios — list users of the empresa ─────────────────────────────
router.get('/', requireAuth, requireEmpresaRole('dueno','admin'), (req, res) => {
  const empresaId = getEmpresaId(req);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const users = db.prepare(`
    SELECT id, nombre, email, rol_empresa, activo, created_at, last_access
    FROM users
    WHERE empresa_id = ?
    ORDER BY created_at ASC
  `).all(empresaId);

  // Include plan limit info for the UI
  const limit = userLimitCheck(empresaId);

  res.json({
    usuarios: users.map(publicUser),
    limite: { max: limit.max, actual: limit.current ?? users.length },
  });
});

// ── GET /api/usuarios/invitaciones — pending invitations ─────────────────────
router.get('/invitaciones', requireAuth, requireEmpresaRole('dueno','admin'), (req, res) => {
  const empresaId = getEmpresaId(req);
  const rows = db.prepare(`
    SELECT id, contacto, metodo, rol, usado, expira_at, created_at
    FROM tokens_invitacion
    WHERE empresa_id = ? AND usado = 0 AND expira_at > datetime('now')
    ORDER BY created_at DESC
  `).all(empresaId);
  res.json(rows);
});

// ── POST /api/usuarios/invitar ────────────────────────────────────────────────
router.post('/invitar', requireAuth, requireEmpresaRole('dueno','admin'), (req, res) => {
  const empresaId = getEmpresaId(req);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const { contacto, rol, metodo = 'enlace' } = req.body;

  const validRoles = ['admin','editor','visualizador'];
  if (!contacto) return res.status(400).json({ message: 'contacto es requerido' });
  if (!validRoles.includes(rol)) return res.status(400).json({ message: `rol inválido — valores: ${validRoles.join(', ')}` });

  // Enforce user limit
  const limit = userLimitCheck(empresaId);
  if (!limit.ok) {
    return res.status(403).json({
      message: `Has alcanzado el límite de usuarios de tu plan (máx. ${limit.max}). Actualiza tu plan para invitar más colaboradores.`,
      upgrade_required: true,
    });
  }

  // Invalidate any previous pending invitation for this contacto in this empresa
  db.prepare(`
    UPDATE tokens_invitacion SET usado = 1
    WHERE empresa_id = ? AND contacto = ? AND usado = 0
  `).run(empresaId, contacto);

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  const empresa = db.prepare('SELECT nombre FROM empresas WHERE id = ?').get(empresaId);

  db.prepare(`
    INSERT INTO tokens_invitacion (id, token_hash, empresa_id, rol, contacto, metodo, expira_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), tokenHash, empresaId, rol, contacto, metodo, expiresAt);

  const inviteUrl = `/app/login/registro-colaborador.html?token=${rawToken}`;

  res.status(201).json({
    message: 'Invitación generada',
    // In production this would be sent via email/WhatsApp.
    // In development, return the URL directly.
    _dev_invite_url: inviteUrl,
    empresa_nombre: empresa?.nombre,
    rol,
    expira_at: expiresAt,
    metodo,
  });
});

// ── GET /api/usuarios/invitacion/:token — validate token (public) ─────────────
router.get('/invitacion/:token', (req, res) => {
  const tokenHash = hashToken(req.params.token);
  const row = db.prepare(`
    SELECT t.id, t.rol, t.contacto, t.usado, t.expira_at, e.nombre AS empresa_nombre
    FROM tokens_invitacion t
    JOIN empresas e ON t.empresa_id = e.id
    WHERE t.token_hash = ?
  `).get(tokenHash);

  if (!row) return res.status(404).json({ message: 'Token de invitación no encontrado' });
  if (row.usado)  return res.status(410).json({ message: 'Este enlace ya fue utilizado' });
  if (new Date(row.expira_at) < new Date())
    return res.status(410).json({ message: 'Este enlace ha expirado' });

  res.json({
    valido:         true,
    rol:            row.rol,
    contacto:       row.contacto,
    empresa_nombre: row.empresa_nombre,
  });
});

// ── POST /api/usuarios/registro-colaborador — accept invitation (public) ──────
router.post('/registro-colaborador', async (req, res) => {
  const { token, nombre, password } = req.body;

  if (!token || !nombre || !password)
    return res.status(400).json({ message: 'token, nombre y password son requeridos' });
  if (password.length < 8)
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
  if (nombre.trim().length < 3)
    return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });

  const tokenHash = hashToken(token);
  const inv = db.prepare(`
    SELECT t.*, e.nombre AS empresa_nombre
    FROM tokens_invitacion t
    JOIN empresas e ON t.empresa_id = e.id
    WHERE t.token_hash = ?
  `).get(tokenHash);

  if (!inv)                             return res.status(404).json({ message: 'Token no encontrado' });
  if (inv.usado)                        return res.status(410).json({ message: 'Este enlace ya fue utilizado' });
  if (new Date(inv.expira_at) < new Date()) return res.status(410).json({ message: 'Este enlace ha expirado' });

  // Re-check user limit (race condition guard)
  const limit = userLimitCheck(inv.empresa_id);
  if (!limit.ok)
    return res.status(403).json({ message: 'El negocio ha alcanzado el límite de usuarios de su plan' });

  // Derive email from contacto if it looks like one, else generate placeholder
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inv.contacto)
    ? inv.contacto.toLowerCase()
    : `${uuidv4().slice(0, 8)}@colaborador.reca`;

  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email))
    return res.status(409).json({ message: 'Ya existe una cuenta con este correo' });

  const password_hash = await bcrypt.hash(password, 12);

  db.transaction(() => {
    db.prepare(`
      INSERT INTO users (id, email, password_hash, nombre, role, empresa_id, rol_empresa)
      VALUES (?, ?, ?, ?, 'colaborador', ?, ?)
    `).run(uuidv4(), email, password_hash, nombre.trim(), inv.empresa_id, inv.rol);

    db.prepare(`UPDATE tokens_invitacion SET usado = 1 WHERE token_hash = ?`).run(tokenHash);
  })();

  res.status(201).json({
    message: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
    empresa_nombre: inv.empresa_nombre,
    rol: inv.rol,
  });
});

// ── PUT /api/usuarios/:id/rol — change intra-empresa role ─────────────────────
router.put('/:id/rol', requireAuth, requireEmpresaRole('dueno'), (req, res) => {
  const empresaId = getEmpresaId(req);
  const { id } = req.params;
  const { rol_empresa } = req.body;

  const valid = ['admin','editor','visualizador'];
  if (!valid.includes(rol_empresa))
    return res.status(400).json({ message: `rol_empresa inválido. Valores: ${valid.join(', ')}` });

  const target = db.prepare(
    'SELECT id, rol_empresa FROM users WHERE id = ? AND empresa_id = ?'
  ).get(id, empresaId);

  if (!target) return res.status(404).json({ message: 'Usuario no encontrado en tu empresa' });
  if (target.rol_empresa === 'dueno')
    return res.status(403).json({ message: 'No se puede cambiar el rol del Dueño' });

  db.prepare('UPDATE users SET rol_empresa = ? WHERE id = ?').run(rol_empresa, id);
  res.json({ message: 'Rol actualizado', id, rol_empresa });
});

// ── PUT /api/usuarios/:id/estado — activate/suspend user ─────────────────────
router.put('/:id/estado', requireAuth, requireEmpresaRole('dueno','admin'), (req, res) => {
  const empresaId = getEmpresaId(req);
  const { id } = req.params;
  const { activo } = req.body;

  if (typeof activo !== 'boolean')
    return res.status(400).json({ message: 'activo debe ser true o false' });

  const target = db.prepare(
    'SELECT id, rol_empresa FROM users WHERE id = ? AND empresa_id = ?'
  ).get(id, empresaId);

  if (!target) return res.status(404).json({ message: 'Usuario no encontrado' });
  if (target.rol_empresa === 'dueno')
    return res.status(403).json({ message: 'No se puede suspender al Dueño' });

  db.prepare('UPDATE users SET activo = ? WHERE id = ?').run(activo ? 1 : 0, id);
  res.json({ message: activo ? 'Usuario activado' : 'Usuario suspendido', id });
});

// ── DELETE /api/usuarios/:id — remove collaborator (dueno only) ──────────────
router.delete('/:id', requireAuth, requireEmpresaRole('dueno'), (req, res) => {
  const empresaId = getEmpresaId(req);
  const { id } = req.params;

  // Cannot delete yourself
  if (id === req.user.sub)
    return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta' });

  const target = db.prepare(
    'SELECT id, rol_empresa FROM users WHERE id = ? AND empresa_id = ?'
  ).get(id, empresaId);

  if (!target) return res.status(404).json({ message: 'Usuario no encontrado' });
  if (target.rol_empresa === 'dueno')
    return res.status(403).json({ message: 'No se puede eliminar al Dueño' });

  db.transaction(() => {
    // Close all active sessions for this user
    db.prepare(`UPDATE sesiones SET estado = 'cerrado' WHERE user_id = ?`).run(id);
    // Hard delete from users (soft delete would be preferable but not required by M04 spec)
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
  })();

  res.json({ message: 'Usuario eliminado', id });
});

module.exports = router;
