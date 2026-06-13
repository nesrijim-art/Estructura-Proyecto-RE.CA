'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireEmpresaRole } = require('../middleware/requireEmpresaRole');
const { requireFeature } = require('../middleware/requireFeature');
const { logHistorial } = require('../scheduler');

const router = express.Router();
router.use(requireAuth);

function resolveEmpresaId(user) {
  return user?.impersonating ? user.impersonating_empresa_id : user?.empresa_id;
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
// GET /automatizaciones/stats
router.get('/stats', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);

  const isSA = req.user.role === 'super_admin';
  let total, activas, pausadas, historial_hoy, alertas_no_leidas;

  if (isSA && !req.user.impersonating) {
    total              = db.prepare(`SELECT COUNT(*) c FROM automatizaciones`).get().c;
    activas            = db.prepare(`SELECT COUNT(*) c FROM automatizaciones WHERE estado='activa'`).get().c;
    pausadas           = db.prepare(`SELECT COUNT(*) c FROM automatizaciones WHERE estado='pausada'`).get().c;
    historial_hoy      = db.prepare(`SELECT COUNT(*) c FROM auto_historial WHERE date(created_at)=date('now')`).get().c;
    alertas_no_leidas  = db.prepare(`SELECT COUNT(*) c FROM alertas_sistema WHERE leida=0`).get().c;
  } else {
    total              = db.prepare(`SELECT COUNT(*) c FROM automatizaciones WHERE empresa_id=?`).get(empresaId).c;
    activas            = db.prepare(`SELECT COUNT(*) c FROM automatizaciones WHERE empresa_id=? AND estado='activa'`).get(empresaId).c;
    pausadas           = db.prepare(`SELECT COUNT(*) c FROM automatizaciones WHERE empresa_id=? AND estado='pausada'`).get(empresaId).c;
    historial_hoy      = db.prepare(`SELECT COUNT(*) c FROM auto_historial WHERE empresa_id=? AND date(created_at)=date('now')`).get(empresaId).c;
    alertas_no_leidas  = db.prepare(`SELECT COUNT(*) c FROM alertas_sistema WHERE empresa_id=? AND leida=0`).get(empresaId).c;
  }

  res.json({ total, activas, pausadas, historial_hoy, alertas_no_leidas });
});

// ─── Automatizaciones CRUD (Premium only) ─────────────────────────────────────

// GET /automatizaciones
router.get('/', requireFeature('automatizaciones'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const { estado } = req.query;

  let sql = `SELECT * FROM automatizaciones WHERE empresa_id = ?`;
  const params = [empresaId];

  if (estado) { sql += ` AND estado = ?`; params.push(estado); }
  sql += ` ORDER BY created_at DESC`;

  res.json(db.prepare(sql).all(...params));
});

// POST /automatizaciones
router.post('/', requireFeature('automatizaciones'), requireEmpresaRole('editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const { nombre, descripcion, tipo, condicion_tipo, condicion_config, accion_config, estado } = req.body;

  const TIPOS_VALIDOS = ['campana_activar','campana_pausar','campana_finalizar','categoria_activar','categoria_pausar','recordatorio'];
  const COND_VALIDOS  = ['cron','fecha_especifica'];

  if (!nombre?.trim()) return res.status(400).json({ message: 'nombre requerido' });
  if (!TIPOS_VALIDOS.includes(tipo)) return res.status(400).json({ message: 'tipo inválido' });
  if (!COND_VALIDOS.includes(condicion_tipo)) return res.status(400).json({ message: 'condicion_tipo inválido' });

  const id = uuidv4();
  db.prepare(`
    INSERT INTO automatizaciones
      (id, empresa_id, nombre, descripcion, tipo, condicion_tipo, condicion_config, accion_config, estado, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, empresaId, nombre.trim(), descripcion || null, tipo, condicion_tipo,
    JSON.stringify(condicion_config || {}), JSON.stringify(accion_config || {}),
    ['activa','pausada'].includes(estado) ? estado : 'activa',
    req.user.id
  );

  logHistorial({
    empresa_id: empresaId,
    tipo: 'crear_automatizacion',
    accion: `Creada automatización "${nombre.trim()}"`,
    resultado: 'exito',
    modulo: 'sistema',
    origen: 'usuario',
  });

  res.status(201).json(db.prepare(`SELECT * FROM automatizaciones WHERE id=?`).get(id));
});

// GET /automatizaciones/:id
router.get('/:id', requireFeature('automatizaciones'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const auto = db.prepare(`SELECT * FROM automatizaciones WHERE id=? AND empresa_id=?`).get(req.params.id, empresaId);
  if (!auto) return res.status(404).json({ message: 'Automatización no encontrada' });
  res.json(auto);
});

// PUT /automatizaciones/:id
router.put('/:id', requireFeature('automatizaciones'), requireEmpresaRole('editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const auto = db.prepare(`SELECT * FROM automatizaciones WHERE id=? AND empresa_id=?`).get(req.params.id, empresaId);
  if (!auto) return res.status(404).json({ message: 'Automatización no encontrada' });

  const { nombre, descripcion, tipo, condicion_tipo, condicion_config, accion_config } = req.body;

  const TIPOS_VALIDOS = ['campana_activar','campana_pausar','campana_finalizar','categoria_activar','categoria_pausar','recordatorio'];
  const COND_VALIDOS  = ['cron','fecha_especifica'];

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) return res.status(400).json({ message: 'tipo inválido' });
  if (condicion_tipo && !COND_VALIDOS.includes(condicion_tipo)) return res.status(400).json({ message: 'condicion_tipo inválido' });

  db.prepare(`
    UPDATE automatizaciones SET
      nombre = COALESCE(?, nombre),
      descripcion = COALESCE(?, descripcion),
      tipo = COALESCE(?, tipo),
      condicion_tipo = COALESCE(?, condicion_tipo),
      condicion_config = COALESCE(?, condicion_config),
      accion_config = COALESCE(?, accion_config),
      updated_at = datetime('now')
    WHERE id = ? AND empresa_id = ?
  `).run(
    nombre?.trim() || null, descripcion ?? null,
    tipo || null, condicion_tipo || null,
    condicion_config ? JSON.stringify(condicion_config) : null,
    accion_config ? JSON.stringify(accion_config) : null,
    req.params.id, empresaId
  );

  res.json(db.prepare(`SELECT * FROM automatizaciones WHERE id=?`).get(req.params.id));
});

// PUT /automatizaciones/:id/estado
router.put('/:id/estado', requireFeature('automatizaciones'), requireEmpresaRole('editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const auto = db.prepare(`SELECT * FROM automatizaciones WHERE id=? AND empresa_id=?`).get(req.params.id, empresaId);
  if (!auto) return res.status(404).json({ message: 'Automatización no encontrada' });

  const { estado } = req.body;
  if (!['activa','pausada','deshabilitada'].includes(estado)) {
    return res.status(400).json({ message: 'estado inválido' });
  }

  db.prepare(`UPDATE automatizaciones SET estado=?, updated_at=datetime('now') WHERE id=? AND empresa_id=?`)
    .run(estado, req.params.id, empresaId);

  logHistorial({
    automatizacion_id: req.params.id,
    empresa_id: empresaId,
    tipo: 'cambio_estado',
    accion: `Estado cambiado a "${estado}" — "${auto.nombre}"`,
    resultado: 'exito',
    modulo: 'sistema',
    origen: 'usuario',
  });

  res.json({ message: 'Estado actualizado', estado });
});

// DELETE /automatizaciones/:id
router.delete('/:id', requireFeature('automatizaciones'), requireEmpresaRole('admin'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const auto = db.prepare(`SELECT * FROM automatizaciones WHERE id=? AND empresa_id=?`).get(req.params.id, empresaId);
  if (!auto) return res.status(404).json({ message: 'Automatización no encontrada' });

  db.prepare(`DELETE FROM automatizaciones WHERE id=? AND empresa_id=?`).run(req.params.id, empresaId);

  logHistorial({
    empresa_id: empresaId,
    tipo: 'eliminar_automatizacion',
    accion: `Eliminada automatización "${auto.nombre}"`,
    resultado: 'exito',
    modulo: 'sistema',
    origen: 'usuario',
  });

  res.json({ message: 'Automatización eliminada' });
});

// ─── Historial ─────────────────────────────────────────────────────────────────

// GET /automatizaciones/historial
router.get('/historial/lista', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const isSA = req.user.role === 'super_admin' && !req.user.impersonating;

  const { automatizacion_id, resultado, modulo, origen, limit = 50, offset = 0 } = req.query;

  let sql = `SELECT h.*, a.nombre as automatizacion_nombre
             FROM auto_historial h
             LEFT JOIN automatizaciones a ON h.automatizacion_id = a.id
             WHERE 1=1`;
  const params = [];

  if (!isSA) { sql += ` AND h.empresa_id = ?`; params.push(empresaId); }
  if (automatizacion_id) { sql += ` AND h.automatizacion_id = ?`; params.push(automatizacion_id); }
  if (resultado) { sql += ` AND h.resultado = ?`; params.push(resultado); }
  if (modulo) { sql += ` AND h.modulo = ?`; params.push(modulo); }
  if (origen) { sql += ` AND h.origen = ?`; params.push(origen); }

  sql += ` ORDER BY h.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  const total = isSA
    ? db.prepare(`SELECT COUNT(*) c FROM auto_historial`).get().c
    : db.prepare(`SELECT COUNT(*) c FROM auto_historial WHERE empresa_id=?`).get(empresaId).c;

  res.json({ total, items: db.prepare(sql).all(...params) });
});

// ─── Alertas ───────────────────────────────────────────────────────────────────

// GET /automatizaciones/alertas
router.get('/alertas/lista', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const isSA = req.user.role === 'super_admin' && !req.user.impersonating;
  const { leida, nivel, limit = 50 } = req.query;

  let sql = `SELECT * FROM alertas_sistema WHERE 1=1`;
  const params = [];

  if (isSA) {
    // SA sees all alerts
  } else {
    sql += ` AND (empresa_id = ? OR (destinatario = 'empresa' AND empresa_id = ?))`;
    params.push(empresaId, empresaId);
  }

  if (leida !== undefined) { sql += ` AND leida = ?`; params.push(leida === 'true' ? 1 : 0); }
  if (nivel) { sql += ` AND nivel = ?`; params.push(nivel); }
  sql += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(parseInt(limit));

  res.json(db.prepare(sql).all(...params));
});

// PUT /automatizaciones/alertas/:id/leer
router.put('/alertas/:id/leer', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const isSA = req.user.role === 'super_admin' && !req.user.impersonating;

  const alerta = db.prepare(`SELECT * FROM alertas_sistema WHERE id=?`).get(req.params.id);
  if (!alerta) return res.status(404).json({ message: 'Alerta no encontrada' });

  if (!isSA && alerta.empresa_id !== empresaId) {
    return res.status(403).json({ message: 'Sin acceso' });
  }

  db.prepare(`UPDATE alertas_sistema SET leida=1 WHERE id=?`).run(req.params.id);
  res.json({ message: 'Alerta marcada como leída' });
});

// PUT /automatizaciones/alertas/leer-todas
router.put('/alertas/leer-todas', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const isSA = req.user.role === 'super_admin' && !req.user.impersonating;

  if (isSA) {
    db.prepare(`UPDATE alertas_sistema SET leida=1`).run();
  } else {
    db.prepare(`UPDATE alertas_sistema SET leida=1 WHERE empresa_id=?`).run(empresaId);
  }

  res.json({ message: 'Alertas marcadas como leídas' });
});

module.exports = router;
