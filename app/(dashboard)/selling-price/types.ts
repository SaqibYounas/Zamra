import { StockBottleType } from '../types/types';

export interface SellingPrice {
  id: number;
  bottleType: StockBottleType;
  perBottlePrice: string;
  labelCapPrice: string;
  otherExpenses: string;
  isActive: boolean;
}
