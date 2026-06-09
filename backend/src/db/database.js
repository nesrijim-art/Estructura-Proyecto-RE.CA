'use strict';

const path = require('path');
const fs   = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH
  ? path.resolve(__dirname, '../../', process.env.DB_PATH)
  : path.join(__dirname, '../../data/reca.db');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Apply schema on first run
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Incremental migrations — safe to run on existing databases
const tableMigrations = {
  sesiones: [
    `ALTER TABLE sesiones ADD COLUMN impersonating_empresa_id TEXT`,
  ],
  empresas: [
    `ALTER TABLE empresas ADD COLUMN plan_id TEXT REFERENCES planes(id)`,
    `ALTER TABLE empresas ADD COLUMN fecha_activacion_plan DATETIME`,
    `ALTER TABLE empresas ADD COLUMN fecha_renovacion_plan DATETIME`,
    `ALTER TABLE empresas ADD COLUMN estado_suscripcion TEXT DEFAULT 'activa'`,
    // M03
    `ALTER TABLE empresas ADD COLUMN ciudad TEXT`,
    `ALTER TABLE empresas ADD COLUMN notas_soporte TEXT`,
    // M04: visual identity
    `ALTER TABLE empresas ADD COLUMN logo_url TEXT`,
    `ALTER TABLE empresas ADD COLUMN color_principal TEXT DEFAULT '#ffd21e'`,
    `ALTER TABLE empresas ADD COLUMN color_secundario TEXT DEFAULT '#0d1117'`,
    `ALTER TABLE empresas ADD COLUMN color_fondo TEXT DEFAULT '#fafafa'`,
    `ALTER TABLE empresas ADD COLUMN color_texto TEXT DEFAULT '#0d1117'`,
    `ALTER TABLE empresas ADD COLUMN color_botones TEXT DEFAULT '#ffd21e'`,
    `ALTER TABLE empresas ADD COLUMN color_promociones TEXT DEFAULT '#dc2626'`,
    `ALTER TABLE empresas ADD COLUMN identidad_updated_at DATETIME`,
  ],
  users: [
    // M04: intra-empresa role (dueno|admin|editor|visualizador)
    `ALTER TABLE users ADD COLUMN rol_empresa TEXT DEFAULT 'visualizador'`,
  ],
};

for (const [table, sqls] of Object.entries(tableMigrations)) {
  const existingCols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
  for (const sql of sqls) {
    const match = sql.match(/ADD COLUMN (\w+)/i);
    if (match && !existingCols.includes(match[1])) {
      db.exec(sql);
    }
  }
}

// M05: create planes + historial_pagos tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS planes (
    id                      TEXT PRIMARY KEY,
    nombre                  TEXT NOT NULL,
    precio_mensual          REAL NOT NULL DEFAULT 0,
    usuarios_max            INTEGER NOT NULL DEFAULT 0,
    productos_max           INTEGER NOT NULL DEFAULT 0,
    idiomas_max             INTEGER NOT NULL DEFAULT 1,
    ia_texto                INTEGER NOT NULL DEFAULT 0,
    ia_imagenes             INTEGER NOT NULL DEFAULT 0,
    analytics_basico        INTEGER NOT NULL DEFAULT 0,
    analytics_avanzado      INTEGER NOT NULL DEFAULT 0,
    marketing_basico        INTEGER NOT NULL DEFAULT 0,
    marketing_avanzado      INTEGER NOT NULL DEFAULT 0,
    automatizaciones        INTEGER NOT NULL DEFAULT 0,
    menu_dinamico           INTEGER NOT NULL DEFAULT 0,
    calendario_ia           INTEGER NOT NULL DEFAULT 0,
    publicaciones_automaticas INTEGER NOT NULL DEFAULT 0,
    estado                  TEXT NOT NULL DEFAULT 'activo'
                              CHECK(estado IN ('activo','inactivo')),
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS historial_pagos (
    id                TEXT PRIMARY KEY,
    empresa_id        TEXT NOT NULL REFERENCES empresas(id),
    tipo              TEXT NOT NULL CHECK(tipo IN ('pago','cambio_plan','activacion')),
    descripcion       TEXT,
    plan_anterior_id  TEXT REFERENCES planes(id),
    plan_nuevo_id     TEXT NOT NULL REFERENCES planes(id),
    monto             REAL NOT NULL DEFAULT 0,
    estado            TEXT NOT NULL DEFAULT 'pagado'
                        CHECK(estado IN ('pagado','pendiente','fallido')),
    metodo_pago       TEXT,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_historial_empresa ON historial_pagos(empresa_id);
`);

// M04: create tokens_invitacion table
db.exec(`
  CREATE TABLE IF NOT EXISTS tokens_invitacion (
    id          TEXT PRIMARY KEY,
    token_hash  TEXT NOT NULL UNIQUE,
    empresa_id  TEXT NOT NULL REFERENCES empresas(id),
    rol         TEXT NOT NULL CHECK(rol IN ('admin','editor','visualizador')),
    contacto    TEXT NOT NULL,
    metodo      TEXT NOT NULL DEFAULT 'email' CHECK(metodo IN ('email','whatsapp','enlace')),
    usado       INTEGER NOT NULL DEFAULT 0,
    expira_at   DATETIME NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_tokens_inv_empresa ON tokens_invitacion(empresa_id);
`);

// M04: back-fill rol_empresa for existing users
// admin_negocio → dueno; colaborador defaults stay as 'visualizador'
db.prepare(`
  UPDATE users SET rol_empresa = 'dueno'
  WHERE role = 'admin_negocio' AND (rol_empresa IS NULL OR rol_empresa = 'visualizador')
`).run();

// Seed base plans
const seedPlanes = db.prepare(`
  INSERT OR IGNORE INTO planes
    (id, nombre, precio_mensual, usuarios_max, productos_max, idiomas_max,
     ia_texto, ia_imagenes, analytics_basico, analytics_avanzado,
     marketing_basico, marketing_avanzado, automatizaciones,
     menu_dinamico, calendario_ia, publicaciones_automaticas)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

db.transaction(() => {
  seedPlanes.run('start',    'Start',    150, 2,  50,  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0);
  seedPlanes.run('business', 'Business', 300, 5,  200, 2, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0);
  seedPlanes.run('premium',  'Premium',  600, 0,  0,   5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
})();

// M06: product catalog
db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id          TEXT PRIMARY KEY,
    empresa_id  TEXT NOT NULL REFERENCES empresas(id),
    nombre      TEXT NOT NULL,
    emoji       TEXT,
    descripcion TEXT,
    orden       INTEGER NOT NULL DEFAULT 0,
    activo      INTEGER NOT NULL DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_categorias_empresa ON categorias(empresa_id);

  CREATE TABLE IF NOT EXISTS productos (
    id              TEXT PRIMARY KEY,
    empresa_id      TEXT NOT NULL REFERENCES empresas(id),
    categoria_id    TEXT REFERENCES categorias(id),
    multimedia_id   TEXT REFERENCES multimedia(id),
    precio          REAL NOT NULL DEFAULT 0,
    precio_original REAL,
    estado          TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo','pausado')),
    destacado       INTEGER NOT NULL DEFAULT 0,
    orden           INTEGER NOT NULL DEFAULT 0,
    etiquetas       TEXT NOT NULL DEFAULT '[]',
    alergenos       TEXT,
    tiempo_prep_min INTEGER,
    calorias        INTEGER,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_productos_empresa    ON productos(empresa_id);
  CREATE INDEX IF NOT EXISTS idx_productos_categoria  ON productos(categoria_id);

  CREATE TABLE IF NOT EXISTS producto_traducciones (
    id          TEXT PRIMARY KEY,
    producto_id TEXT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    idioma      TEXT NOT NULL,
    nombre      TEXT NOT NULL,
    descripcion TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_prod_trad_unique ON producto_traducciones(producto_id, idioma);
  CREATE INDEX IF NOT EXISTS idx_prod_trad_producto ON producto_traducciones(producto_id);
`);

// M07: multimedia library
db.exec(`
  CREATE TABLE IF NOT EXISTS multimedia (
    id                    TEXT PRIMARY KEY,
    empresa_id            TEXT NOT NULL REFERENCES empresas(id),
    nombre                TEXT NOT NULL,
    tipo                  TEXT NOT NULL CHECK(tipo IN ('imagen','video')),
    mime_type             TEXT NOT NULL,
    filename              TEXT NOT NULL,
    size_bytes            INTEGER NOT NULL DEFAULT 0,
    width                 INTEGER,
    height                INTEGER,
    duracion_seg          REAL,
    ia_mejorado           INTEGER NOT NULL DEFAULT 0,
    ia_pendiente          INTEGER NOT NULL DEFAULT 0,
    ia_candidato_filename TEXT,
    created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_multimedia_empresa ON multimedia(empresa_id);

  CREATE TABLE IF NOT EXISTS multimedia_refs (
    id            TEXT PRIMARY KEY,
    multimedia_id TEXT NOT NULL REFERENCES multimedia(id) ON DELETE CASCADE,
    modulo        TEXT NOT NULL,
    entidad_id    TEXT NOT NULL,
    descripcion   TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_multimedia_refs_unique
    ON multimedia_refs(multimedia_id, modulo, entidad_id);
  CREATE INDEX IF NOT EXISTS idx_multimedia_refs_media ON multimedia_refs(multimedia_id);
`);

module.exports = db;
