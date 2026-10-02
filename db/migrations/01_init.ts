import type pg from 'pg';

export async function up(client: pg.Client): Promise<void> {
    await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

export async function down(client: pg.Client): Promise<void> {
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
}