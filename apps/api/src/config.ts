import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
  UPLOAD_MAX_BYTES: z.coerce.number().default(50 * 1024 * 1024),
});

export const config = schema.parse(process.env);
