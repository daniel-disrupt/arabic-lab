const fs = require('fs');
const path = require('path');

// DB_DRIVER=pglite is a local/dev-only escape hatch: @electric-sql/pglite is a real
// WASM-compiled Postgres with no Docker/native-install requirement, used only for running this
// service's own tests without a hosted database. Production (Railway) always uses DB_DRIVER=pg
// (the default) against DATABASE_URL, real node-postgres against real Postgres.
const DRIVER = process.env.DB_DRIVER || 'pg';

let queryImpl;
let initImpl;

if (DRIVER === 'pglite') {
  const { PGlite } = require('@electric-sql/pglite');
  const db = new PGlite(process.env.PGLITE_DATA_DIR || undefined);
  queryImpl = (sql, params) => db.query(sql, params);
  initImpl = async () => {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.exec(schema);
  };
} else {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  queryImpl = (sql, params) => pool.query(sql, params);
  initImpl = async () => {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
  };
}

module.exports = {
  init: () => initImpl(),
  query: (sql, params) => queryImpl(sql, params),
};
