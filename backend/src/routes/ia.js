'use strict';

const express  = require('express');
const crypto   = require('crypto');
const db       = require('../db/database');
const { requireAuth }         = require('../middleware/auth');
const { requireEmpresaRole }  = require('../middleware/requireEmpresaRole');
const { requireFeature }      = require('../middleware/requireFeature');

const router = express.Router();

router.use(requireAuth);

// Resolves the effective empresa_id, accounting for super_admin impersonation.
// Durante impersonación req.user.empresa_id es la empresa del super_admin;
// req.user.impersonating_empresa_id es la empresa objetivo de soporte.
function resolveEmpresaId(user) {
  return user?.impersonating
    ? user.impersonating_empresa_id
    : user?.empresa_id;
}

// ─── Quota helper ─────────────────────────────────────────────────────────────
function quotaCheck(empresaId) {
  const plan = db.prepare(`
    SELECT p.ia_generaciones_max
    FROM empresas e LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(empresaId);

  const max = plan?.ia_generaciones_max ?? 100;
  if (max === 0) return { ok: true, usado: null, max: 0 };

  const now  = new Date();
  const mes  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const usado = db.prepare(`
    SELECT COUNT(*) AS n FROM ia_historial
    WHERE empresa_id = ?
      AND tipo != 'optimizacion_imagen'
      AND strftime('%Y-%m', created_at) = ?
  `).get(empresaId, mes).n;

  return { ok: usado < max, usado, max };
}

// ─── Stub: description variants ──────────────────────────────────────────────
function stubDescripciones(nombre, tono, longitud) {
  const pool = {
    formal: [
      `${nombre}, elaborado con ingredientes seleccionados bajo estrictos estándares de calidad. Una propuesta gastronómica que combina tradición y técnica para ofrecer una experiencia culinaria memorable.`,
      `Preparación artesanal de ${nombre}. Ingredientes de primera selección y técnica cuidadosa garantizan un resultado consistente y de calidad superior.`,
      `${nombre}: expresión de una filosofía culinaria basada en la excelencia y el respeto por los ingredientes. Recomendado para quienes aprecian la gastronomía de calidad.`,
    ],
    informal: [
      `${nombre} que no falla 🍽️ Preparado con los mejores ingredientes para que disfrutes cada bocado. ¡Una opción que siempre sale bien!`,
      `¿Buscas algo rico y confiable? ${nombre} es exactamente lo que necesitas. Sin complicaciones, puro sabor en cada mordida.`,
      `El clásico que todos piden: ${nombre}. Sencillo, sabroso y siempre presente. ¡No te lo pierdas!`,
    ],
    juvenil: [
      `${nombre} que te va a volar la cabeza 🔥✨ Ingredientes top, sabor brutal. ¡El favorito de todos!`,
      `¿Conoces el ${nombre} que está haciendo furor? 🌟 Sabor épico que no puedes dejar pasar.`,
      `${nombre} = sabor al 100 💥 Perfecto para compartir o comértelo solo. Spoiler: no te vas a arrepentir.`,
    ],
    premium: [
      `${nombre}, una creación culinaria que eleva la experiencia gastronómica a su máxima expresión. Ingredientes de origen seleccionado y técnica impecable para los paladares más exigentes.`,
      `La esencia de ${nombre} capturada en cada detalle. Ingredientes de excepción con técnica de autor para algo verdaderamente único.`,
      `${nombre}: donde la calidad sin compromiso se convierte en arte. Diseñado para quienes buscan más que una comida — buscan una experiencia.`,
    ],
  };

  const variantes = (pool[tono] || pool.informal).map((texto, i) => ({
    id: `v${i + 1}`,
    texto: longitud === 'corta' ? texto.split('.')[0].replace(/[!?🍽️🔥✨🌟💥]+$/, '').trim() + '.' : texto,
    recomendada: i === 0,
  }));

  return variantes;
}

// ─── Stub: translations ───────────────────────────────────────────────────────
function stubTraduccion(textos, idiomaDestino) {
  return textos.map(t => ({
    producto_id:         t.producto_id,
    nombre_original:     t.nombre,
    descripcion_original: t.descripcion,
    nombre_traducido:    `[IA·${idiomaDestino.toUpperCase()}] ${t.nombre}`,
    descripcion_traducida: t.descripcion
      ? `[IA·${idiomaDestino.toUpperCase()}] ${t.descripcion}`
      : null,
    nombres_propios_detectados: [],
  }));
}

// ─── POST /api/ia/generar-descripcion ────────────────────────────────────────
router.post('/generar-descripcion',
  requireEmpresaRole('dueno', 'admin', 'editor'),
  requireFeature('ia_texto'),
  (req, res) => {
    const empresaId = resolveEmpresaId(req.user);
    const { producto_id, nombre, descripcion_actual, tono = 'informal', longitud = 'media', idioma = 'es' } = req.body;

    if (!nombre?.trim()) return res.status(400).json({ message: 'nombre es requerido' });

    const quota = quotaCheck(empresaId);
    if (!quota.ok) {
      return res.status(429).json({
        message: `Límite mensual de generaciones alcanzado (${quota.max}/mes). Actualiza a Premium para generaciones ilimitadas.`,
        quota,
        upgrade_required: true,
      });
    }

    const variantes = stubDescripciones(nombre.trim(), tono, longitud);
    const id = crypto.randomBytes(16).toString('hex');

    db.prepare(`
      INSERT INTO ia_historial
        (id, empresa_id, usuario_id, tipo, modulo, input_data, output_data, estado, recurso_tipo, recurso_id)
      VALUES (?, ?, ?, 'descripcion_producto', 'catalogo', ?, ?, 'generado', 'producto', ?)
    `).run(
      id, empresaId, req.user.sub,
      JSON.stringify({ nombre, descripcion_actual: descripcion_actual || null, tono, longitud, idioma }),
      JSON.stringify({ variantes }),
      producto_id || null,
    );

    res.status(202).json({
      historial_id: id,
      variantes,
      quota: quota.max === 0 ? null : { usado: (quota.usado || 0) + 1, max: quota.max },
      _stub: true,
    });
  }
);

// ─── POST /api/ia/traducir ────────────────────────────────────────────────────
router.post('/traducir',
  requireEmpresaRole('dueno', 'admin', 'editor'),
  requireFeature('ia_texto'),
  (req, res) => {
    const empresaId = resolveEmpresaId(req.user);
    const { textos, idioma_origen = 'es', idioma_destino } = req.body;

    if (!idioma_destino) return res.status(400).json({ message: 'idioma_destino es requerido' });
    if (!Array.isArray(textos) || textos.length === 0) {
      return res.status(400).json({ message: 'textos debe ser un array no vacío' });
    }

    const quota = quotaCheck(empresaId);
    if (!quota.ok) {
      return res.status(429).json({
        message: `Límite mensual de generaciones alcanzado (${quota.max}/mes).`,
        quota,
        upgrade_required: true,
      });
    }

    const traducciones = stubTraduccion(textos, idioma_destino);
    const id = crypto.randomBytes(16).toString('hex');

    db.prepare(`
      INSERT INTO ia_historial
        (id, empresa_id, usuario_id, tipo, modulo, input_data, output_data, estado)
      VALUES (?, ?, ?, 'traduccion', 'catalogo', ?, ?, 'generado')
    `).run(
      id, empresaId, req.user.sub,
      JSON.stringify({ textos: textos.length, idioma_origen, idioma_destino }),
      JSON.stringify({ traducciones }),
    );

    res.status(202).json({
      historial_id: id,
      traducciones,
      quota: quota.max === 0 ? null : { usado: (quota.usado || 0) + 1, max: quota.max },
      _stub: true,
    });
  }
);

// ─── GET /api/ia/quota ────────────────────────────────────────────────────────
router.get('/quota',
  requireEmpresaRole('dueno', 'admin', 'editor', 'visualizador'),
  (req, res) => {
    const empresaId = resolveEmpresaId(req.user);
    const plan = db.prepare(`
      SELECT p.ia_texto, p.ia_imagenes, p.ia_generaciones_max, p.nombre AS plan_nombre
      FROM empresas e LEFT JOIN planes p ON e.plan_id = p.id
      WHERE e.id = ?
    `).get(empresaId);

    const quota = quotaCheck(empresaId);

    res.json({
      ia_texto:              !!plan?.ia_texto,
      ia_imagenes:           !!plan?.ia_imagenes,
      plan_nombre:           plan?.plan_nombre || null,
      generaciones_max:      quota.max,
      generaciones_usadas:   quota.usado ?? 0,
      generaciones_restantes: quota.max === 0 ? null : Math.max(0, quota.max - (quota.usado ?? 0)),
      ilimitado:             quota.max === 0,
    });
  }
);

// ─── GET /api/ia/historial ────────────────────────────────────────────────────
router.get('/historial',
  requireEmpresaRole('dueno', 'admin', 'editor', 'visualizador'),
  (req, res) => {
    const empresaId = resolveEmpresaId(req.user);
    const { tipo, modulo, estado, usuario_id, desde, hasta, page = 1, limit = 20 } = req.query;

    const conditions = ['h.empresa_id = ?'];
    const params = [empresaId];

    if (tipo)       { conditions.push('h.tipo = ?');              params.push(tipo); }
    if (modulo)     { conditions.push('h.modulo = ?');            params.push(modulo); }
    if (estado)     { conditions.push('h.estado = ?');            params.push(estado); }
    if (usuario_id) { conditions.push('h.usuario_id = ?');        params.push(usuario_id); }
    if (desde)      { conditions.push("date(h.created_at) >= ?"); params.push(desde); }
    if (hasta)      { conditions.push("date(h.created_at) <= ?"); params.push(hasta); }

    const where  = conditions.join(' AND ');
    const lim    = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (Math.max(1, parseInt(page) || 1) - 1) * lim;

    const total    = db.prepare(`SELECT COUNT(*) AS n FROM ia_historial h WHERE ${where}`).get(...params).n;
    const registros = db.prepare(`
      SELECT h.id, h.tipo, h.modulo, h.estado, h.recurso_tipo, h.recurso_id,
             h.contenido_final, h.created_at, h.updated_at,
             u.nombre AS usuario_nombre
      FROM ia_historial h
      LEFT JOIN users u ON h.usuario_id = u.id
      WHERE ${where}
      ORDER BY h.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, lim, offset);

    res.json({ total, page: parseInt(page) || 1, limit: lim, registros });
  }
);

// ─── GET /api/ia/historial/:id ────────────────────────────────────────────────
router.get('/historial/:id',
  requireEmpresaRole('dueno', 'admin', 'editor', 'visualizador'),
  (req, res) => {
    const empresaId = resolveEmpresaId(req.user);
    const entry = db.prepare(`
      SELECT h.*, u.nombre AS usuario_nombre
      FROM ia_historial h
      LEFT JOIN users u ON h.usuario_id = u.id
      WHERE h.id = ? AND h.empresa_id = ?
    `).get(req.params.id, empresaId);

    if (!entry) return res.status(404).json({ message: 'Registro no encontrado' });

    res.json({
      ...entry,
      input_data:  JSON.parse(entry.input_data  || '{}'),
      output_data: JSON.parse(entry.output_data || '{}'),
    });
  }
);

// ─── PUT /api/ia/historial/:id ────────────────────────────────────────────────
// RN-09: descartado no elimina el registro, solo cambia estado
router.put('/historial/:id',
  requireEmpresaRole('dueno', 'admin', 'editor'),
  (req, res) => {
    const empresaId = resolveEmpresaId(req.user);
    const { estado, contenido_final } = req.body;

    const VALID_ESTADOS = ['generado', 'editado', 'aprobado', 'publicado', 'descartado'];
    if (!VALID_ESTADOS.includes(estado)) {
      return res.status(400).json({ message: `estado inválido. Debe ser uno de: ${VALID_ESTADOS.join(', ')}` });
    }

    const entry = db.prepare('SELECT id FROM ia_historial WHERE id = ? AND empresa_id = ?').get(req.params.id, empresaId);
    if (!entry) return res.status(404).json({ message: 'Registro no encontrado' });

    db.prepare(`
      UPDATE ia_historial
      SET estado = ?, contenido_final = ?, updated_at = datetime('now')
      WHERE id = ? AND empresa_id = ?
    `).run(estado, contenido_final ?? null, req.params.id, empresaId);

    res.json({ ok: true });
  }
);

// ─── GET /api/ia/stats ────────────────────────────────────────────────────────
router.get('/stats',
  requireEmpresaRole('dueno', 'admin', 'editor', 'visualizador'),
  (req, res) => {
    const empresaId = resolveEmpresaId(req.user);
    const quota     = quotaCheck(empresaId);

    const total      = db.prepare('SELECT COUNT(*) AS n FROM ia_historial WHERE empresa_id = ?').get(empresaId).n;
    const aprobados  = db.prepare("SELECT COUNT(*) AS n FROM ia_historial WHERE empresa_id = ? AND estado IN ('aprobado','editado','publicado')").get(empresaId).n;
    const descartados = db.prepare("SELECT COUNT(*) AS n FROM ia_historial WHERE empresa_id = ? AND estado = 'descartado'").get(empresaId).n;

    const byTipo = db.prepare(`
      SELECT tipo, COUNT(*) AS n FROM ia_historial WHERE empresa_id = ? GROUP BY tipo
    `).all(empresaId);

    res.json({
      total,
      aprobados,
      descartados,
      tasa_aprobacion: total > 0 ? Math.round((aprobados / total) * 100) : 0,
      by_tipo: byTipo,
      quota: {
        max:      quota.max,
        usado:    quota.usado ?? 0,
        restantes: quota.max === 0 ? null : Math.max(0, quota.max - (quota.usado ?? 0)),
        ilimitado: quota.max === 0,
      },
    });
  }
);

module.exports = router;
