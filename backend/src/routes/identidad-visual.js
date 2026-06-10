'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');
const db      = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { requireEmpresaRole } = require('../middleware/requireEmpresaRole');

const router = express.Router();

// ── Multer setup ──────────────────────────────────────────────────────────────

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/logos');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase() || '.png';
    const name = `empresa_${req.user.empresa_id || req.user.sub}_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(Object.assign(new Error('Tipo de archivo no permitido. Use JPG, PNG, WebP o SVG.'), { status: 400 }));
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEmpresaId(req) {
  return req.user.impersonating
    ? req.user.impersonating_empresa_id
    : req.user.empresa_id;
}

const COLOR_FIELDS = [
  'color_principal',
  'color_secundario',
  'color_fondo',
  'color_texto',
  'color_botones',
  'color_promociones',
];

function isHex(v) {
  return typeof v === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

// ── GET /api/identidad-visual ─────────────────────────────────────────────────
router.get('/', requireAuth, (req, res) => {
  const empresaId = getEmpresaId(req);
  if (!empresaId) return res.status(400).json({ message: 'Sin empresa asociada' });

  const row = db.prepare(`
    SELECT logo_url,
           color_principal, color_secundario, color_fondo,
           color_texto, color_botones, color_promociones,
           whatsapp, identidad_updated_at
    FROM empresas
    WHERE id = ?
  `).get(empresaId);

  if (!row) return res.status(404).json({ message: 'Empresa no encontrada' });

  res.json({
    logo_url:          row.logo_url || null,
    color_principal:   row.color_principal   || '#ffd21e',
    color_secundario:  row.color_secundario  || '#0d1117',
    color_fondo:       row.color_fondo       || '#fafafa',
    color_texto:       row.color_texto       || '#0d1117',
    color_botones:     row.color_botones     || '#ffd21e',
    color_promociones: row.color_promociones || '#dc2626',
    whatsapp:          row.whatsapp          || null,
    identidad_updated_at: row.identidad_updated_at || null,
  });
});

// ── POST /api/identidad-visual/logo — upload logo ─────────────────────────────
router.post(
  '/logo',
  requireAuth,
  requireEmpresaRole('dueno', 'admin'),
  (req, res, next) => upload.single('logo')(req, res, err => {
    if (err) {
      const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo permitido (2 MB)'
        : err.message;
      return res.status(status).json({ message });
    }
    next();
  }),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo' });

    const empresaId = getEmpresaId(req);

    // Delete previous logo file (best-effort)
    const prev = db.prepare('SELECT logo_url FROM empresas WHERE id = ?').get(empresaId);
    if (prev?.logo_url) {
      const prevPath = path.join(UPLOAD_DIR, path.basename(prev.logo_url));
      fs.unlink(prevPath, () => {});
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;

    db.prepare(`
      UPDATE empresas SET logo_url = ?, identidad_updated_at = datetime('now') WHERE id = ?
    `).run(logoUrl, empresaId);

    res.json({ message: 'Logo actualizado', logo_url: logoUrl });
  }
);

// ── PUT /api/identidad-visual/colores — update color palette ──────────────────
router.put('/colores', requireAuth, requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = getEmpresaId(req);

  const updates = {};
  for (const field of COLOR_FIELDS) {
    const val = req.body[field];
    if (val === undefined) continue;
    if (!isHex(val)) {
      return res.status(400).json({ message: `${field} debe ser un color hexadecimal válido (ej. #ffd21e)` });
    }
    updates[field] = val;
  }

  if (Object.keys(updates).length === 0)
    return res.status(400).json({ message: 'No se proporcionaron colores para actualizar' });

  const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values     = [...Object.values(updates), empresaId];

  db.prepare(`
    UPDATE empresas SET ${setClauses}, identidad_updated_at = datetime('now') WHERE id = ?
  `).run(...values);

  res.json({ message: 'Paleta de colores actualizada', ...updates });
});

// ── PUT /api/identidad-visual/contacto — update WhatsApp and contact info ────
router.put('/contacto', requireAuth, requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = getEmpresaId(req);
  const { whatsapp } = req.body;

  if (whatsapp !== undefined && whatsapp !== null) {
    // Accept E.164-like or display format: +1234567890 or digits only
    if (typeof whatsapp !== 'string' || !/^\+?[\d\s\-().]{7,20}$/.test(whatsapp.trim())) {
      return res.status(400).json({ message: 'Número de WhatsApp inválido' });
    }
  }

  db.prepare(`
    UPDATE empresas SET whatsapp = ?, identidad_updated_at = datetime('now') WHERE id = ?
  `).run(whatsapp?.trim() || null, empresaId);

  res.json({ message: 'Información de contacto actualizada', whatsapp: whatsapp?.trim() || null });
});

// ── DELETE /api/identidad-visual/logo — remove logo ──────────────────────────
router.delete('/logo', requireAuth, requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const empresaId = getEmpresaId(req);

  const row = db.prepare('SELECT logo_url FROM empresas WHERE id = ?').get(empresaId);
  if (row?.logo_url) {
    const filePath = path.join(UPLOAD_DIR, path.basename(row.logo_url));
    fs.unlink(filePath, () => {});
  }

  db.prepare(`
    UPDATE empresas SET logo_url = NULL, identidad_updated_at = datetime('now') WHERE id = ?
  `).run(empresaId);

  res.json({ message: 'Logo eliminado' });
});

module.exports = router;
