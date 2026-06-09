'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/planes — list all active plans (public) ─────────────────────────
router.get('/', (req, res) => {
  const planes = db.prepare(`SELECT * FROM planes WHERE estado = 'activo' ORDER BY precio_mensual ASC`).all();
  res.json(planes);
});

// ── GET /api/planes/mi-plan — current plan + flags for authenticated empresa ─
router.get('/mi-plan', requireAuth, (req, res) => {
  const empresaId = req.user.impersonating
    ? req.user.impersonating_empresa_id
    : req.user.empresa_id;

  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const empresa = db.prepare(`
    SELECT e.*, p.id AS plan_id, p.nombre AS plan_nombre, p.precio_mensual,
           p.usuarios_max, p.productos_max, p.idiomas_max,
           p.ia_texto, p.ia_imagenes, p.analytics_basico, p.analytics_avanzado,
           p.marketing_basico, p.marketing_avanzado, p.automatizaciones,
           p.menu_dinamico, p.calendario_ia, p.publicaciones_automaticas
    FROM empresas e
    LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(empresaId);

  if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

  // If empresa has no plan_id yet, fall back to legacy 'plan' text field → find matching plan
  let flags = null;
  if (!empresa.plan_id) {
    const legacyPlan = db.prepare(`SELECT * FROM planes WHERE id = ?`).get(empresa.plan || 'start');
    flags = legacyPlan || null;
  }

  res.json({
    empresa_id:           empresa.id,
    nombre:               empresa.nombre,
    plan_id:              empresa.plan_id || empresa.plan || 'start',
    plan_nombre:          empresa.plan_nombre || (flags && flags.nombre) || empresa.plan,
    precio_mensual:       empresa.precio_mensual ?? (flags && flags.precio_mensual) ?? 0,
    fecha_activacion_plan: empresa.fecha_activacion_plan,
    fecha_renovacion_plan: empresa.fecha_renovacion_plan,
    estado_suscripcion:   empresa.estado_suscripcion || 'activa',
    features: {
      usuarios_max:              empresa.usuarios_max              ?? (flags && flags.usuarios_max)              ?? 2,
      productos_max:             empresa.productos_max             ?? (flags && flags.productos_max)             ?? 50,
      idiomas_max:               empresa.idiomas_max               ?? (flags && flags.idiomas_max)               ?? 1,
      ia_texto:                  !!(empresa.ia_texto               ?? (flags && flags.ia_texto)               ?? 0),
      ia_imagenes:               !!(empresa.ia_imagenes            ?? (flags && flags.ia_imagenes)            ?? 0),
      analytics_basico:          !!(empresa.analytics_basico       ?? (flags && flags.analytics_basico)       ?? 0),
      analytics_avanzado:        !!(empresa.analytics_avanzado     ?? (flags && flags.analytics_avanzado)     ?? 0),
      marketing_basico:          !!(empresa.marketing_basico       ?? (flags && flags.marketing_basico)       ?? 0),
      marketing_avanzado:        !!(empresa.marketing_avanzado     ?? (flags && flags.marketing_avanzado)     ?? 0),
      automatizaciones:          !!(empresa.automatizaciones       ?? (flags && flags.automatizaciones)       ?? 0),
      menu_dinamico:             !!(empresa.menu_dinamico          ?? (flags && flags.menu_dinamico)          ?? 0),
      calendario_ia:             !!(empresa.calendario_ia          ?? (flags && flags.calendario_ia)          ?? 0),
      publicaciones_automaticas: !!(empresa.publicaciones_automaticas ?? (flags && flags.publicaciones_automaticas) ?? 0),
    },
  });
});

// ── GET /api/planes/historial — payment history for the empresa ───────────────
router.get('/historial', requireAuth, (req, res) => {
  const empresaId = req.user.impersonating
    ? req.user.impersonating_empresa_id
    : req.user.empresa_id;

  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const rows = db.prepare(`
    SELECT h.*, pn.nombre AS plan_nuevo_nombre, pa.nombre AS plan_anterior_nombre
    FROM historial_pagos h
    LEFT JOIN planes pn ON h.plan_nuevo_id = pn.id
    LEFT JOIN planes pa ON h.plan_anterior_id = pa.id
    WHERE h.empresa_id = ?
    ORDER BY h.created_at DESC
    LIMIT 100
  `).all(empresaId);

  res.json(rows);
});

// ── PUT /api/planes/empresa/:empresaId — super admin changes a plan ───────────
router.put('/empresa/:empresaId', requireAuth, requireRole('super_admin'), (req, res) => {
  const { empresaId } = req.params;
  const { plan_id, descripcion, monto = 0, metodo_pago = 'manual' } = req.body;

  if (!plan_id) return res.status(400).json({ message: 'plan_id es requerido' });

  const plan = db.prepare(`SELECT * FROM planes WHERE id = ? AND estado = 'activo'`).get(plan_id);
  if (!plan) return res.status(404).json({ message: 'Plan no encontrado o inactivo' });

  const empresa = db.prepare(`SELECT * FROM empresas WHERE id = ?`).get(empresaId);
  if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

  const now = new Date();
  const renovacion = new Date(now);
  renovacion.setMonth(renovacion.getMonth() + 1);

  const planAnteriorId = empresa.plan_id || empresa.plan || null;

  // No-op guard: if the empresa already has this exact plan active, skip the
  // write entirely to avoid resetting fecha_activacion_plan and creating
  // spurious history entries.
  if (planAnteriorId === plan_id && empresa.estado_suscripcion === 'activa') {
    return res.json({
      message: `La empresa ya tiene el plan ${plan.nombre} activo. No se realizaron cambios.`,
      plan_id,
      fecha_renovacion_plan: empresa.fecha_renovacion_plan,
      changed: false,
    });
  }

  const tipo = planAnteriorId ? 'cambio_plan' : 'activacion';
  const desc = descripcion || `Cambio de plan a ${plan.nombre}`;

  db.transaction(() => {
    db.prepare(`
      UPDATE empresas SET
        plan_id = ?, plan = ?,
        fecha_activacion_plan = ?, fecha_renovacion_plan = ?,
        estado_suscripcion = 'activa'
      WHERE id = ?
    `).run(plan_id, plan_id, now.toISOString(), renovacion.toISOString(), empresaId);

    db.prepare(`
      INSERT INTO historial_pagos (id, empresa_id, tipo, descripcion, plan_anterior_id, plan_nuevo_id, monto, estado, metodo_pago)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pagado', ?)
    `).run(uuidv4(), empresaId, tipo, desc, planAnteriorId, plan_id, monto, metodo_pago);
  })();

  res.json({ message: `Plan actualizado a ${plan.nombre}`, plan_id, fecha_renovacion_plan: renovacion.toISOString() });
});

// ── POST /api/planes — super admin creates a new plan ────────────────────────
router.post('/', requireAuth, requireRole('super_admin'), (req, res) => {
  const {
    id, nombre, precio_mensual = 0,
    usuarios_max = 0, productos_max = 0, idiomas_max = 1,
    ia_texto = 0, ia_imagenes = 0, analytics_basico = 0, analytics_avanzado = 0,
    marketing_basico = 0, marketing_avanzado = 0, automatizaciones = 0,
    menu_dinamico = 0, calendario_ia = 0, publicaciones_automaticas = 0,
  } = req.body;

  if (!id || !nombre) return res.status(400).json({ message: 'id y nombre son requeridos' });

  const existing = db.prepare(`SELECT id FROM planes WHERE id = ?`).get(id);
  if (existing) return res.status(409).json({ message: 'Ya existe un plan con ese id' });

  db.prepare(`
    INSERT INTO planes (id, nombre, precio_mensual, usuarios_max, productos_max, idiomas_max,
      ia_texto, ia_imagenes, analytics_basico, analytics_avanzado,
      marketing_basico, marketing_avanzado, automatizaciones,
      menu_dinamico, calendario_ia, publicaciones_automaticas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, nombre, precio_mensual, usuarios_max, productos_max, idiomas_max,
    ia_texto ? 1 : 0, ia_imagenes ? 1 : 0, analytics_basico ? 1 : 0, analytics_avanzado ? 1 : 0,
    marketing_basico ? 1 : 0, marketing_avanzado ? 1 : 0, automatizaciones ? 1 : 0,
    menu_dinamico ? 1 : 0, calendario_ia ? 1 : 0, publicaciones_automaticas ? 1 : 0);

  res.status(201).json({ message: 'Plan creado', id });
});

// ── PUT /api/planes/:id — super admin edits a plan ───────────────────────────
router.put('/:id', requireAuth, requireRole('super_admin'), (req, res) => {
  const { id } = req.params;
  const plan = db.prepare(`SELECT * FROM planes WHERE id = ?`).get(id);
  if (!plan) return res.status(404).json({ message: 'Plan no encontrado' });

  const allowed = ['nombre','precio_mensual','usuarios_max','productos_max','idiomas_max',
    'ia_texto','ia_imagenes','analytics_basico','analytics_avanzado',
    'marketing_basico','marketing_avanzado','automatizaciones',
    'menu_dinamico','calendario_ia','publicaciones_automaticas','estado'];

  const updates = [];
  const values = [];
  for (const key of allowed) {
    if (key in req.body) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0) return res.status(400).json({ message: 'Nada que actualizar' });

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  db.prepare(`UPDATE planes SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ message: 'Plan actualizado' });
});

module.exports = router;
