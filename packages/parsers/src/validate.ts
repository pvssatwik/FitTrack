import type { MetricName } from '@flb/shared';

// Plausible ranges; values outside are dropped and counted as "out_of_range".
export const RANGES: Partial<Record<MetricName, [number, number]>> = {
  heart_rate: [30, 220],
  skin_temp: [20, 45],
  steps: [0, 1000], // per-interval count
};

const MIN_TS = Date.UTC(2015, 0, 1) / 1000;

export function isValidTimestamp(ts: number, nowSec = Date.now() / 1000): boolean {
  return Number.isFinite(ts) && ts >= MIN_TS && ts <= nowSec + 300; // reject future timestamps
}

export function inRange(metric: MetricName, value: number): boolean {
  if (!Number.isFinite(value)) return false;
  const r = RANGES[metric];
  return r ? value >= r[0] && value <= r[1] : true;
}
