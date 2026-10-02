import cors from 'cors';
import express from 'express';
import { config } from './config';
import { auth } from './routes/auth';
import { groups } from './routes/groups';
import { health } from './routes/health';
import { leaderboards } from './routes/leaderboards';
import { metrics } from './routes/metrics';
import { uploads } from './routes/uploads';
import { boss } from './services/queue';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', health, auth, uploads, metrics, groups, leaderboards);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

await boss.start();
await boss.createQueue('process-upload');
app.listen(config.PORT, () => console.log(`api listening on :${config.PORT}`));
