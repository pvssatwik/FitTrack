import PgBoss from 'pg-boss';
import { config } from '../config';

// pg-boss keeps the job queue in Postgres, so no Redis service is needed for phase 1.
export const boss = new PgBoss(config.DATABASE_URL);
