import PgBoss from 'pg-boss';
import { PROCESS_UPLOAD_QUEUE, type ProcessUploadJob } from '@flb/shared';
import { processUpload } from './jobs/processUpload';
import { weeklyPoints } from './jobs/weeklyPoints';

// One worker process: parsing is bursty, and a single consumer also avoids token-refresh races later.
const boss = new PgBoss(process.env.DATABASE_URL!);
await boss.start();
await boss.createQueue(PROCESS_UPLOAD_QUEUE);
await boss.createQueue('weekly-points');

await boss.work<ProcessUploadJob>(PROCESS_UPLOAD_QUEUE, async ([job]) => processUpload(job.data));
await boss.schedule('weekly-points', '0 2 * * 1'); // Mondays 02:00 UTC
await boss.work('weekly-points', async () => weeklyPoints());

console.log('worker started');
