export type StockBottleType = '500ml' | '1.5L' | '5L' | '19L' | '19L Refill';

export type MetricType =
  | 'Today Stock'
  | 'Overall Stock'
  | 'Total Cost'
  | 'Profit Today'
  | 'Monthly Profit'
  | 'Selling Price Today';

export type BottleWiseMetric = Record<StockBottleType, number>;

export interface StockMetrics {
  todayStock: BottleWiseMetric;
  overallStock: BottleWiseMetric;
  costs: BottleWiseMetric;
  profitToday: BottleWiseMetric;
  sellingPriceToday: BottleWiseMetric;
  monthlyProfitHistory?: number[];
}

export interface Customer {
  id: number;
  companyName: string;
  attentionPoc: string;
  phone: string;
  mailingAddress: string;
  city: string;
  email: string;
}

export interface ShippingAddress {
  id: number;
  warehouseName: string;
  attentionTo: string;
  phone: string;
  deliveryAddress: string;
}
