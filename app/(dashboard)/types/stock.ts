import type { BottleTypeRecord } from '../data/bottleTypes';

export interface StockMetrics {
  todayStock: BottleTypeRecord | null;
  /** Units accounted for overall, per bottle type. */
  overallStock: BottleTypeRecord;
  /** Units × cost price, per bottle type. */
  costs: BottleTypeRecord;

  profitToday: BottleTypeRecord;
  /** Active selling price per bottle type. */
  sellingPriceToday: BottleTypeRecord;
  /** Daily profit for the current month, oldest first. */
  monthlyProfitHistory?: number[];
}

/** Metrics `MetricChart` can plot; the value is also its heading. */
export type MetricType =
  | 'Today Stock'
  | 'Overall Stock'
  | 'Total Cost'
  | 'Profit Today'
  | 'Monthly Profit'
  | 'Selling Price Today';
