import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

// TODO: GET /groups/:id/leaderboards/:metric (weekly, monthly, season); comparison between users.
// Only include users who opted in for that metric; label verified (api) vs self-reported (upload).
export const leaderboards = Router();
leaderboards.use(requireAuth);
leaderboards.get('/groups/:id/leaderboards/:metric', (_req, res) =>
  res.status(501).json({ error: 'not implemented' }),
);
