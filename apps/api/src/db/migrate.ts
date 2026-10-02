import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

// Minimal SQL migration runner: applies db/migrations/*.sql in order, once each.
const dir = process.env.MIGRATIONS_DIR ?? path.resolve(process.cwd(), '../../db/migrations');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

await client.connect();
await client.query(
  'CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())',
);
const done = new Set((await client.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
  if (done.has(file)) continue;
  console.log('applying', file);
  await client.query('BEGIN');
  try {
    await client.query(fs.readFileSync(path.join(dir, file), 'utf8'));
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}
await client.end();
