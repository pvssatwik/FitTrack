import { detectCsvProvider, ultrahumanAdapter } from '@flb/parsers';
import type { ProcessUploadJob } from '@flb/shared';

/**
 * Pipeline (see docs/architecture.md):
 *  download from storage -> detect source -> vendor adapter -> validate -> assign timezone ->
 *  upsert into metric_samples (user, metric, ts) -> aggregate daily_metrics -> write
 *  uploads.summary (preview) -> delete raw file (unless retention is chosen).
 */
export async function processUpload(job: ProcessUploadJob): Promise<void> {
  // TODO: mark uploads.status = 'processing'
  // TODO: download object (R2) by uploads.object_key
  const text = ''; // TODO: file contents
  const provider = detectCsvProvider(text.split(/\r?\n/, 1)[0] ?? '');
  if (provider !== 'ultrahuman') throw new Error('Unsupported or undetected file (Fitbit adapter pending)');
  const { samples, skipped } = ultrahumanAdapter.parse(text);
  // TODO: upsert samples, derive daily metrics (sleep, resting HR, active minutes), save summary
  console.log(`upload ${job.uploadId}: ${samples.length} samples`, skipped);
}
