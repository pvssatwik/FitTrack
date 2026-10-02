import type { Provider } from '@flb/shared';
import { looksLikeUltrahuman } from './ultrahuman';

/** Detect source from the first CSV line. Archive detection (zip/tgz) comes with the Fitbit adapter. */
export function detectCsvProvider(firstLine: string): Provider | null {
  return looksLikeUltrahuman(firstLine) ? 'ultrahuman' : null;
}
