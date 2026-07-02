import axios, { AxiosError } from 'axios';
import { StockMetrics, StockBottleType } from '../types/types';

const STOCK_TYPES: StockBottleType[] = [
  '500ml',
  '1.5L',
  '5L',
  '19L',
  '19L Refill',
];

interface StockMangRequestBody {
  bottleType?: string;
  totalPet: string;
  perBottlePrice?: string;
}

interface StockPriceManagement {
  perBottlePrice?: number;
  labelCapPrice?: number;
  otherExpenses?: number;
}

interface StockApiItem {
  bottleType: StockBottleType;
  totalPet: number;
  bottlePerPet?: number;
  priceManagement?: StockPriceManagement;
}

interface StockApiResponse {
  status?: number;
  message?: string;
  data?: StockApiItem[];
}

interface ErrorResponse {
  error: string;
}

const initBottleRecord = (): Record<StockBottleType, number> =>
  Object.fromEntries(STOCK_TYPES.map((type) => [type, 0])) as Record<
    StockBottleType,
    number
  >;

const getActualUnitCount = (item: StockApiItem): number => {
  const totalPet = Number(item.totalPet) || 0;
  const bottlePerPet = Number(item.bottlePerPet || 1);

  if (item.bottleType === '500ml' || item.bottleType === '1.5L') {
    return totalPet * bottlePerPet;
  }

  return totalPet;
};

const getUnitCost = (item: StockApiItem): number => {
  if (item.priceManagement?.perBottlePrice != null) {
    return Number(item.priceManagement.perBottlePrice) || 0;
  }

  if (item.bottleType === '19L' && item.bottlePerPet != null) {
    return Number(item.bottlePerPet) || 0;
  }

  return 0;
};

const buildStockMetrics = (items: StockApiItem[]): StockMetrics => {
  const todayStock = initBottleRecord();
  const costs = initBottleRecord();
  const profitToday = initBottleRecord();
  const overallStock = initBottleRecord();

  for (const item of items) {
    if (!STOCK_TYPES.includes(item.bottleType)) continue;

    const count = getActualUnitCount(item);
    const unitCost = getUnitCost(item);

    todayStock[item.bottleType] += count;
    overallStock[item.bottleType] += count;
    costs[item.bottleType] += count * unitCost;
  }

  return {
    todayStock,
    costs,
    profitToday,
    overallStock,
    monthlyProfitHistory: [],
  };
};

export async function saveStock(data: StockMangRequestBody) {
  try {
    const response = await axios.post('/api/stock', {
      ...data,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}

export async function getStock() {
  try {
    const response = await axios.get<StockApiResponse>('/api/stock');
    const payload = response.data;
    const items = Array.isArray(payload?.data) ? payload.data : [];

    return buildStockMetrics(items);
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}
