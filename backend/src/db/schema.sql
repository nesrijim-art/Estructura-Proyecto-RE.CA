-- RE.CA Platform · Database Schema
-- Each table that belongs to a tenant carries empresa_id for full data isolation

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─── Tenants ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS empresas (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  plan        TEXT NOT NULL DEFAULT 'start'
                CHECK(plan IN ('start','business','premium')),
  estado      TEXT NOT NULL DEFAULT 'activa'
                CHECK(estado IN ('activa','suspendida','cancelada')),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  plan_expira_en DATETIME
);

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre        TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin_negocio'
                  CHECK(role IN ('super_admin','admin_negocio','colaborador')),
  empresa_id    TEXT REFERENCES empresas(id),
  activo        INTEGER NOT NULL DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_access   DATETIME
);

CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_empresa_id ON users(empresa_id);

-- ─── Sessions (refresh-token store + audit) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS sesiones (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL REFERENCES users(id),
  empresa_id          TEXT,
  refresh_token_hash  TEXT NOT NULL,
  ip_address          TEXT,
  user_agent          TEXT,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at          DATETIME NOT NULL,
  ultimo_acceso       DATETIME,
  estado              TEXT NOT NULL DEFAULT 'activo'
                        CHECK(estado IN ('activo','cerrado','expirado'))
);

CREATE INDEX IF NOT EXISTS idx_sesiones_user_id ON sesiones(user_id);

-- ─── Password Reset Tokens ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_resets (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  token_hash  TEXT NOT NULL,
  expires_at  DATETIME NOT NULL,
  usado       INTEGER NOT NULL DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
