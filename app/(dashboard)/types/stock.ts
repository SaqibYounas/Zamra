import type { BottleTypeRecord } from '../data/bottleTypes';

/**
 * Stock aggregates assembled by `services/stock` from three endpoints; no single
 * backend route returns this shape.
 */
export interface StockMetrics {
  /**
   * Units produced today. `null` when the backend's rows carry no date, so today
   * cannot be separated from the running total.
   */
  todayStock: BottleTypeRecord | null;
  /** Units accounted for overall, per bottle type. */
  overallStock: BottleTypeRecord;
  /** Units × cost price, per bottle type. */
  costs: BottleTypeRecord;
  /**
   * Units × today's selling price. Gross value at the current rate, not profit
   * net of cost, despite the name the dashboard and charts key off.
   */
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
