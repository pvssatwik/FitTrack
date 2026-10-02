import { detectCsvProvider, ultrahumanAdapter } from '@flb/parsers';
import type { ProcessUploadJob } from '@flb/shared';

/**
 * Pipeline:
 *  receive content from job -> detect source -> vendor adapter -> validate -> assign timezone ->
 *  upsert into metric_samples (user, metric, ts) -> aggregate daily_metrics -> write preview summary.
 */
export async function processUpload(job: ProcessUploadJob): Promise<void> {
  const text = job.content;
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const provider = detectCsvProvider(firstLine);
  if (provider !== 'ultrahuman') throw new Error('Unsupported or undetected file (Fitbit adapter pending)');
  const { samples, skipped } = ultrahumanAdapter.parse(text);
  // TODO: upsert samples, derive daily metrics (sleep, resting HR, active minutes), save summary
  console.log(`upload ${job.uploadId} (${job.filename}): ${samples.length} samples parsed`, skipped);
}
