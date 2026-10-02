import type { MetricName } from '@flb/shared';
import type { ParseResult, VendorAdapter } from './types';
import { inRange, isValidTimestamp } from './validate';

/**
 * Sample export (ring_data_*.csv): long-format raw sensor log.
 *   timestamp_epoch (UTC seconds), data_type, value
 * null = known-junk type in the sample (respiratory_rate: 1/240 placeholders, spo2: ~all 0).
 * Sleep, resting HR and active minutes must be DERIVED later from these raw signals.
 */
const TYPE_MAP: Record<string, MetricName | null> = {
  raw_hr: 'heart_rate',
  raw_hrv_2: 'hrv_raw',
  raw_motion: 'motion_raw',
  steps: 'steps',
  temp: 'skin_temp',
  respiratory_rate: null,
  spo2: null,
};

export const ULTRAHUMAN_HEADER = 'timestamp_epoch,data_type,value';

export function looksLikeUltrahuman(firstLine: string): boolean {
  return firstLine.trim().toLowerCase() === ULTRAHUMAN_HEADER;
}

export const ultrahumanAdapter: VendorAdapter = {
  provider: 'ultrahuman',
  parse(input: string): ParseResult {
    const skipped: Record<string, number> = {};
    const skip = (reason: string) => (skipped[reason] = (skipped[reason] ?? 0) + 1);
    const samples: ParseResult['samples'] = [];

    const lines = input.split(/\r?\n/);
    if (!looksLikeUltrahuman(lines[0] ?? '')) {
      throw new Error('Not an Ultrahuman raw export (unexpected header)');
    }
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const [tsRaw, type, valRaw] = line.split(',');
      const ts = Number(tsRaw);
      const value = Number(valRaw);
      if (!(type in TYPE_MAP)) { skip(`unknown_type:${type}`); continue; }
      const metric = TYPE_MAP[type];
      if (metric === null) { skip(`unusable_type:${type}`); continue; }
      if (!isValidTimestamp(ts)) { skip('bad_timestamp'); continue; }
      if (!inRange(metric, value)) { skip('out_of_range'); continue; }
      samples.push({ metric, ts, value });
    }
    return { provider: 'ultrahuman', samples, skipped };
  },
};
