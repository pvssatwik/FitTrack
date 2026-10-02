import type { MetricSample, Provider } from '@flb/shared';

export interface ParseResult {
  provider: Provider;
  samples: MetricSample[];
  skipped: Record<string, number>; // reason -> count
}

/** A vendor adapter turns raw export content into the common sample shape. */
export interface VendorAdapter {
  provider: Provider;
  parse(input: string): ParseResult;
}
