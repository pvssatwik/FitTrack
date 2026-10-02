import { describe, expect, it } from 'vitest';
import { ultrahumanAdapter } from '../src';

const now = Math.floor(Date.now() / 1000) - 3600;

describe('ultrahumanAdapter', () => {
  it('maps known types and drops junk', () => {
    const csv = [
      'timestamp_epoch,data_type,value',
      `${now},raw_hr,72`,
      `${now},steps,12`,
      `${now},respiratory_rate,240`,
      `${now},spo2,0`,
      `${now},raw_hr,999`,
      `${now + 99999999},raw_hr,70`,
    ].join('\n');
    const r = ultrahumanAdapter.parse(csv);
    expect(r.samples.map((s) => s.metric)).toEqual(['heart_rate', 'steps']);
    expect(r.skipped).toMatchObject({
      'unusable_type:respiratory_rate': 1,
      'unusable_type:spo2': 1,
      out_of_range: 1,
      bad_timestamp: 1,
    });
  });
  it('rejects wrong header', () => {
    expect(() => ultrahumanAdapter.parse('a,b,c\n1,2,3')).toThrow();
  });
});
