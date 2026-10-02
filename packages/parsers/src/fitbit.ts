import type { VendorAdapter } from './types';

/**
 * Google Health / Fitbit Takeout adapter: NOT IMPLEMENTED ON PURPOSE.
 * Write it against a real archive's folder/file names instead of guessing the layout
 * (see docs/planning-summary.md, section 12). Expected input: .zip/.tgz with many small
 * files by data type and date, whitelisted by path after safe unpacking.
 */
export const fitbitAdapter: VendorAdapter = {
  provider: 'fitbit',
  parse() {
    throw new Error('Fitbit adapter not implemented yet');
  },
};
