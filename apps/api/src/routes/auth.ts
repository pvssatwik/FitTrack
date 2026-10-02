import { Router } from 'express';

// TODO: signup / login / logout / me (hash with argon2 or bcrypt), account deletion.
export const auth = Router();
auth.post('/auth/signup', (_req, res) => res.status(501).json({ error: 'not implemented' }));
auth.post('/auth/login', (_req, res) => res.status(501).json({ error: 'not implemented' }));
auth.post('/auth/logout', (_req, res) => res.status(501).json({ error: 'not implemented' }));
auth.get('/auth/me', (_req, res) => res.status(501).json({ error: 'not implemented' }));
