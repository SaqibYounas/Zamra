import type { BottleType } from '../data/bottleTypes';

export interface CostPrice {
  id: number;
  bottleType: BottleType;
  perBottlePrice: string;
  labelCapPrice: string;
  otherExpenses: string;
  isActive?: boolean;
}

export interface SellingPriceRecord {
  sellingPrice: string | number;
  priceManagementId: number;
  priceManagement?: {
    bottleType?: string | null;
  };
}
