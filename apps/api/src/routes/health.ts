import { Router } from 'express';
import { pool } from '../db/pool';

export const health = Router();
health.get('/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true });
});
