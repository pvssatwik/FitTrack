import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import pg from 'pg';

const dir = process.env.MIGRATIONS_DIR ?? path.resolve(process.cwd(), '../../db/migrations');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

await client.connect();
await client.query(
  'CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())',
);
const done = new Set((await client.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));

const migrationFiles = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'))
  .sort();

for (const file of migrationFiles) {
  if (done.has(file)) continue;
  console.log('Applying migration:', file);

  const filePath = path.join(dir, file);
  const migration = await import(pathToFileURL(filePath).href);

  await client.query('BEGIN');
  try {
    if (typeof migration.up === 'function') {
      await migration.up(client);
    }
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
    await client.query('COMMIT');
    console.log('Applied migration:', file);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}
await client.end();
