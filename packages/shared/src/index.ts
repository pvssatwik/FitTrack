export type Provider = 'ultrahuman' | 'fitbit';
export type DataSource = 'upload' | 'api'; // 'api' = verified, 'upload' = self-reported

export type MetricName =
  | 'steps'
  | 'heart_rate'
  | 'resting_hr'
  | 'sleep_minutes'
  | 'active_minutes'
  | 'workout_count'
  | 'skin_temp'
  | 'hrv_raw'      // unit/scale unverified: never ranked across devices
  | 'motion_raw';

/** One normalized reading. Every vendor adapter outputs this shape. */
export interface MetricSample {
  metric: MetricName;
  ts: number;    // UTC epoch seconds
  value: number;
}

/** Metrics both devices measure comparably, safe for cross-device boards. */
export const CROSS_DEVICE_METRICS: MetricName[] = [
  'steps',
  'sleep_minutes',
  'resting_hr',
  'active_minutes',
  'workout_count',
];

export type UploadStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface UploadSummary {
  provider: Provider;
  sampleCount: number;
  daysByMetric: Partial<Record<MetricName, number>>;
  skipped: Record<string, number>; // reason -> row count
}

/** Job payload shared by API (producer) and worker (consumer). */
export interface ProcessUploadJob {
  uploadId: string;
  filename: string;
  content: string;
}
export const PROCESS_UPLOAD_QUEUE = 'process-upload';
