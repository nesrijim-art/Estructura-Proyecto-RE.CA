'use strict';

const express = require('express');
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes in this module are super_admin only.
router.use(requireAuth, requireRole('super_admin'));

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Derives the display estado for the UI from two DB columns.
 * empresas.estado controls platform-level access (activa/suspendida/cancelada).
 * empresas.estado_suscripcion holds subscription context (activa/prueba/vencida).
 * UI states: 'activo' | 'prueba' | 'suspendido' | 'cancelado'
 */
function resolveEstadoDisplay(estado, estado_suscripcion) {
  if (estado === 'suspendida') return 'suspendido';
  if (estado === 'cancelada')  return 'cancelado';
  if (estado_suscripcion === 'prueba') return 'prueba';
  return 'activo';
}

// Safely count products — returns 0 if the productos table doesn't exist yet (pre-M06).
let productosTableChecked = null;
function countProductos(empresaId) {
  if (productosTableChecked === null) {
    const tbl = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='productos'"
    ).get();
    productosTableChecked = !!tbl;
  }
  if (!productosTableChecked) return 0;
  const row = db.prepare(
    "SELECT COUNT(*) AS n FROM productos WHERE empresa_id = ? AND activo = 1"
  ).get(empresaId);
  return row ? row.n : 0;
}

function buildEmpresaRow(e) {
  const propietario = db.prepare(
    "SELECT id, nombre, email FROM users WHERE empresa_id = ? AND role = 'admin_negocio' LIMIT 1"
  ).get(e.id);

  return {
    id:                   e.id,
    nombre:               e.nombre,
    slug:                 e.slug,
    ciudad:               e.ciudad || null,
    plan_id:              e.plan_id || e.plan || 'start',
    plan_nombre:          e.plan_nombre || e.plan || 'Start',
    estado:               resolveEstadoDisplay(e.estado, e.estado_suscripcion),
    estado_suscripcion:   e.estado_suscripcion || 'activa',
    fecha_activacion_plan: e.fecha_activacion_plan || e.created_at,
    fecha_renovacion_plan: e.fecha_renovacion_plan || null,
    notas_soporte:        e.notas_soporte || null,
    created_at:           e.created_at,
    propietario: propietario
      ? { id: propietario.id, nombre: propietario.nombre, email: propietario.email }
      : null,
    productos_count: countProductos(e.id),
  };
}

// ── GET /api/multiempresa/stats ────────────────────────────────────────────────
router.get('/stats', (_req, res) => {
  const total      = db.prepare("SELECT COUNT(*) AS n FROM empresas WHERE estado != 'cancelada'").get().n;
  const activos    = db.prepare("SELECT COUNT(*) AS n FROM empresas WHERE estado = 'activa' AND (estado_suscripcion IS NULL OR estado_suscripcion = 'activa')").get().n;
  const prueba     = db.prepare("SELECT COUNT(*) AS n FROM empresas WHERE estado = 'activa' AND estado_suscripcion = 'prueba'").get().n;
  const suspendidos = db.prepare("SELECT COUNT(*) AS n FROM empresas WHERE estado = 'suspendida'").get().n;
  const cancelados  = db.prepare("SELECT COUNT(*) AS n FROM empresas WHERE estado = 'cancelada'").get().n;

  // Negocios con renovación en los próximos 7 días
  const proximosVencer = db.prepare(`
    SELECT COUNT(*) AS n FROM empresas
    WHERE estado = 'activa'
      AND fecha_renovacion_plan IS NOT NULL
      AND fecha_renovacion_plan > datetime('now')
      AND fecha_renovacion_plan <= datetime('now', '+7 days')
  `).get().n;

  res.json({ total, activos, prueba, suspendidos, cancelados, proximos_vencer: proximosVencer });
});

// ── GET /api/multiempresa/empresas ─────────────────────────────────────────────
// Supports: ?q=búsqueda &estado=activo|prueba|suspendido &plan_id=start|business|premium
//           &page=1 &limit=50
router.get('/empresas', (req, res) => {
  const { q = '', estado = '', plan_id = '', page = '1', limit = '50' } = req.query;

  const pageNum  = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const offset   = (pageNum - 1) * pageSize;

  let whereClauses = ["e.estado != 'cancelada'"];
  const params = [];

  if (q.trim()) {
    whereClauses.push("(e.nombre LIKE ? OR e.ciudad LIKE ?)");
    params.push(`%${q.trim()}%`, `%${q.trim()}%`);
  }

  if (estado) {
    if (estado === 'suspendido') {
      whereClauses.push("e.estado = 'suspendida'");
    } else if (estado === 'prueba') {
      whereClauses.push("e.estado = 'activa' AND e.estado_suscripcion = 'prueba'");
    } else if (estado === 'activo') {
      whereClauses.push("e.estado = 'activa' AND (e.estado_suscripcion IS NULL OR e.estado_suscripcion IN ('activa','vencida'))");
    }
  }

  if (plan_id) {
    whereClauses.push("(e.plan_id = ? OR (e.plan_id IS NULL AND e.plan = ?))");
    params.push(plan_id, plan_id);
  }

  const where = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

  const totalRow = db.prepare(`
    SELECT COUNT(*) AS n FROM empresas e ${where}
  `).get(...params);

  const rows = db.prepare(`
    SELECT e.*, p.nombre AS plan_nombre
    FROM empresas e
    LEFT JOIN planes p ON e.plan_id = p.id
    ${where}
    ORDER BY e.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, pageSize, offset);

  const empresas = rows.map(buildEmpresaRow);

  res.json({
    total: totalRow.n,
    page: pageNum,
    limit: pageSize,
    empresas,
  });
});

// ── GET /api/multiempresa/empresas/:id ─────────────────────────────────────────
router.get('/empresas/:id', (req, res) => {
  const row = db.prepare(`
    SELECT e.*, p.nombre AS plan_nombre
    FROM empresas e
    LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(req.params.id);

  if (!row) return res.status(404).json({ message: 'Empresa no encontrada' });

  res.json(buildEmpresaRow(row));
});

// ── POST /api/multiempresa/empresas ────────────────────────────────────────────
// Super admin creates a new empresa + admin_negocio user directly.
router.post('/empresas', async (req, res) => {
  const {
    empresa_nombre,
    ciudad,
    plan_id = 'start',
    estado_suscripcion = 'activa',
    propietario_nombre,
    propietario_email,
    propietario_password,
  } = req.body;

  // Validations
  if (!empresa_nombre || empresa_nombre.trim().length < 3)
    return res.status(400).json({ message: 'Nombre del negocio: mínimo 3 caracteres' });

  if (!propietario_nombre || propietario_nombre.trim().length < 3)
    return res.status(400).json({ message: 'Nombre del propietario: mínimo 3 caracteres' });

  if (!propietario_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(propietario_email.trim()))
    return res.status(400).json({ message: 'Correo electrónico inválido' });

  if (!propietario_password || propietario_password.length < 8)
    return res.status(400).json({ message: 'Contraseña temporal: mínimo 8 caracteres' });

  const normalizedEmail = propietario_email.trim().toLowerCase();

  if (db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail))
    return res.status(409).json({ message: 'Este correo ya está registrado' });

  const plan = db.prepare("SELECT * FROM planes WHERE id = ? AND estado = 'activo'").get(plan_id);
  if (!plan)
    return res.status(400).json({ message: `Plan '${plan_id}' no encontrado o inactivo` });

  let slug = slugify(empresa_nombre.trim());
  if (db.prepare('SELECT id FROM empresas WHERE slug = ?').get(slug))
    slug = `${slug}-${Date.now()}`;

  const password_hash = await bcrypt.hash(propietario_password, 12);
  const empresaId     = uuidv4();
  const userId        = uuidv4();
  const now           = new Date();
  const renovacion    = new Date(now);
  renovacion.setMonth(renovacion.getMonth() + 1);

  db.transaction(() => {
    db.prepare(`
      INSERT INTO empresas (id, nombre, slug, plan, estado, ciudad, plan_id,
        fecha_activacion_plan, fecha_renovacion_plan, estado_suscripcion)
      VALUES (?, ?, ?, ?, 'activa', ?, ?, ?, ?, ?)
    `).run(
      empresaId, empresa_nombre.trim(), slug, plan_id, ciudad?.trim() || null,
      plan_id, now.toISOString(), renovacion.toISOString(), estado_suscripcion
    );

    db.prepare(`
      INSERT INTO users (id, email, password_hash, nombre, role, empresa_id)
      VALUES (?, ?, ?, ?, 'admin_negocio', ?)
    `).run(userId, normalizedEmail, password_hash, propietario_nombre.trim(), empresaId);

    // Seed historial entry
    db.prepare(`
      INSERT INTO historial_pagos (id, empresa_id, tipo, descripcion, plan_nuevo_id, monto, estado)
      VALUES (?, ?, 'activacion', ?, ?, 0, 'pagado')
    `).run(uuidv4(), empresaId, `Alta de empresa — plan ${plan.nombre}`, plan_id);
  })();

  res.status(201).json({
    message: 'Negocio creado exitosamente',
    empresa_id: empresaId,
    propietario_id: userId,
  });
});

// ── PUT /api/multiempresa/empresas/:id/estado ──────────────────────────────────
// Values accepted: 'activo' | 'prueba' | 'suspendido' | 'cancelado'
router.put('/empresas/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const valid = ['activo', 'prueba', 'suspendido', 'cancelado'];
  if (!valid.includes(estado))
    return res.status(400).json({ message: `Estado inválido. Valores permitidos: ${valid.join(', ')}` });

  const empresa = db.prepare('SELECT * FROM empresas WHERE id = ?').get(id);
  if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

  // Map display state → DB columns
  const updates = {
    activo:     { estado: 'activa',     estado_suscripcion: 'activa'     },
    prueba:     { estado: 'activa',     estado_suscripcion: 'prueba'     },
    suspendido: { estado: 'suspendida', estado_suscripcion: empresa.estado_suscripcion || 'activa' },
    cancelado:  { estado: 'cancelada',  estado_suscripcion: 'cancelada'  },
  };

  const { estado: newEstado, estado_suscripcion: newSub } = updates[estado];

  db.prepare(
    'UPDATE empresas SET estado = ?, estado_suscripcion = ? WHERE id = ?'
  ).run(newEstado, newSub, id);

  res.json({ message: 'Estado actualizado', estado, empresa_id: id });
});

// ── PUT /api/multiempresa/empresas/:id/notas ───────────────────────────────────
// Operational support notes — super admin only.
router.put('/empresas/:id/notas', (req, res) => {
  const { id } = req.params;
  const { notas_soporte } = req.body;

  if (!db.prepare('SELECT id FROM empresas WHERE id = ?').get(id))
    return res.status(404).json({ message: 'Empresa no encontrada' });

  db.prepare('UPDATE empresas SET notas_soporte = ? WHERE id = ?').run(
    notas_soporte ?? null, id
  );

  res.json({ message: 'Notas actualizadas' });
});

module.exports = router;
