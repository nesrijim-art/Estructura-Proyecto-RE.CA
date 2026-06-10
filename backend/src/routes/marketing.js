'use strict';

const express = require('express');
const crypto  = require('crypto');
const db      = require('../db/database');
const { requireAuth }        = require('../middleware/auth');
const { requireEmpresaRole } = require('../middleware/requireEmpresaRole');
const { requireFeature }     = require('../middleware/requireFeature');

const router = express.Router();

router.use(requireAuth);
router.use(requireFeature('marketing_basico'));

function resolveEmpresaId(user) {
  return user?.impersonating ? user.impersonating_empresa_id : user?.empresa_id;
}

// Lazy state resolution — avoids needing M11 scheduler for basic expiry/activation
function resolveEstado(campana) {
  const now = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
  let s = campana.estado;
  if (s === 'programada' && campana.fecha_inicio && campana.fecha_inicio <= now) s = 'activa';
  if ((s === 'activa' || s === 'programada') && campana.fecha_fin && campana.fecha_fin <= now) s = 'finalizada';
  return s;
}

function applyLazyState(campana) {
  const resolved = resolveEstado(campana);
  if (resolved !== campana.estado) {
    db.prepare("UPDATE campanas SET estado = ?, updated_at = datetime('now') WHERE id = ?")
      .run(resolved, campana.id);
    return { ...campana, estado: resolved };
  }
  return campana;
}

// ─── Plan helpers ──────────────────────────────────────────────────────────────
function getPlanMaxDestacados(empresaId) {
  const row = db.prepare(`
    SELECT COALESCE(p.id, 'start') AS plan_id
    FROM empresas e LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(empresaId);
  return { start: 3, business: 6, premium: 0 }[row?.plan_id] ?? 3;
}

function canSchedule(empresaId) {
  const row = db.prepare(`
    SELECT p.marketing_avanzado AS flag
    FROM empresas e LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(empresaId);
  return !!row?.flag;
}

function formatRow(r) {
  return {
    ...r,
    imagen_url:   r.img_filename ? `/uploads/multimedia/${r.img_filename}` : null,
    img_filename: undefined,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY STATS
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/stats', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  // Lazy-resolve all active/programada before counting
  db.prepare("SELECT * FROM campanas WHERE empresa_id = ? AND estado IN ('activa','programada')")
    .all(empresaId).forEach(applyLazyState);

  const total      = db.prepare('SELECT COUNT(*) AS n FROM campanas WHERE empresa_id = ?').get(empresaId).n;
  const activas    = db.prepare("SELECT COUNT(*) AS n FROM campanas WHERE empresa_id = ? AND estado = 'activa'").get(empresaId).n;
  const programadas = db.prepare("SELECT COUNT(*) AS n FROM campanas WHERE empresa_id = ? AND estado = 'programada'").get(empresaId).n;
  const pendContenido = db.prepare("SELECT COUNT(*) AS n FROM marketing_contenido WHERE empresa_id = ? AND estado = 'pendiente'").get(empresaId).n;
  const destacados = db.prepare('SELECT COUNT(*) AS n FROM productos_destacados WHERE empresa_id = ?').get(empresaId).n;

  res.json({
    campanas_total:       total,
    campanas_activas:     activas,
    campanas_programadas: programadas,
    contenido_pendiente:  pendContenido,
    destacados_activos:   destacados,
    destacados_max:       getPlanMaxDestacados(empresaId),
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CAMPAÑAS
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/campanas', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const { estado, buscar } = req.query;
  let sql = `
    SELECT c.id, c.titulo, c.descripcion, c.descuento, c.estado,
           c.fecha_inicio, c.fecha_fin, c.created_at, c.updated_at,
           c.producto_id, c.multimedia_id,
           t.nombre AS producto_nombre,
           m.filename AS img_filename
    FROM campanas c
    LEFT JOIN productos p ON c.producto_id = p.id
    LEFT JOIN producto_traducciones t ON t.producto_id = p.id AND t.idioma = 'es'
    LEFT JOIN multimedia m ON c.multimedia_id = m.id
    WHERE c.empresa_id = ?
  `;
  const params = [empresaId];
  if (buscar) { sql += ' AND c.titulo LIKE ?'; params.push(`%${buscar}%`); }
  sql += ' ORDER BY c.created_at DESC';

  let rows = db.prepare(sql).all(...params).map(applyLazyState);
  if (estado) rows = rows.filter(r => r.estado === estado);

  res.json(rows.map(formatRow));
});

// Calendar endpoint requires marketing_avanzado (scheduling feature)
router.get('/campanas/calendario', requireFeature('marketing_avanzado'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const year  = parseInt(req.query.year)  || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01 00:00:00`;
  const lastDayNum = new Date(year, month, 0).getDate();
  const lastDay  = `${year}-${String(month).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')} 23:59:59`;

  const rows = db.prepare(`
    SELECT id, titulo, estado, fecha_inicio, fecha_fin
    FROM campanas
    WHERE empresa_id = ? AND estado NOT IN ('borrador')
      AND (fecha_inicio IS NULL OR fecha_inicio <= ?)
      AND (fecha_fin IS NULL OR fecha_fin >= ?)
    ORDER BY fecha_inicio ASC
  `).all(empresaId, lastDay, firstDay).map(applyLazyState);

  res.json({ year, month, campanas: rows });
});

router.get('/campanas/:id', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const row = db.prepare(`
    SELECT c.*, t.nombre AS producto_nombre, m.filename AS img_filename
    FROM campanas c
    LEFT JOIN productos p ON c.producto_id = p.id
    LEFT JOIN producto_traducciones t ON t.producto_id = p.id AND t.idioma = 'es'
    LEFT JOIN multimedia m ON c.multimedia_id = m.id
    WHERE c.id = ? AND c.empresa_id = ?
  `).get(req.params.id, empresaId);
  if (!row) return res.status(404).json({ message: 'Campaña no encontrada' });
  res.json(formatRow(applyLazyState(row)));
});

router.post('/campanas', requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const { titulo, descripcion, descuento, producto_id, multimedia_id, fecha_inicio, fecha_fin, estado: estadoReq } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ message: 'El título es obligatorio' });

  if (producto_id) {
    if (!db.prepare('SELECT id FROM productos WHERE id = ? AND empresa_id = ?').get(producto_id, empresaId))
      return res.status(400).json({ message: 'Producto no encontrado' });
  }
  if (multimedia_id) {
    if (!db.prepare('SELECT id FROM multimedia WHERE id = ? AND empresa_id = ?').get(multimedia_id, empresaId))
      return res.status(400).json({ message: 'Recurso multimedia no encontrado' });
  }

  let estado = 'borrador';
  if (estadoReq === 'activa') {
    estado = 'activa';
  } else if (estadoReq === 'programada') {
    if (!canSchedule(empresaId)) return res.status(403).json({ message: 'Tu plan no incluye programación de campañas', feature: 'marketing_avanzado', upgrade_required: true });
    estado = 'programada';
  }

  const id = crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO campanas (id, empresa_id, producto_id, multimedia_id, titulo, descripcion, descuento, fecha_inicio, fecha_fin, estado, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, empresaId, producto_id || null, multimedia_id || null, titulo.trim(), descripcion || null, descuento || null, fecha_inicio || null, fecha_fin || null, estado, req.user.sub);

  res.status(201).json(applyLazyState(db.prepare('SELECT * FROM campanas WHERE id = ?').get(id)));
});

router.put('/campanas/:id', requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const existing = db.prepare('SELECT * FROM campanas WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!existing) return res.status(404).json({ message: 'Campaña no encontrada' });
  if (existing.estado === 'finalizada') return res.status(400).json({ message: 'No se puede editar una campaña finalizada' });

  const { titulo, descripcion, descuento, producto_id, multimedia_id, fecha_inicio, fecha_fin } = req.body;
  if (titulo !== undefined && !titulo?.trim()) return res.status(400).json({ message: 'El título no puede estar vacío' });
  if (producto_id != null) {
    if (!db.prepare('SELECT id FROM productos WHERE id = ? AND empresa_id = ?').get(producto_id, empresaId))
      return res.status(400).json({ message: 'Producto no encontrado' });
  }
  if (multimedia_id != null) {
    if (!db.prepare('SELECT id FROM multimedia WHERE id = ? AND empresa_id = ?').get(multimedia_id, empresaId))
      return res.status(400).json({ message: 'Recurso multimedia no encontrado' });
  }

  const updates = {};
  if (titulo !== undefined)       updates.titulo        = titulo.trim();
  if (descripcion !== undefined)  updates.descripcion   = descripcion   || null;
  if (descuento !== undefined)    updates.descuento     = descuento     || null;
  if (producto_id !== undefined)  updates.producto_id   = producto_id   || null;
  if (multimedia_id !== undefined) updates.multimedia_id = multimedia_id || null;
  if (fecha_inicio !== undefined) updates.fecha_inicio  = fecha_inicio  || null;
  if (fecha_fin !== undefined)    updates.fecha_fin     = fecha_fin     || null;

  if (!Object.keys(updates).length) return res.status(400).json({ message: 'Nada que actualizar' });

  const set = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE campanas SET ${set}, updated_at = datetime('now') WHERE id = ?`).run(...Object.values(updates), req.params.id);
  res.json(applyLazyState(db.prepare('SELECT * FROM campanas WHERE id = ?').get(req.params.id)));
});

router.put('/campanas/:id/estado', requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const existing = db.prepare('SELECT * FROM campanas WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!existing) return res.status(404).json({ message: 'Campaña no encontrada' });

  const { estado } = req.body;
  const ALLOWED = ['borrador', 'activa', 'pausada', 'finalizada', 'programada'];
  if (!ALLOWED.includes(estado)) return res.status(400).json({ message: 'Estado inválido' });
  if (estado === 'programada' && !canSchedule(empresaId))
    return res.status(403).json({ message: 'Tu plan no incluye programación de campañas', upgrade_required: true });
  if (existing.estado === 'finalizada' && estado !== 'borrador')
    return res.status(400).json({ message: 'Una campaña finalizada solo puede volver a borrador' });

  db.prepare("UPDATE campanas SET estado = ?, updated_at = datetime('now') WHERE id = ?").run(estado, req.params.id);
  res.json({ message: 'Estado actualizado', estado });
});

router.post('/campanas/:id/duplicar', requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const orig = db.prepare('SELECT * FROM campanas WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!orig) return res.status(404).json({ message: 'Campaña no encontrada' });

  const newId = crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO campanas (id, empresa_id, producto_id, multimedia_id, titulo, descripcion, descuento, fecha_inicio, fecha_fin, estado, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'borrador', ?)
  `).run(newId, empresaId, orig.producto_id, orig.multimedia_id, `${orig.titulo} (copia)`, orig.descripcion, orig.descuento, orig.fecha_inicio, orig.fecha_fin, req.user.sub);

  res.status(201).json(db.prepare('SELECT * FROM campanas WHERE id = ?').get(newId));
});

router.delete('/campanas/:id', requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const existing = db.prepare('SELECT estado FROM campanas WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!existing) return res.status(404).json({ message: 'Campaña no encontrada' });
  if (existing.estado === 'activa') return res.status(400).json({ message: 'Pausa la campaña antes de eliminarla' });

  db.prepare('DELETE FROM campanas WHERE id = ?').run(req.params.id);
  res.json({ message: 'Campaña eliminada' });
});

// GET /campanas/:id/stats — reads M10 tables without duplicating logic
router.get('/campanas/:id/stats', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const campana = db.prepare('SELECT * FROM campanas WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!campana) return res.status(404).json({ message: 'Campaña no encontrada' });
  if (!campana.producto_id) return res.json({ vistas: 0, clics_whatsapp: 0, sesiones: 0 });

  const desde = campana.fecha_inicio || '2000-01-01 00:00:00';
  const hasta  = campana.fecha_fin   || new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');

  const vistas = db.prepare(`
    SELECT COUNT(*) AS n FROM menu_eventos
    WHERE empresa_id = ? AND tipo = 'vista_producto' AND recurso_id = ?
      AND created_at >= ? AND created_at <= ?
  `).get(empresaId, campana.producto_id, desde, hasta).n;

  const clicsWa = db.prepare(`
    SELECT COUNT(*) AS n FROM menu_eventos
    WHERE empresa_id = ? AND tipo = 'clic_whatsapp'
      AND created_at >= ? AND created_at <= ?
  `).get(empresaId, desde, hasta).n;

  const sesiones = db.prepare(`
    SELECT COUNT(DISTINCT session_id) AS n FROM menu_visitas
    WHERE empresa_id = ? AND created_at >= ? AND created_at <= ?
  `).get(empresaId, desde, hasta).n;

  res.json({ vistas, clics_whatsapp: clicsWa, sesiones });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENIDO GENERADO
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/contenido', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const { estado, tipo } = req.query;
  let sql = `
    SELECT mc.id, mc.titulo, mc.tipo, mc.contenido, mc.fuente, mc.estado,
           mc.campana_id, mc.producto_id, mc.ia_historial_id,
           mc.created_by, mc.created_at, mc.updated_at,
           t.nombre AS producto_nombre,
           u.nombre AS autor_nombre
    FROM marketing_contenido mc
    LEFT JOIN productos p  ON mc.producto_id = p.id
    LEFT JOIN producto_traducciones t ON t.producto_id = p.id AND t.idioma = 'es'
    LEFT JOIN users u ON mc.created_by = u.id
    WHERE mc.empresa_id = ?
  `;
  const params = [empresaId];
  if (estado) { sql += ' AND mc.estado = ?'; params.push(estado); }
  if (tipo)   { sql += ' AND mc.tipo = ?';   params.push(tipo); }
  sql += ' ORDER BY mc.created_at DESC';

  res.json(db.prepare(sql).all(...params));
});

router.post('/contenido', requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const { titulo, tipo, contenido, fuente = 'manual', producto_id, campana_id, ia_historial_id } = req.body;
  if (!contenido?.trim()) return res.status(400).json({ message: 'El contenido es obligatorio' });

  const TIPOS = ['instagram','facebook','whatsapp','texto_promocional','campania_temporada','oferta_especial'];
  if (!TIPOS.includes(tipo)) return res.status(400).json({ message: 'Tipo de contenido inválido' });

  // IA content always enters as 'pendiente' — human approval required before use
  const estado = fuente === 'ia' ? 'pendiente' : 'borrador';

  if (producto_id && !db.prepare('SELECT id FROM productos WHERE id = ? AND empresa_id = ?').get(producto_id, empresaId))
    return res.status(400).json({ message: 'Producto no encontrado' });
  if (campana_id && !db.prepare('SELECT id FROM campanas WHERE id = ? AND empresa_id = ?').get(campana_id, empresaId))
    return res.status(400).json({ message: 'Campaña no encontrada' });

  const id = crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO marketing_contenido
      (id, empresa_id, campana_id, producto_id, titulo, tipo, contenido, fuente, ia_historial_id, estado, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, empresaId, campana_id || null, producto_id || null, titulo || null, tipo, contenido.trim(), fuente, ia_historial_id || null, estado, req.user.sub);

  res.status(201).json(db.prepare('SELECT * FROM marketing_contenido WHERE id = ?').get(id));
});

router.put('/contenido/:id', requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const existing = db.prepare('SELECT * FROM marketing_contenido WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!existing) return res.status(404).json({ message: 'Contenido no encontrado' });
  if (existing.estado === 'publicado') return res.status(400).json({ message: 'No se puede editar contenido publicado' });

  const { titulo, contenido } = req.body;
  const updates = {};
  if (titulo    !== undefined) updates.titulo    = titulo    || null;
  if (contenido !== undefined && contenido.trim()) updates.contenido = contenido.trim();
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'Nada que actualizar' });

  const set = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE marketing_contenido SET ${set}, updated_at = datetime('now') WHERE id = ?`).run(...Object.values(updates), req.params.id);
  res.json(db.prepare('SELECT * FROM marketing_contenido WHERE id = ?').get(req.params.id));
});

router.put('/contenido/:id/estado', requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const existing = db.prepare('SELECT * FROM marketing_contenido WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!existing) return res.status(404).json({ message: 'Contenido no encontrado' });

  const { estado } = req.body;
  const ALLOWED = ['borrador', 'pendiente', 'aprobado', 'publicado', 'descartado'];
  if (!ALLOWED.includes(estado)) return res.status(400).json({ message: 'Estado inválido' });

  // IA content: pendiente → publicado is blocked; must go through aprobado first
  if (existing.fuente === 'ia' && existing.estado === 'pendiente' && estado === 'publicado')
    return res.status(400).json({ message: 'Aprueba el contenido antes de publicarlo' });

  db.prepare("UPDATE marketing_contenido SET estado = ?, updated_at = datetime('now') WHERE id = ?").run(estado, req.params.id);
  res.json({ message: 'Estado actualizado', estado });
});

router.delete('/contenido/:id', requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  const existing = db.prepare('SELECT estado FROM marketing_contenido WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
  if (!existing) return res.status(404).json({ message: 'Contenido no encontrado' });
  if (existing.estado === 'publicado') return res.status(400).json({ message: 'No se puede eliminar contenido publicado' });

  db.prepare('DELETE FROM marketing_contenido WHERE id = ?').run(req.params.id);
  res.json({ message: 'Contenido eliminado' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTOS DESTACADOS
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/destacados', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const rows = db.prepare(`
    SELECT pd.id, pd.producto_id, pd.etiqueta, pd.orden, pd.created_at,
           t.nombre AS producto_nombre,
           cat.nombre AS categoria_nombre,
           m.filename AS img_filename
    FROM productos_destacados pd
    JOIN productos p ON pd.producto_id = p.id
    LEFT JOIN producto_traducciones t ON t.producto_id = p.id AND t.idioma = 'es'
    LEFT JOIN categorias cat ON p.categoria_id = cat.id
    LEFT JOIN multimedia m ON p.multimedia_id = m.id
    WHERE pd.empresa_id = ?
    ORDER BY pd.orden ASC, pd.created_at ASC
  `).all(empresaId);

  res.json(rows.map(r => ({
    ...r,
    imagen_url:   r.img_filename ? `/uploads/multimedia/${r.img_filename}` : null,
    img_filename: undefined,
  })));
});

router.post('/destacados', requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const { producto_id, etiqueta = 'destacado' } = req.body;
  if (!producto_id) return res.status(400).json({ message: 'producto_id es obligatorio' });

  const ETIQUETAS = ['destacado','popular','recomendacion_chef','producto_estrella','nuevo','mas_vendido'];
  if (!ETIQUETAS.includes(etiqueta)) return res.status(400).json({ message: 'Etiqueta inválida' });

  if (!db.prepare("SELECT id FROM productos WHERE id = ? AND empresa_id = ? AND estado = 'activo'").get(producto_id, empresaId))
    return res.status(400).json({ message: 'Producto no encontrado o inactivo' });

  const maxDest = getPlanMaxDestacados(empresaId);
  if (maxDest > 0) {
    const count = db.prepare('SELECT COUNT(*) AS n FROM productos_destacados WHERE empresa_id = ?').get(empresaId).n;
    if (count >= maxDest)
      return res.status(403).json({ message: `Tu plan permite hasta ${maxDest} productos destacados`, upgrade_required: true, max: maxDest });
  }

  if (db.prepare('SELECT id FROM productos_destacados WHERE empresa_id = ? AND producto_id = ?').get(empresaId, producto_id))
    return res.status(409).json({ message: 'Este producto ya está destacado' });

  const id = crypto.randomBytes(8).toString('hex');
  db.prepare('INSERT INTO productos_destacados (id, empresa_id, producto_id, etiqueta, created_by) VALUES (?, ?, ?, ?, ?)')
    .run(id, empresaId, producto_id, etiqueta, req.user.sub);

  res.status(201).json(db.prepare('SELECT * FROM productos_destacados WHERE id = ?').get(id));
});

router.put('/destacados/:id', requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!db.prepare('SELECT id FROM productos_destacados WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId))
    return res.status(404).json({ message: 'Producto destacado no encontrado' });

  const { etiqueta, orden } = req.body;
  const ETIQUETAS = ['destacado','popular','recomendacion_chef','producto_estrella','nuevo','mas_vendido'];
  if (etiqueta !== undefined && !ETIQUETAS.includes(etiqueta)) return res.status(400).json({ message: 'Etiqueta inválida' });

  const updates = {};
  if (etiqueta !== undefined) updates.etiqueta = etiqueta;
  if (orden    !== undefined) updates.orden    = parseInt(orden) || 0;
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'Nada que actualizar' });

  const set = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE productos_destacados SET ${set} WHERE id = ?`).run(...Object.values(updates), req.params.id);
  res.json(db.prepare('SELECT * FROM productos_destacados WHERE id = ?').get(req.params.id));
});

router.delete('/destacados/:id', requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!db.prepare('SELECT id FROM productos_destacados WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId))
    return res.status(404).json({ message: 'Producto destacado no encontrado' });

  db.prepare('DELETE FROM productos_destacados WHERE id = ?').run(req.params.id);
  res.json({ message: 'Producto eliminado de destacados' });
});

module.exports = router;
