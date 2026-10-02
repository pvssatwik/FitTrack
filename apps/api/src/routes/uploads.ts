import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { PROCESS_UPLOAD_QUEUE, type ProcessUploadJob } from '@flb/shared';
import { config } from '../config';
import { pool } from '../db/pool';
import { requireAuth } from '../middleware/auth';
import { boss } from '../services/queue';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.UPLOAD_MAX_BYTES },
});

export const uploads = Router();
uploads.use(requireAuth);

// 1) Direct file upload to API: parsed in-memory, no external S3 bucket needed.
uploads.post('/uploads', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uploadId = randomUUID();
  const content = req.file.buffer.toString('utf-8');

  try {
    await pool.query(
      "INSERT INTO uploads (id, user_id, filename, status) VALUES ($1, $2, $3, 'pending')",
      [uploadId, req.userId, req.file.originalname],
    );
  } catch {
    // Allows operation if uploads table is not yet migrated in development
  }

  const job: ProcessUploadJob = {
    uploadId,
    filename: req.file.originalname,
    content,
  };
  await boss.send(PROCESS_UPLOAD_QUEUE, job);

  res.status(202).json({ uploadId, status: 'queued' });
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
