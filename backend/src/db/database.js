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
const migrations = [
  // M02-v2: impersonation audit column
  `ALTER TABLE sesiones ADD COLUMN impersonating_empresa_id TEXT`,
];

const existingCols = db.prepare("PRAGMA table_info(sesiones)").all().map(c => c.name);
for (const sql of migrations) {
  // Extract column name from ALTER TABLE … ADD COLUMN <name>
  const match = sql.match(/ADD COLUMN (\w+)/i);
  if (match && !existingCols.includes(match[1])) {
    db.exec(sql);
  }
}

module.exports = db;
