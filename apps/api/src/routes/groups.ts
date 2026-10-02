import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

// TODO: create group, join by invite code, list members, per-metric opt-in.
export const groups = Router();
groups.use(requireAuth);
groups.post('/groups', (_req, res) => res.status(501).json({ error: 'not implemented' }));
groups.post('/groups/join', (_req, res) => res.status(501).json({ error: 'not implemented' }));
