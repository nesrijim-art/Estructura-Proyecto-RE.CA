'use strict';

const express = require('express');
const crypto  = require('crypto');
const db      = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ─── Period helper ────────────────────────────────────────────────────────────
function periodStart(periodo) {
  const days = { '7d': 7, '30d': 30, '90d': 90 }[periodo] || 30;
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function prevPeriodStart(periodo) {
  const days = { '7d': 7, '30d': 30, '90d': 90 }[periodo] || 30;
  const d = new Date();
  d.setDate(d.getDate() - days * 2);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function yesterdayStart() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function weekStart() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function lastWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function monthStart() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function lastMonthStart() {
  const d = new Date();
  d.setDate(d.getDate() - 60);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function variacion(actual, anterior) {
  if (!anterior) return actual > 0 ? 100 : 0;
  return Math.round(((actual - anterior) / anterior) * 100);
}

// ─── PUBLIC: POST /api/stats/visita ──────────────────────────────────────────
// No auth — called from the public menu page via sendBeacon
router.post('/visita', (req, res) => {
  const { empresa_slug, session_id, lang = 'es' } = req.body || {};
  if (!empresa_slug || !session_id) return res.status(400).json({ ok: false });

  const empresa = db.prepare('SELECT id FROM empresas WHERE slug = ? AND estado = ?')
    .get(empresa_slug, 'activa');
  if (!empresa) return res.status(404).json({ ok: false });

  // Deduplicate: one row per session per day
  const hoy = new Date().toISOString().split('T')[0];
  const existe = db.prepare(`
    SELECT id FROM menu_visitas
    WHERE empresa_id = ? AND session_id = ? AND date(created_at) = ?
  `).get(empresa.id, session_id, hoy);

  if (!existe) {
    db.prepare(
      'INSERT INTO menu_visitas (id, empresa_id, session_id, lang) VALUES (?, ?, ?, ?)'
    ).run(crypto.randomBytes(8).toString('hex'), empresa.id, session_id, lang.slice(0, 10));
  }

  res.json({ ok: true });
});

// ─── PUBLIC: POST /api/stats/evento ──────────────────────────────────────────
// No auth — called from the public menu page via sendBeacon / fetch
router.post('/evento', (req, res) => {
  const TIPOS_VALIDOS = ['vista_producto','clic_whatsapp','clic_instagram','clic_facebook','cambio_idioma','compartir'];
  const { empresa_slug, session_id, tipo, recurso_id, lang = 'es' } = req.body || {};

  if (!empresa_slug || !session_id || !TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ ok: false });
  }

  const empresa = db.prepare('SELECT id FROM empresas WHERE slug = ? AND estado = ?')
    .get(empresa_slug, 'activa');
  if (!empresa) return res.status(404).json({ ok: false });

  db.prepare(
    'INSERT INTO menu_eventos (id, empresa_id, session_id, tipo, recurso_id, lang) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    crypto.randomBytes(8).toString('hex'),
    empresa.id, session_id, tipo,
    recurso_id || null,
    lang.slice(0, 10),
  );

  res.json({ ok: true });
});

// All read endpoints require auth
router.use(requireAuth);

function resolveEmpresaId(user) {
  return user?.impersonating ? user.impersonating_empresa_id : user?.empresa_id;
}

// ─── GET /api/stats/resumen ───────────────────────────────────────────────────
router.get('/resumen', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const total    = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ?').get(empresaId).n;
  const hoy      = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?').get(empresaId, todayStart()).n;
  const ayer     = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ? AND created_at >= ? AND created_at < ?').get(empresaId, yesterdayStart(), todayStart()).n;
  const semana   = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?').get(empresaId, weekStart()).n;
  const semAnt   = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ? AND created_at >= ? AND created_at < ?').get(empresaId, lastWeekStart(), weekStart()).n;
  const mes      = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?').get(empresaId, monthStart()).n;
  const mesAnt   = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ? AND created_at >= ? AND created_at < ?').get(empresaId, lastMonthStart(), monthStart()).n;

  const ultimaVisita = db.prepare('SELECT created_at FROM menu_visitas WHERE empresa_id = ? ORDER BY created_at DESC LIMIT 1').get(empresaId)?.created_at || null;
  const waClics = db.prepare("SELECT COUNT(*) AS n FROM menu_eventos WHERE empresa_id = ? AND tipo = 'clic_whatsapp' AND created_at >= ?").get(empresaId, monthStart()).n;

  res.json({
    visitas_total:    total,
    visitas_hoy:      hoy,
    visitas_semana:   semana,
    visitas_mes:      mes,
    variacion_hoy:    variacion(hoy, ayer),
    variacion_semana: variacion(semana, semAnt),
    variacion_mes:    variacion(mes, mesAnt),
    ultima_visita:    ultimaVisita,
    whatsapp_clics:   waClics,
    tasa_whatsapp:    mes > 0 ? Math.round((waClics / mes) * 100 * 10) / 10 : 0,
  });
});

// ─── GET /api/stats/trafico ───────────────────────────────────────────────────
router.get('/trafico', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });
  const desde = periodStart(req.query.periodo);

  const porHora = db.prepare(`
    SELECT CAST(strftime('%H', created_at) AS INTEGER) AS hora, COUNT(*) AS visitas
    FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?
    GROUP BY hora ORDER BY hora
  `).all(empresaId, desde);

  const porDia = db.prepare(`
    SELECT CAST(strftime('%w', created_at) AS INTEGER) AS dia_semana, COUNT(*) AS visitas
    FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?
    GROUP BY dia_semana ORDER BY dia_semana
  `).all(empresaId, desde);

  const porFecha = db.prepare(`
    SELECT date(created_at) AS fecha, COUNT(*) AS visitas
    FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?
    GROUP BY fecha ORDER BY fecha
  `).all(empresaId, desde);

  const DIA_NOMBRES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  // Fill all hours 0-23 and all days 0-6 with 0s for charts
  const horasMap = Object.fromEntries(porHora.map(r => [r.hora, r.visitas]));
  const diasMap  = Object.fromEntries(porDia.map(r => [r.dia_semana, r.visitas]));

  res.json({
    por_hora: Array.from({ length: 24 }, (_, h) => ({ hora: h, visitas: horasMap[h] || 0 })),
    por_dia_semana: Array.from({ length: 7 }, (_, d) => ({
      dia: d, nombre: DIA_NOMBRES[d], visitas: diasMap[d] || 0,
    })),
    por_fecha: porFecha,
  });
});

// ─── GET /api/stats/productos ─────────────────────────────────────────────────
router.get('/productos', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });
  const desde = periodStart(req.query.periodo);

  const ranking = db.prepare(`
    SELECT e.recurso_id AS producto_id,
           COUNT(*) AS visualizaciones,
           t.nombre AS nombre,
           c.nombre AS categoria
    FROM menu_eventos e
    LEFT JOIN productos p  ON e.recurso_id = p.id
    LEFT JOIN producto_traducciones t ON t.producto_id = p.id AND t.idioma = 'es'
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE e.empresa_id = ? AND e.tipo = 'vista_producto' AND e.created_at >= ?
      AND e.recurso_id IS NOT NULL
    GROUP BY e.recurso_id
    ORDER BY visualizaciones DESC
    LIMIT 15
  `).all(empresaId, desde);

  const total = ranking.reduce((s, r) => s + r.visualizaciones, 0);
  const withPct = ranking.map(r => ({
    ...r,
    porcentaje: total > 0 ? Math.round((r.visualizaciones / total) * 100 * 10) / 10 : 0,
  }));

  // Low-performance: active products with zero or low views
  const bajoRendimiento = db.prepare(`
    SELECT p.id AS producto_id, t.nombre, c.nombre AS categoria
    FROM productos p
    LEFT JOIN producto_traducciones t ON t.producto_id = p.id AND t.idioma = 'es'
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.empresa_id = ? AND p.estado = 'activo'
      AND p.id NOT IN (
        SELECT DISTINCT recurso_id FROM menu_eventos
        WHERE empresa_id = ? AND tipo = 'vista_producto' AND created_at >= ?
      )
    LIMIT 10
  `).all(empresaId, empresaId, desde);

  res.json({ ranking: withPct, total_vistas: total, bajo_rendimiento: bajoRendimiento });
});

// ─── GET /api/stats/idiomas ───────────────────────────────────────────────────
router.get('/idiomas', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });
  const desde = periodStart(req.query.periodo);

  const rows = db.prepare(`
    SELECT lang, COUNT(DISTINCT session_id) AS sesiones
    FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?
    GROUP BY lang ORDER BY sesiones DESC
  `).all(empresaId, desde);

  const total = rows.reduce((s, r) => s + r.sesiones, 0);
  const LANG_NAMES = { es: 'Español', en: 'Inglés', pt: 'Portugués', fr: 'Francés', de: 'Alemán', it: 'Italiano', ja: 'Japonés' };

  const breakdown = rows.map(r => ({
    lang:       r.lang,
    nombre:     LANG_NAMES[r.lang] || r.lang,
    sesiones:   r.sesiones,
    porcentaje: total > 0 ? Math.round((r.sesiones / total) * 100 * 10) / 10 : 0,
  }));

  res.json({ breakdown, idioma_principal: breakdown[0]?.lang || 'es', total_sesiones: total });
});

// ─── GET /api/stats/contacto ──────────────────────────────────────────────────
router.get('/contacto', (req, res) => {
  const empresaId = resolveEmpresaId(req.user);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });
  const desde = periodStart(req.query.periodo);

  const porTipo = db.prepare(`
    SELECT tipo, COUNT(*) AS cantidad
    FROM menu_eventos WHERE empresa_id = ? AND created_at >= ?
    GROUP BY tipo ORDER BY cantidad DESC
  `).all(empresaId, desde);

  const totalEventos = porTipo.reduce((s, r) => s + r.cantidad, 0);
  const totalVisitas = db.prepare('SELECT COUNT(*) AS n FROM menu_visitas WHERE empresa_id = ? AND created_at >= ?').get(empresaId, desde).n;

  const TIPO_LABELS = {
    clic_whatsapp:   'Clic en WhatsApp',
    clic_instagram:  'Clic en Instagram',
    clic_facebook:   'Clic en Facebook',
    vista_producto:  'Vista de producto',
    cambio_idioma:   'Cambio de idioma',
    compartir:       'Compartir',
  };

  res.json({
    total_interacciones: totalEventos,
    tasa_conversion: totalVisitas > 0 ? Math.round((totalEventos / totalVisitas) * 100 * 10) / 10 : 0,
    por_tipo: porTipo.map(r => ({ ...r, label: TIPO_LABELS[r.tipo] || r.tipo })),
  });
});

// ─── GET /api/stats/global ────────────────────────────────────────────────────
// Super Admin only — platform-wide consolidated view
router.get('/global', (req, res) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Acceso denegado: requiere super_admin' });
  }

  const desde = periodStart(req.query.periodo);

  const negociosActivos = db.prepare(
    'SELECT COUNT(DISTINCT empresa_id) AS n FROM menu_visitas WHERE created_at >= ?'
  ).get(desde).n;

  const totalVisitas = db.prepare(
    'SELECT COUNT(*) AS n FROM menu_visitas WHERE created_at >= ?'
  ).get(desde).n;

  const topNegocios = db.prepare(`
    SELECT e.nombre, e.slug, e.ciudad, COUNT(*) AS visitas
    FROM menu_visitas v JOIN empresas e ON v.empresa_id = e.id
    WHERE v.created_at >= ?
    GROUP BY v.empresa_id
    ORDER BY visitas DESC LIMIT 10
  `).all(desde);

  const idiomasPlataforma = db.prepare(`
    SELECT lang, COUNT(DISTINCT session_id) AS sesiones
    FROM menu_visitas WHERE created_at >= ?
    GROUP BY lang ORDER BY sesiones DESC
  `).all(desde);

  const visitasPorHora = db.prepare(`
    SELECT CAST(strftime('%H', created_at) AS INTEGER) AS hora, COUNT(*) AS visitas
    FROM menu_visitas WHERE created_at >= ?
    GROUP BY hora ORDER BY hora
  `).all(desde);

  const horasMap = Object.fromEntries(visitasPorHora.map(r => [r.hora, r.visitas]));
  const waTotal  = db.prepare("SELECT COUNT(*) AS n FROM menu_eventos WHERE tipo = 'clic_whatsapp' AND created_at >= ?").get(desde).n;

  res.json({
    negocios_activos:      negociosActivos,
    visitas_totales:       totalVisitas,
    promedio_visitas:      negociosActivos > 0 ? Math.round(totalVisitas / negociosActivos) : 0,
    whatsapp_clics:        waTotal,
    top_negocios:          topNegocios,
    idiomas_plataforma:    idiomasPlataforma,
    visitas_por_hora:      Array.from({ length: 24 }, (_, h) => ({ hora: h, visitas: horasMap[h] || 0 })),
  });
});

module.exports = router;
