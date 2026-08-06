import axios, { AxiosError } from 'axios';
import { StockBottleType } from '../types/types';

interface StockItem {
  bottleType?: string | null;
  totalPet?: number | string | null;
  bottlePerPet?: number | string | null;
  totalBottles?: number | string | null;
  priceManagement?: {
    perBottlePrice?: number | string | null;
  };
}

interface SellingPriceItem {
  sellingPrice?: number | string | null;
  priceManagement?: {
    bottleType?: string | null;
  };
}

interface ApiResponse<T> {
  data?: T;
}

interface SaveStockPayload {
  bottleType?: string;
  totalPet?: number | string;
  bottlePerPet?: number | string;
  bottleperPet?: number | string;
  totalBottles?: number | string;
}

const STOCK_TYPES: StockBottleType[] = [
  '500ml',
  '1.5L',
  '5L',
  '19L',
  '19L Refill',
];

const initBottleRecord = (): Record<StockBottleType, number> =>
  Object.fromEntries(STOCK_TYPES.map((type) => [type, 0])) as Record<
    StockBottleType,
    number
  >;

const normalizeBottleType = (value?: string | null): StockBottleType | null => {
  if (!value) return null;

  return STOCK_TYPES.includes(value as StockBottleType)
    ? (value as StockBottleType)
    : null;
};

const getActualUnitCount = (item: StockItem): number => {
  const totalBottles = Number(item.totalBottles) || 0;

  if (totalBottles > 0) {
    return totalBottles;
  }

  const totalPet = Number(item.totalPet) || 0;

  const bottlePerPet = Number(item.bottlePerPet) || 1;

  if (item.bottleType === '500ml' || item.bottleType === '1.5L') {
    return totalPet * bottlePerPet;
  }

  return totalPet;
};

const getUnitCost = (item: StockItem): number => {
  return Number(item.priceManagement?.perBottlePrice) || 0;
};

const getStockItems = (
  payload: ApiResponse<StockItem[]> | StockItem[] | unknown
): StockItem[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as ApiResponse<StockItem[]>).data;

    if (Array.isArray(data)) {
      return data;
    }
  }

  return [];
};

const getSellingPrices = (
  payload: ApiResponse<SellingPriceItem[]> | SellingPriceItem[] | unknown
): Record<StockBottleType, number> => {
  const result = initBottleRecord();

  let items: SellingPriceItem[] = [];

  if (Array.isArray(payload)) {
    items = payload;
  } else if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as ApiResponse<SellingPriceItem[]>).data;

    if (Array.isArray(data)) {
      items = data;
    }
  }

  items.forEach((item) => {
    const bottleType = normalizeBottleType(item.priceManagement?.bottleType);

    if (bottleType) {
      result[bottleType] = Number(item.sellingPrice) || 0;
    }
  });

  return result;
};

const buildStockMetrics = (
  items: StockItem[],
  sellingPriceToday: Record<StockBottleType, number>
) => {
  const todayStock = initBottleRecord();

  const costs = initBottleRecord();

  const profitToday = initBottleRecord();

  const overallStock = initBottleRecord();

  items.forEach((item) => {
    const bottleType = normalizeBottleType(item.bottleType);

    if (!bottleType) {
      return;
    }

    const count = getActualUnitCount(item);

    const unitCost = getUnitCost(item);

    todayStock[bottleType] += count;

    overallStock[bottleType] += count;

    costs[bottleType] += count * unitCost;

    profitToday[bottleType] += count * (sellingPriceToday[bottleType] || 0);
  });

  return {
    todayStock,

    costs,

    profitToday,

    overallStock,

    sellingPriceToday,

    monthlyProfitHistory: [],
  };
};

export async function getStock() {
  try {
    const stockResponse = await axios.get('/api/stock');

    let sellingPriceToday = initBottleRecord();

    try {
      const sellingResponse = await axios.get('/api/selling-price');

      sellingPriceToday = getSellingPrices(sellingResponse.data);
    } catch {
      console.log('Selling price API unavailable');
    }

    const items = getStockItems(stockResponse.data);

    return buildStockMetrics(items, sellingPriceToday);
  } catch (error) {
    const err = error as AxiosError;

    const errorData = err.response?.data as {
      error?: string;
    };

    return {
      success: false,

      message: errorData?.error || 'Server error',
    };
  }
}

export async function saveStock(data: SaveStockPayload) {
  try {
    if (!data.totalPet || Number(data.totalPet) <= 0) {
      return {
        success: false,

        message: 'Invalid stock quantity',
      };
    }

    const response = await axios.post('/api/stock', data, {
      showToast: true,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    const errorData = err.response?.data as {
      error?: string;
    };

    return {
      success: false,

      message: errorData?.error || 'Server error',
    };
  }
}
