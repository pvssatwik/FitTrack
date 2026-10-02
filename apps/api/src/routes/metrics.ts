import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

// TODO: GET /metrics/daily?metric=steps&from=&to=  -> chart data grouped by category
export const metrics = Router();
metrics.use(requireAuth);
metrics.get('/metrics/daily', (_req, res) => res.status(501).json({ error: 'not implemented' }));
