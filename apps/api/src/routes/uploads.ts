import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { PROCESS_UPLOAD_QUEUE, type ProcessUploadJob } from '@flb/shared';
import { config } from '../config';
import { pool } from '../db/pool';
import { requireAuth } from '../middleware/auth';
import { boss } from '../services/queue';
import { presignUpload } from '../services/storage';

export const uploads = Router();
uploads.use(requireAuth);

// 1) Client asks for a short-lived direct-upload URL.
const createBody = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().int().positive().max(config.UPLOAD_MAX_BYTES),
});
uploads.post('/uploads', async (req, res) => {
  const body = createBody.parse(req.body);
  const key = `uploads/${req.userId}/${randomUUID()}`;
  const { rows } = await pool.query(
    'INSERT INTO uploads (user_id, object_key) VALUES ($1, $2) RETURNING id',
    [req.userId, key],
  );
  res.json({ uploadId: rows[0].id, url: await presignUpload(key, body.contentType) });
});

// 2) Client confirms the file landed; we enqueue parsing. Never parse in the request.
uploads.post('/uploads/:id/complete', async (req, res) => {
  const { rowCount } = await pool.query(
    "UPDATE uploads SET status = 'pending' WHERE id = $1 AND user_id = $2",
    [req.params.id, req.userId],
  );
  if (!rowCount) return res.status(404).json({ error: 'not found' });
  const job: ProcessUploadJob = { uploadId: req.params.id };
  await boss.send(PROCESS_UPLOAD_QUEUE, job);
  res.status(202).json({ status: 'queued' });
});

// 3) Client polls for the preview ("found 6 days of steps, no sleep data").
uploads.get('/uploads/:id', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, status, provider, summary, error FROM uploads WHERE id = $1 AND user_id = $2',
    [req.params.id, req.userId],
  );
  if (!rows[0]) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});
