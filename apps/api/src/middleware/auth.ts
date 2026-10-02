import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';

declare module 'express-serve-static-core' {
  interface Request { userId?: string }
}

/**
 * TODO: real sessions (cookie + SESSION_SECRET). Until then, in development only,
 * accept an `x-dev-user-id` header so the rest of the API can be exercised.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const devId = req.header('x-dev-user-id');
  if (config.NODE_ENV === 'development' && devId) {
    req.userId = devId;
    return next();
  }
  res.status(401).json({ error: 'unauthenticated' });
}
