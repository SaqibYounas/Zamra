// Shared types for the monthly stock Timeline table + its PDF export.
// Keep these in one place so the table, the API/dummy service, and the
// PDF template all agree on the same shape.

export type BottleSize = '500ml' | '1.5L' | '5L' | '19L' | '19L Refill';

export const BOTTLE_SIZES: BottleSize[] = [
  '500ml',
  '1.5L',
  '5L',
  '19L',
  '19L Refill',
];

/** Column order for each bottle-size group. */
export const TIMELINE_METRICS = ['STK', 'PRC', 'PRD', 'CST', 'PRF'] as const;
export type TimelineMetricKey = (typeof TIMELINE_METRICS)[number];

export const METRIC_LABELS: Record<TimelineMetricKey, string> = {
  STK: 'Stock',
  PRC: 'Price',
  PRD: 'Sold',
  CST: 'Cost',
  PRF: 'Profit',
};

/** Metrics that should render with an "Rs" currency prefix. */
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
  day: number;
  /** ISO date string, e.g. "2026-08-01" */
  date: string;
  bottles: Record<BottleSize, BottleDayMetrics>;
}

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

export function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
