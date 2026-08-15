import { BOTTLE_TYPES, type BottleType } from '../data/bottleTypes';

/** Column order within each bottle-type group. */
export const TIMELINE_METRICS = ['STK', 'PRC', 'PRD', 'CST', 'PRF'] as const;

export type TimelineMetricKey = (typeof TIMELINE_METRICS)[number];

export const METRIC_LABELS: Record<TimelineMetricKey, string> = {
  STK: 'Stock',
  PRC: 'Price',
  PRD: 'Sold',
  CST: 'Cost',
  PRF: 'Profit',
};

/** Metrics rendered as money rather than a plain count. */
export const CURRENCY_METRICS: ReadonlySet<TimelineMetricKey> = new Set([
  'PRC',
  'CST',
  'PRF',
]);

export interface BottleDayMetrics {
  stock: number;
  price: number;
  sold: number;
  cost: number;
  profit: number;
}

export interface TimelineDay {
  /** Day of the month, 1-based. */
  day: number;
  /** ISO date, e.g. `2026-08-01`. */
  date: string;
  bottles: Record<BottleType, BottleDayMetrics>;
}

/** Reads one abbreviated metric off a day's figures. */
export function metricValue(
  metrics: BottleDayMetrics,
  key: TimelineMetricKey
): number {
  switch (key) {
    case 'STK':
      return metrics.stock;
    case 'PRC':
      return metrics.price;
    case 'PRD':
      return metrics.sold;
    case 'CST':
      return metrics.cost;
    case 'PRF':
      return metrics.profit;
  }
}

/** Re-exported so timeline modules have one import for the catalogue. */
export { BOTTLE_TYPES };
export type { BottleType };
