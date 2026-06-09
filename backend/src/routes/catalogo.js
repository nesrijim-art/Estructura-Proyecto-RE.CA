'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { requireEmpresaRole } = require('../middleware/requireEmpresaRole');

const router = express.Router();

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEmpresaId(req) {
  return req.user.impersonating
    ? req.user.impersonating_empresa_id
    : req.user.empresa_id;
}

/** Check plan limits for products. Returns { ok, current, max }. */
function productLimitCheck(empresaId) {
  const row = db.prepare(`
    SELECT p.productos_max
    FROM empresas e LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(empresaId);
  let max = row?.productos_max ?? 50;
  if (!row) {
    const leg = db.prepare(`SELECT plan FROM empresas WHERE id = ?`).get(empresaId);
    if (leg?.plan) {
      const p = db.prepare(`SELECT productos_max FROM planes WHERE id = ?`).get(leg.plan);
      max = p?.productos_max ?? 50;
    }
  }
  if (max === 0) return { ok: true, current: null, max: 0 };
  const count = db.prepare(`SELECT COUNT(*) AS n FROM productos WHERE empresa_id = ?`).get(empresaId).n;
  return { ok: count < max, current: count, max };
}

/** Check plan limit for translation languages. Returns max languages allowed. */
function idiomasMax(empresaId) {
  const row = db.prepare(`
    SELECT p.idiomas_max
    FROM empresas e LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `).get(empresaId);
  return row?.idiomas_max ?? 1;
}

/** Compute completeness score 0–100 for a product row + its translations. */
function completeness(prod, traducciones) {
  let score = 0;
  const esTrad = traducciones.find(t => t.idioma === 'es');
  if (esTrad?.nombre)       score += 30;
  if (esTrad?.descripcion)  score += 20;
  if (prod.multimedia_id)   score += 25;
  if (prod.precio > 0)      score += 15;
  if (traducciones.length > 1) score += 10;
  return score;
}

/** Parse etiquetas safely from JSON string. */
function parseEtiquetas(v) {
  try { return JSON.parse(v) || []; } catch { return []; }
}

/** Public product shape. */
function publicProduct(prod, traducciones) {
  const mediaUrl = prod.multimedia_id
    ? db.prepare('SELECT filename FROM multimedia WHERE id = ?').get(prod.multimedia_id)?.filename
    : null;
  return {
    id:             prod.id,
    categoria_id:   prod.categoria_id,
    multimedia_id:  prod.multimedia_id || null,
    imagen_url:     mediaUrl ? `/uploads/multimedia/${mediaUrl}` : null,
    precio:         prod.precio,
    precio_original: prod.precio_original || null,
    estado:         prod.estado,
    destacado:      !!prod.destacado,
    orden:          prod.orden,
    etiquetas:      parseEtiquetas(prod.etiquetas),
    alergenos:      prod.alergenos || null,
    tiempo_prep_min: prod.tiempo_prep_min || null,
    calorias:       prod.calorias || null,
    traducciones:   traducciones.map(t => ({
      idioma:      t.idioma,
      nombre:      t.nombre,
      descripcion: t.descripcion || null,
    })),
    completitud:    completeness(prod, traducciones),
    created_at:     prod.created_at,
    updated_at:     prod.updated_at,
  };
}

function getTraducciones(productoId) {
  return db.prepare(
    'SELECT idioma, nombre, descripcion FROM producto_traducciones WHERE producto_id = ? ORDER BY idioma'
  ).all(productoId);
}

// ── CATEGORÍAS ────────────────────────────────────────────────────────────────

// GET /api/catalogo/categorias
router.get('/categorias', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  if (!eid) return res.status(400).json({ message: 'Sin empresa asociada' });

  const cats = db.prepare(`
    SELECT c.*,
      (SELECT COUNT(*) FROM productos p WHERE p.categoria_id = c.id) AS total_productos
    FROM categorias c WHERE c.empresa_id = ? ORDER BY c.orden ASC, c.created_at ASC
  `).all(eid);

  res.json({ categorias: cats });
});

// POST /api/catalogo/categorias
router.post('/categorias', requireAuth, requireEmpresaRole('dueno','admin','editor'), (req, res) => {
  const eid = getEmpresaId(req);
  const { nombre, emoji, descripcion } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ message: 'nombre es requerido' });

  const maxOrden = db.prepare(`SELECT COALESCE(MAX(orden),0) AS m FROM categorias WHERE empresa_id = ?`).get(eid).m;
  const id = uuidv4();
  db.prepare(`
    INSERT INTO categorias (id, empresa_id, nombre, emoji, descripcion, orden)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, eid, nombre.trim(), emoji || null, descripcion || null, maxOrden + 1);

  res.status(201).json(db.prepare('SELECT * FROM categorias WHERE id = ?').get(id));
});

// PUT /api/catalogo/categorias/:id
router.put('/categorias/:id', requireAuth, requireEmpresaRole('dueno','admin','editor'), (req, res) => {
  const eid = getEmpresaId(req);
  const cat = db.prepare('SELECT id FROM categorias WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });

  const { nombre, emoji, descripcion, activo } = req.body;
  const updates = [];
  const vals    = [];

  if (nombre     !== undefined) { updates.push('nombre = ?');      vals.push(nombre.trim()); }
  if (emoji      !== undefined) { updates.push('emoji = ?');       vals.push(emoji || null); }
  if (descripcion !== undefined){ updates.push('descripcion = ?'); vals.push(descripcion || null); }
  if (activo     !== undefined) { updates.push('activo = ?');      vals.push(activo ? 1 : 0); }

  if (!updates.length) return res.status(400).json({ message: 'Sin cambios proporcionados' });

  updates.push(`updated_at = datetime('now')`);
  vals.push(req.params.id);
  db.prepare(`UPDATE categorias SET ${updates.join(', ')} WHERE id = ?`).run(...vals);

  res.json(db.prepare('SELECT * FROM categorias WHERE id = ?').get(req.params.id));
});

// PUT /api/catalogo/categorias/reordenar
router.put('/categorias/reordenar', requireAuth, requireEmpresaRole('dueno','admin','editor'), (req, res) => {
  const eid = getEmpresaId(req);
  const { orden } = req.body; // [{ id, orden }, ...]
  if (!Array.isArray(orden)) return res.status(400).json({ message: 'orden debe ser un array' });

  const stmt = db.prepare(`UPDATE categorias SET orden = ? WHERE id = ? AND empresa_id = ?`);
  db.transaction(() => {
    for (const { id, orden: o } of orden) stmt.run(o, id, eid);
  })();
  res.json({ message: 'Orden actualizado' });
});

// DELETE /api/catalogo/categorias/:id
router.delete('/categorias/:id', requireAuth, requireEmpresaRole('dueno','admin'), (req, res) => {
  const eid = getEmpresaId(req);
  const cat = db.prepare('SELECT * FROM categorias WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });

  const count = db.prepare('SELECT COUNT(*) AS n FROM productos WHERE categoria_id = ?').get(req.params.id).n;
  if (count > 0) {
    return res.status(409).json({
      message: `Esta categoría tiene ${count} producto${count !== 1 ? 's' : ''}. Muévelos a otra categoría antes de eliminarla.`,
      total_productos: count,
    });
  }

  db.prepare('DELETE FROM categorias WHERE id = ?').run(req.params.id);
  res.json({ message: 'Categoría eliminada', id: req.params.id });
});

// ── PRODUCTOS ─────────────────────────────────────────────────────────────────

// GET /api/catalogo/productos
router.get('/productos', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  const { categoria_id, estado, destacado, q } = req.query;

  let sql = `SELECT * FROM productos WHERE empresa_id = ?`;
  const params = [eid];

  if (categoria_id) { sql += ` AND categoria_id = ?`; params.push(categoria_id); }
  if (estado === 'activo' || estado === 'pausado') { sql += ` AND estado = ?`; params.push(estado); }
  if (destacado === 'true') { sql += ` AND destacado = 1`; }

  sql += ` ORDER BY orden ASC, created_at ASC`;
  let rows = db.prepare(sql).all(...params);

  if (q) {
    const lower = q.toLowerCase();
    // Filter by name in any translation
    const matchingIds = new Set(
      db.prepare(`
        SELECT DISTINCT producto_id FROM producto_traducciones
        WHERE producto_id IN (SELECT id FROM productos WHERE empresa_id = ?)
        AND LOWER(nombre) LIKE ?
      `).all(eid, `%${lower}%`).map(r => r.producto_id)
    );
    rows = rows.filter(r => matchingIds.has(r.id));
  }

  const productos = rows.map(p => publicProduct(p, getTraducciones(p.id)));
  const limit = productLimitCheck(eid);

  res.json({ productos, limite: { max: limit.max, actual: limit.current ?? productos.length } });
});

// POST /api/catalogo/productos
router.post('/productos', requireAuth, requireEmpresaRole('dueno','admin','editor'), (req, res) => {
  const eid = getEmpresaId(req);

  const limit = productLimitCheck(eid);
  if (!limit.ok) {
    return res.status(403).json({
      message: `Has alcanzado el límite de productos de tu plan (máx. ${limit.max}). Actualiza tu plan para añadir más.`,
      upgrade_required: true,
    });
  }

  const {
    categoria_id, precio = 0, precio_original,
    estado = 'activo', destacado = false,
    etiquetas = [], alergenos, tiempo_prep_min, calorias,
    multimedia_id, traducciones = [],
  } = req.body;

  if (!traducciones.length || !traducciones.find(t => t.idioma === 'es' && t.nombre?.trim())) {
    return res.status(400).json({ message: 'Se requiere al menos el nombre en español (idioma: "es")' });
  }

  // Validate categoria belongs to empresa
  if (categoria_id) {
    const cat = db.prepare('SELECT id FROM categorias WHERE id = ? AND empresa_id = ?').get(categoria_id, eid);
    if (!cat) return res.status(400).json({ message: 'Categoría no válida' });
  }

  // Validate multimedia belongs to empresa
  if (multimedia_id) {
    const media = db.prepare('SELECT id FROM multimedia WHERE id = ? AND empresa_id = ?').get(multimedia_id, eid);
    if (!media) return res.status(400).json({ message: 'Recurso multimedia no válido' });
  }

  // Language limit
  const maxIdiomas = idiomasMax(eid);
  const uniqueLangs = [...new Set(traducciones.map(t => t.idioma))];
  if (uniqueLangs.length > maxIdiomas) {
    return res.status(403).json({
      message: `Tu plan permite hasta ${maxIdiomas} idioma${maxIdiomas !== 1 ? 's' : ''}. Actualiza tu plan para añadir más traducciones.`,
      upgrade_required: true,
    });
  }

  const maxOrden = db.prepare(`SELECT COALESCE(MAX(orden),0) AS m FROM productos WHERE empresa_id = ? AND categoria_id ${categoria_id ? '= ?' : 'IS NULL'}`).get(...(categoria_id ? [eid, categoria_id] : [eid])).m;
  const id = uuidv4();

  db.transaction(() => {
    db.prepare(`
      INSERT INTO productos
        (id, empresa_id, categoria_id, multimedia_id, precio, precio_original,
         estado, destacado, orden, etiquetas, alergenos, tiempo_prep_min, calorias)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, eid, categoria_id || null, multimedia_id || null,
      precio, precio_original || null,
      estado, destacado ? 1 : 0,
      maxOrden + 1,
      JSON.stringify(etiquetas),
      alergenos || null, tiempo_prep_min || null, calorias || null
    );

    const tradStmt = db.prepare(`
      INSERT OR REPLACE INTO producto_traducciones (id, producto_id, idioma, nombre, descripcion)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const t of traducciones) {
      if (t.idioma && t.nombre?.trim()) {
        tradStmt.run(uuidv4(), id, t.idioma, t.nombre.trim(), t.descripcion || null);
      }
    }

    // Register multimedia reference
    if (multimedia_id) {
      try {
        db.prepare(`INSERT INTO multimedia_refs (id, multimedia_id, modulo, entidad_id, descripcion)
          VALUES (?, ?, 'catalogo', ?, 'Foto de producto')`).run(uuidv4(), multimedia_id, id);
      } catch (_) {}
    }
  })();

  const prod = db.prepare('SELECT * FROM productos WHERE id = ?').get(id);
  res.status(201).json(publicProduct(prod, getTraducciones(id)));
});

// GET /api/catalogo/productos/:id
router.get('/productos/:id', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  const prod = db.prepare('SELECT * FROM productos WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(publicProduct(prod, getTraducciones(req.params.id)));
});

// PUT /api/catalogo/productos/:id
router.put('/productos/:id', requireAuth, requireEmpresaRole('dueno','admin','editor'), (req, res) => {
  const eid = getEmpresaId(req);
  const prod = db.prepare('SELECT * FROM productos WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });

  const {
    categoria_id, precio, precio_original,
    estado, destacado, etiquetas, alergenos, tiempo_prep_min, calorias,
    multimedia_id, traducciones,
  } = req.body;

  // Validate ownership of new references
  if (categoria_id !== undefined && categoria_id !== null) {
    const cat = db.prepare('SELECT id FROM categorias WHERE id = ? AND empresa_id = ?').get(categoria_id, eid);
    if (!cat) return res.status(400).json({ message: 'Categoría no válida' });
  }
  if (multimedia_id !== undefined && multimedia_id !== null) {
    const media = db.prepare('SELECT id FROM multimedia WHERE id = ? AND empresa_id = ?').get(multimedia_id, eid);
    if (!media) return res.status(400).json({ message: 'Recurso multimedia no válido' });
  }

  // Language limit check for new translations
  if (traducciones !== undefined) {
    const maxIdiomas = idiomasMax(eid);
    const uniqueLangs = [...new Set(traducciones.map(t => t.idioma))];
    if (uniqueLangs.length > maxIdiomas) {
      return res.status(403).json({
        message: `Tu plan permite hasta ${maxIdiomas} idioma${maxIdiomas !== 1 ? 's' : ''}. Actualiza tu plan para añadir más traducciones.`,
        upgrade_required: true,
      });
    }
  }

  db.transaction(() => {
    const updates = [];
    const vals    = [];
    if (categoria_id    !== undefined) { updates.push('categoria_id = ?');    vals.push(categoria_id || null); }
    if (precio          !== undefined) { updates.push('precio = ?');           vals.push(precio); }
    if (precio_original !== undefined) { updates.push('precio_original = ?');  vals.push(precio_original || null); }
    if (estado          !== undefined) { updates.push('estado = ?');           vals.push(estado); }
    if (destacado       !== undefined) { updates.push('destacado = ?');        vals.push(destacado ? 1 : 0); }
    if (etiquetas       !== undefined) { updates.push('etiquetas = ?');        vals.push(JSON.stringify(etiquetas)); }
    if (alergenos       !== undefined) { updates.push('alergenos = ?');        vals.push(alergenos || null); }
    if (tiempo_prep_min !== undefined) { updates.push('tiempo_prep_min = ?');  vals.push(tiempo_prep_min || null); }
    if (calorias        !== undefined) { updates.push('calorias = ?');         vals.push(calorias || null); }

    // Handle multimedia change: update ref
    if (multimedia_id !== undefined) {
      const oldId = prod.multimedia_id;
      if (oldId !== multimedia_id) {
        if (oldId) db.prepare(`DELETE FROM multimedia_refs WHERE multimedia_id = ? AND modulo = 'catalogo' AND entidad_id = ?`).run(oldId, req.params.id);
        if (multimedia_id) {
          try {
            db.prepare(`INSERT INTO multimedia_refs (id, multimedia_id, modulo, entidad_id, descripcion)
              VALUES (?, ?, 'catalogo', ?, 'Foto de producto')`).run(uuidv4(), multimedia_id, req.params.id);
          } catch (_) {}
        }
      }
      updates.push('multimedia_id = ?');
      vals.push(multimedia_id || null);
    }

    if (updates.length) {
      updates.push(`updated_at = datetime('now')`);
      vals.push(req.params.id);
      db.prepare(`UPDATE productos SET ${updates.join(', ')} WHERE id = ?`).run(...vals);
    }

    // Replace all translations if provided
    if (traducciones !== undefined) {
      db.prepare('DELETE FROM producto_traducciones WHERE producto_id = ?').run(req.params.id);
      const tradStmt = db.prepare(`
        INSERT INTO producto_traducciones (id, producto_id, idioma, nombre, descripcion)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const t of traducciones) {
        if (t.idioma && t.nombre?.trim()) {
          tradStmt.run(uuidv4(), req.params.id, t.idioma, t.nombre.trim(), t.descripcion || null);
        }
      }
    }
  })();

  const updated = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
  res.json(publicProduct(updated, getTraducciones(req.params.id)));
});

// PUT /api/catalogo/productos/:id/estado
router.put('/productos/:id/estado', requireAuth, requireEmpresaRole('dueno','admin','editor'), (req, res) => {
  const eid = getEmpresaId(req);
  const prod = db.prepare('SELECT id FROM productos WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });

  const { estado } = req.body;
  if (!['activo','pausado'].includes(estado)) return res.status(400).json({ message: 'estado debe ser activo o pausado' });

  db.prepare(`UPDATE productos SET estado = ?, updated_at = datetime('now') WHERE id = ?`).run(estado, req.params.id);
  res.json({ message: `Producto ${estado}`, id: req.params.id, estado });
});

// PUT /api/catalogo/productos/reordenar
router.put('/productos/reordenar', requireAuth, requireEmpresaRole('dueno','admin','editor'), (req, res) => {
  const eid = getEmpresaId(req);
  const { orden } = req.body; // [{ id, orden }, ...]
  if (!Array.isArray(orden)) return res.status(400).json({ message: 'orden debe ser un array' });

  const stmt = db.prepare(`UPDATE productos SET orden = ? WHERE id = ? AND empresa_id = ?`);
  db.transaction(() => {
    for (const { id, orden: o } of orden) stmt.run(o, id, eid);
  })();
  res.json({ message: 'Orden actualizado' });
});

// DELETE /api/catalogo/productos/:id
router.delete('/productos/:id', requireAuth, requireEmpresaRole('dueno','admin'), (req, res) => {
  const eid = getEmpresaId(req);
  const prod = db.prepare('SELECT * FROM productos WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });

  db.transaction(() => {
    // Release multimedia reference
    if (prod.multimedia_id) {
      db.prepare(`DELETE FROM multimedia_refs WHERE multimedia_id = ? AND modulo = 'catalogo' AND entidad_id = ?`)
        .run(prod.multimedia_id, req.params.id);
    }
    db.prepare('DELETE FROM producto_traducciones WHERE producto_id = ?').run(req.params.id);
    db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);
  })();

  res.json({ message: 'Producto eliminado', id: req.params.id });
});

// GET /api/catalogo/stats — summary counts for dashboard
router.get('/stats', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  const row = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN estado='activo'  THEN 1 ELSE 0 END) AS activos,
      SUM(CASE WHEN estado='pausado' THEN 1 ELSE 0 END) AS pausados,
      SUM(CASE WHEN destacado=1      THEN 1 ELSE 0 END) AS destacados
    FROM productos WHERE empresa_id = ?
  `).get(eid);
  const categorias = db.prepare('SELECT COUNT(*) AS n FROM categorias WHERE empresa_id = ?').get(eid).n;
  const limit = productLimitCheck(eid);

  res.json({ ...row, categorias, limite: { max: limit.max, actual: limit.current ?? row.total } });
});

module.exports = router;
