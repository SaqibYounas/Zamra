import type { BottleType } from '../data/bottleTypes';

/**
 * Pricing entities from the backend, shared by both pricing pages and the
 * invoice builder. Amounts arrive as strings; use `toNumber` before arithmetic.
 */

/**
 * A cost-price record from `GET /api/prices`. The three amounts sum to the total
 * cost basis for one bottle.
 */
export interface CostPrice {
  id: number;
  bottleType: BottleType;
  perBottlePrice: string;
  labelCapPrice: string;
  otherExpenses: string;
  /**
   * Whether this row is in force. Optional — the backend may omit it, so read it
   * through `findActiveCostPrice` rather than directly.
   */
  isActive?: boolean;
}

/**
 * An active customer-facing rate from `GET /api/selling-prices`, linked back to
 * the cost price it was based on.
 */
export interface SellingPriceRecord {
  sellingPrice: string | number;
  priceManagementId: number;
  priceManagement?: {
    bottleType?: string | null;
  };
}
