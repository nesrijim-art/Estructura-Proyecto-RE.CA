'use strict';

const express = require('express');
const db      = require('../db/database');

const router = express.Router();

// ── GET /api/menu/:slug — public digital menu ─────────────────────────────────
// No auth required. Consumed by the public menu page (app/menu/index.html).
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const { lang = 'es' } = req.query;

  const empresa = db.prepare(`
    SELECT id, nombre, slug, estado
    FROM empresas WHERE slug = ?
  `).get(slug);

  if (!empresa) return res.status(404).json({ message: 'Menú no encontrado' });
  if (empresa.estado !== 'activa') {
    return res.status(403).json({ message: 'Este menú no está disponible actualmente' });
  }

  // Visual identity
  const identidad = db.prepare(`
    SELECT logo_url, color_principal, color_secundario,
           color_fondo, color_texto, color_botones, color_promociones
    FROM empresas WHERE id = ?
  `).get(empresa.id);

  // Active categories ordered
  const categorias = db.prepare(`
    SELECT id, nombre, emoji, descripcion, orden
    FROM categorias
    WHERE empresa_id = ? AND activo = 1
    ORDER BY orden ASC, created_at ASC
  `).all(empresa.id);

  // Active products per category, with requested language translation
  const stmtProds = db.prepare(`
    SELECT p.id, p.categoria_id, p.precio, p.precio_original,
           p.destacado, p.etiquetas, p.alergenos, p.tiempo_prep_min, p.calorias,
           m.filename AS img_filename
    FROM productos p
    LEFT JOIN multimedia m ON p.multimedia_id = m.id
    WHERE p.empresa_id = ? AND p.estado = 'activo'
    ORDER BY p.orden ASC, p.created_at ASC
  `);

  const stmtTrad = db.prepare(`
    SELECT idioma, nombre, descripcion
    FROM producto_traducciones
    WHERE producto_id = ? AND idioma IN (?, 'es')
    ORDER BY idioma DESC
  `);

  function parseTags(v) {
    try { return JSON.parse(v) || []; } catch { return []; }
  }

  const productos = stmtProds.all(empresa.id).map(p => {
    const trads = stmtTrad.all(p.id, lang);
    // Prefer requested lang; fall back to 'es'
    const trad = trads.find(t => t.idioma === lang) || trads.find(t => t.idioma === 'es') || { nombre: '', descripcion: '' };
    return {
      id:           p.id,
      categoria_id: p.categoria_id,
      nombre:       trad.nombre,
      descripcion:  trad.descripcion || null,
      imagen_url:   p.img_filename ? `/uploads/multimedia/${p.img_filename}` : null,
      precio:       p.precio,
      precio_original: p.precio_original || null,
      destacado:    !!p.destacado,
      etiquetas:    parseTags(p.etiquetas),
      alergenos:    p.alergenos || null,
      tiempo_prep_min: p.tiempo_prep_min || null,
      calorias:     p.calorias || null,
    };
  });

  // Group by category
  const menu = categorias.map(cat => ({
    ...cat,
    productos: productos.filter(p => p.categoria_id === cat.id),
  })).filter(cat => cat.productos.length > 0);

  // Available languages for this empresa
  const idiomas = db.prepare(`
    SELECT DISTINCT t.idioma
    FROM producto_traducciones t
    JOIN productos p ON t.producto_id = p.id
    WHERE p.empresa_id = ? AND p.estado = 'activo'
    ORDER BY t.idioma
  `).all(empresa.id).map(r => r.idioma);

  res.json({
    empresa: {
      nombre: empresa.nombre,
      slug:   empresa.slug,
    },
    identidad: {
      logo_url:          identidad?.logo_url || null,
      color_principal:   identidad?.color_principal   || '#ffd21e',
      color_secundario:  identidad?.color_secundario  || '#0d1117',
      color_fondo:       identidad?.color_fondo       || '#fafafa',
      color_texto:       identidad?.color_texto       || '#0d1117',
      color_botones:     identidad?.color_botones     || '#ffd21e',
      color_promociones: identidad?.color_promociones || '#dc2626',
    },
    idiomas_disponibles: idiomas,
    lang_activo:         lang,
    menu,
  });
});

module.exports = router;
