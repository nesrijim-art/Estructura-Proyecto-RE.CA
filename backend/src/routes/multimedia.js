'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { requireEmpresaRole } = require('../middleware/requireEmpresaRole');
const { requireFeature } = require('../middleware/requireFeature');

const router = express.Router();

// ── Storage setup ─────────────────────────────────────────────────────────────

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/multimedia');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
]);
const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4', 'video/webm', 'video/quicktime',
]);
const IMAGE_MAX_BYTES = 2 * 1024 * 1024;   // 2 MB
const VIDEO_MAX_BYTES = 50 * 1024 * 1024;  // 50 MB

function resolveFileType(mime) {
  if (ALLOWED_IMAGE_TYPES.has(mime)) return 'imagen';
  if (ALLOWED_VIDEO_TYPES.has(mime)) return 'video';
  return null;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase() || '';
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Multer instance — size limit enforced per type in the route handler
const upload = multer({
  storage,
  limits: { fileSize: VIDEO_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (resolveFileType(file.mimetype)) return cb(null, true);
    cb(Object.assign(
      new Error('Tipo de archivo no permitido. Use JPG, PNG, WebP, GIF, SVG, MP4, WebM o MOV.'),
      { status: 400 }
    ));
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEmpresaId(req) {
  return req.user.impersonating
    ? req.user.impersonating_empresa_id
    : req.user.empresa_id;
}

function publicMedia(row, refs = []) {
  return {
    id:           row.id,
    nombre:       row.nombre,
    tipo:         row.tipo,
    mime_type:    row.mime_type,
    url:          `/uploads/multimedia/${row.filename}`,
    size_bytes:   row.size_bytes,
    width:        row.width   || null,
    height:       row.height  || null,
    duracion_seg: row.duracion_seg || null,
    ia_mejorado:  !!row.ia_mejorado,
    ia_pendiente: !!row.ia_pendiente,
    asignado:     refs.length > 0,
    usos:         refs,
    created_at:   row.created_at,
    updated_at:   row.updated_at,
  };
}

function getRefsForMedia(mediaId) {
  return db.prepare(`
    SELECT id, modulo, entidad_id, descripcion, created_at
    FROM multimedia_refs WHERE multimedia_id = ?
  `).all(mediaId);
}

function deleteFile(filename) {
  const fp = path.join(UPLOAD_DIR, filename);
  fs.unlink(fp, () => {});
}

// ── GET /api/multimedia/stats ─────────────────────────────────────────────────
router.get('/stats', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  if (!eid) return res.status(400).json({ message: 'Sin empresa asociada' });

  const row = db.prepare(`
    SELECT
      COUNT(*)                                        AS total,
      SUM(CASE WHEN tipo='imagen' THEN 1 ELSE 0 END)  AS imagenes,
      SUM(CASE WHEN tipo='video'  THEN 1 ELSE 0 END)  AS videos,
      SUM(size_bytes)                                 AS total_bytes
    FROM multimedia WHERE empresa_id = ?
  `).get(eid);

  const usados = db.prepare(`
    SELECT COUNT(DISTINCT m.id) AS n
    FROM multimedia m
    INNER JOIN multimedia_refs r ON r.multimedia_id = m.id
    WHERE m.empresa_id = ?
  `).get(eid).n;

  res.json({
    total:       row.total        || 0,
    imagenes:    row.imagenes     || 0,
    videos:      row.videos       || 0,
    total_bytes: row.total_bytes  || 0,
    usados,
    sin_usar:    (row.total || 0) - usados,
  });
});

// ── GET /api/multimedia ───────────────────────────────────────────────────────
router.get('/', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  if (!eid) return res.status(400).json({ message: 'Sin empresa asociada' });

  const { tipo, asignado, orden = 'reciente', q } = req.query;

  let sql = `
    SELECT m.*,
      (SELECT COUNT(*) FROM multimedia_refs r WHERE r.multimedia_id = m.id) AS ref_count
    FROM multimedia m
    WHERE m.empresa_id = ?
  `;
  const params = [eid];

  if (tipo === 'imagen' || tipo === 'video') {
    sql += ` AND m.tipo = ?`;
    params.push(tipo);
  }
  if (asignado === 'true')  { sql += ` AND ref_count > 0`; }
  if (asignado === 'false') { sql += ` AND ref_count = 0`; }
  if (q) {
    sql += ` AND m.nombre LIKE ?`;
    params.push(`%${q}%`);
  }

  const orderMap = {
    reciente: 'm.created_at DESC',
    antiguo:  'm.created_at ASC',
    tamano:   'm.size_bytes DESC',
    nombre:   'm.nombre ASC',
  };
  sql += ` ORDER BY ${orderMap[orden] || orderMap.reciente}`;

  const rows = db.prepare(sql).all(...params);
  const archivos = rows.map(row => {
    const refs = getRefsForMedia(row.id);
    return publicMedia(row, refs);
  });

  res.json({ archivos });
});

// ── POST /api/multimedia/upload ───────────────────────────────────────────────
router.post(
  '/upload',
  requireAuth,
  requireEmpresaRole('dueno', 'admin', 'editor'),
  (req, res, next) => upload.single('archivo')(req, res, err => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : (err.status || 400);
      return res.status(status).json({
        message: err.code === 'LIMIT_FILE_SIZE'
          ? 'El archivo supera el tamaño máximo permitido'
          : err.message,
      });
    }
    next();
  }),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo' });

    const tipo = resolveFileType(req.file.mimetype);
    if (!tipo) {
      deleteFile(req.file.filename);
      return res.status(400).json({ message: 'Tipo de archivo no permitido' });
    }

    // Enforce per-type size limit for images
    if (tipo === 'imagen' && req.file.size > IMAGE_MAX_BYTES) {
      deleteFile(req.file.filename);
      return res.status(413).json({ message: 'Las imágenes no pueden superar los 2 MB' });
    }

    const eid    = getEmpresaId(req);
    const nombre = req.body.nombre?.trim() || path.parse(req.file.originalname).name;
    const width  = req.body.width  ? parseInt(req.body.width,  10) : null;
    const height = req.body.height ? parseInt(req.body.height, 10) : null;
    const dur    = req.body.duracion_seg ? parseFloat(req.body.duracion_seg) : null;

    const id = uuidv4();
    db.prepare(`
      INSERT INTO multimedia
        (id, empresa_id, nombre, tipo, mime_type, filename, size_bytes, width, height, duracion_seg)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, eid, nombre, tipo, req.file.mimetype, req.file.filename, req.file.size, width, height, dur);

    const row = db.prepare('SELECT * FROM multimedia WHERE id = ?').get(id);
    res.status(201).json(publicMedia(row, []));
  }
);

// ── GET /api/multimedia/:id ───────────────────────────────────────────────────
router.get('/:id', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  const row = db.prepare('SELECT * FROM multimedia WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!row) return res.status(404).json({ message: 'Archivo no encontrado' });

  res.json(publicMedia(row, getRefsForMedia(row.id)));
});

// ── PUT /api/multimedia/:id — rename ─────────────────────────────────────────
router.put('/:id', requireAuth, requireEmpresaRole('dueno', 'admin', 'editor'), (req, res) => {
  const eid = getEmpresaId(req);
  const { nombre } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ message: 'nombre es requerido' });

  const row = db.prepare('SELECT id FROM multimedia WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!row) return res.status(404).json({ message: 'Archivo no encontrado' });

  db.prepare(`UPDATE multimedia SET nombre = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(nombre.trim(), req.params.id);

  const updated = db.prepare('SELECT * FROM multimedia WHERE id = ?').get(req.params.id);
  res.json(publicMedia(updated, getRefsForMedia(req.params.id)));
});

// ── GET /api/multimedia/:id/usos ─────────────────────────────────────────────
router.get('/:id/usos', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  const row = db.prepare('SELECT id FROM multimedia WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!row) return res.status(404).json({ message: 'Archivo no encontrado' });

  const refs = getRefsForMedia(req.params.id);
  res.json({ usos: refs, total: refs.length });
});

// ── DELETE /api/multimedia/:id ────────────────────────────────────────────────
router.delete('/:id', requireAuth, requireEmpresaRole('dueno', 'admin'), (req, res) => {
  const eid = getEmpresaId(req);
  const row = db.prepare('SELECT * FROM multimedia WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
  if (!row) return res.status(404).json({ message: 'Archivo no encontrado' });

  const refs = getRefsForMedia(req.params.id);
  if (refs.length > 0) {
    return res.status(409).json({
      message: 'Este archivo está siendo utilizado y no puede eliminarse directamente. Usa "Reemplazar" para sustituirlo.',
      usos: refs,
      puede_reemplazar: true,
    });
  }

  db.transaction(() => {
    db.prepare('DELETE FROM multimedia WHERE id = ?').run(req.params.id);
    deleteFile(row.filename);
    if (row.ia_candidato_filename) deleteFile(row.ia_candidato_filename);
  })();

  res.json({ message: 'Archivo eliminado', id: req.params.id });
});

// ── POST /api/multimedia/:id/reemplazar — safe replace ───────────────────────
router.post(
  '/:id/reemplazar',
  requireAuth,
  requireEmpresaRole('dueno', 'admin', 'editor'),
  (req, res, next) => upload.single('archivo')(req, res, err => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : (err.status || 400);
      return res.status(status).json({ message: err.message });
    }
    next();
  }),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo' });

    const eid = getEmpresaId(req);
    const row = db.prepare('SELECT * FROM multimedia WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
    if (!row) {
      deleteFile(req.file.filename);
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    const nuevoTipo = resolveFileType(req.file.mimetype);
    if (!nuevoTipo) {
      deleteFile(req.file.filename);
      return res.status(400).json({ message: 'Tipo de archivo no permitido' });
    }
    if (nuevoTipo === 'imagen' && req.file.size > IMAGE_MAX_BYTES) {
      deleteFile(req.file.filename);
      return res.status(413).json({ message: 'Las imágenes no pueden superar los 2 MB' });
    }

    const width  = req.body.width  ? parseInt(req.body.width,  10) : null;
    const height = req.body.height ? parseInt(req.body.height, 10) : null;
    const dur    = req.body.duracion_seg ? parseFloat(req.body.duracion_seg) : null;

    db.transaction(() => {
      const oldFilename = row.filename;
      db.prepare(`
        UPDATE multimedia
        SET filename = ?, mime_type = ?, tipo = ?, size_bytes = ?,
            width = ?, height = ?, duracion_seg = ?,
            ia_mejorado = 0, ia_pendiente = 0, ia_candidato_filename = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `).run(req.file.filename, req.file.mimetype, nuevoTipo,
             req.file.size, width, height, dur, req.params.id);
      deleteFile(oldFilename);
      if (row.ia_candidato_filename) deleteFile(row.ia_candidato_filename);
    })();

    const updated = db.prepare('SELECT * FROM multimedia WHERE id = ?').get(req.params.id);
    res.json({ message: 'Archivo reemplazado. Las referencias existentes apuntan al nuevo archivo.', ...publicMedia(updated, getRefsForMedia(req.params.id)) });
  }
);

// ── POST /api/multimedia/:id/mejora-ia — request AI improvement ──────────────
router.post(
  '/:id/mejora-ia',
  requireAuth,
  requireEmpresaRole('dueno', 'admin', 'editor'),
  requireFeature('ia_imagenes'),
  (req, res) => {
    const eid = getEmpresaId(req);
    const row = db.prepare('SELECT * FROM multimedia WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
    if (!row) return res.status(404).json({ message: 'Archivo no encontrado' });
    if (row.tipo !== 'imagen') return res.status(400).json({ message: 'La mejora con IA solo aplica a imágenes' });
    if (row.ia_pendiente) return res.status(409).json({ message: 'Ya existe una mejora de IA pendiente de aprobación' });

    // M09 integration stub — infrastructure ready, awaiting M09 implementation
    db.prepare(`UPDATE multimedia SET ia_pendiente = 1, updated_at = datetime('now') WHERE id = ?`).run(row.id);

    res.status(202).json({
      message: 'Solicitud de mejora con IA registrada. La integración definitiva estará disponible con M09.',
      ia_pendiente: true,
      _stub: true,
    });
  }
);

// ── POST /api/multimedia/:id/aprobar-ia — approve AI improvement ─────────────
router.post(
  '/:id/aprobar-ia',
  requireAuth,
  requireEmpresaRole('dueno', 'admin', 'editor'),
  (req, res) => {
    const eid = getEmpresaId(req);
    const row = db.prepare('SELECT * FROM multimedia WHERE id = ? AND empresa_id = ?').get(req.params.id, eid);
    if (!row) return res.status(404).json({ message: 'Archivo no encontrado' });
    if (!row.ia_pendiente) return res.status(409).json({ message: 'No hay mejora de IA pendiente de aprobación' });
    if (!row.ia_candidato_filename) {
      // Stub: clear the pending flag since M09 hasn't set a candidate yet
      db.prepare(`UPDATE multimedia SET ia_pendiente = 0, updated_at = datetime('now') WHERE id = ?`).run(row.id);
      return res.status(409).json({ message: 'La mejora de IA aún no está lista. Espera a que M09 genere la imagen.' });
    }

    db.transaction(() => {
      const oldFilename = row.filename;
      db.prepare(`
        UPDATE multimedia
        SET filename = ia_candidato_filename, ia_mejorado = 1,
            ia_pendiente = 0, ia_candidato_filename = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `).run(row.id);
      deleteFile(oldFilename);
    })();

    const updated = db.prepare('SELECT * FROM multimedia WHERE id = ?').get(req.params.id);
    res.json({ message: 'Mejora de IA aplicada.', ...publicMedia(updated, getRefsForMedia(req.params.id)) });
  }
);

// ── Service endpoints — consumed by M06, M08, M09 ────────────────────────────

// POST /api/multimedia/refs — register a reference
router.post('/refs', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  const { multimedia_id, modulo, entidad_id, descripcion } = req.body;

  if (!multimedia_id || !modulo || !entidad_id)
    return res.status(400).json({ message: 'multimedia_id, modulo y entidad_id son requeridos' });

  const media = db.prepare('SELECT id FROM multimedia WHERE id = ? AND empresa_id = ?').get(multimedia_id, eid);
  if (!media) return res.status(404).json({ message: 'Archivo multimedia no encontrado' });

  const id = uuidv4();
  try {
    db.prepare(`
      INSERT INTO multimedia_refs (id, multimedia_id, modulo, entidad_id, descripcion)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, multimedia_id, modulo, entidad_id, descripcion || null);
  } catch (e) {
    if (e.message?.includes('UNIQUE')) {
      return res.status(409).json({ message: 'Esta referencia ya existe' });
    }
    throw e;
  }

  res.status(201).json({ id, multimedia_id, modulo, entidad_id, descripcion });
});

// DELETE /api/multimedia/refs/:refId — remove a reference
router.delete('/refs/:refId', requireAuth, (req, res) => {
  const eid = getEmpresaId(req);
  // Ensure the ref belongs to a media file owned by this empresa
  const ref = db.prepare(`
    SELECT r.id FROM multimedia_refs r
    JOIN multimedia m ON r.multimedia_id = m.id
    WHERE r.id = ? AND m.empresa_id = ?
  `).get(req.params.refId, eid);

  if (!ref) return res.status(404).json({ message: 'Referencia no encontrada' });
  db.prepare('DELETE FROM multimedia_refs WHERE id = ?').run(req.params.refId);
  res.json({ message: 'Referencia eliminada', id: req.params.refId });
});

module.exports = router;
