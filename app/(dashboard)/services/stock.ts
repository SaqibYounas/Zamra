import axios from 'axios';
import {
  createBottleTypeRecord,
  toBottleType,
  type BottleType,
  type BottleTypeRecord,
} from '../data/bottleTypes';
import type { StockMetrics } from '../types/stock';
import {
  extractList,
  toServiceError,
  type MutationOutcome,
  type ServiceError,
} from './serviceResult';
import { cachedRequest, CACHE_TAGS, revalidateTag } from './requestCache';
import { fetchActiveSellingPrices } from './sellingPrices';
import { fetchMonthlyProfit } from './monthlyProfit';

/**
 * Daily production and the stock aggregates built from it. `fetchStockMetrics`
 * composes three endpoints; no single backend route returns that shape.
 */

/** One raw stock row as returned by `GET /api/stock`. */
interface StockRow {
  bottleType?: string | null;
  totalPet?: number | string | null;
  bottlePerPet?: number | string | null;
  totalBottles?: number | string | null;
  priceManagement?: {
    perBottlePrice?: number | string | null;
  };
  /** Recorded date; the field name varies, so `rowDate` accepts all three. */
  date?: string | null;
  stockDate?: string | null;
  createdAt?: string | null;
}

/** Local calendar day as `yyyy-mm-dd`, matching how the rows are stamped. */
function toDayKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** The row's day, or `null` when it carries no recognisable date. */
function rowDate(row: StockRow): string | null {
  const raw = row.date ?? row.stockDate ?? row.createdAt;
  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : toDayKey(parsed);
}

interface SellingPriceRow {
  sellingPrice?: number | string | null;
  priceManagement?: {
    bottleType?: string | null;
  };
}

export interface DailyStockInput {
  bottleType: BottleType;
  /** Pets, bottles or refills, depending on the bottle type. */
  totalPet: string;
  /** Bottles per pet for this type; `'1'` for individually counted sizes. */
  bottlePerPet: string;
}

/**
 * Bottles in one row. `totalBottles` wins when supplied; otherwise only 500ml
 * and 1.5L multiply by pet size, the rest count their quantity directly.
 */
function countUnits(row: StockRow): number {
  const totalBottles = Number(row.totalBottles) || 0;
  if (totalBottles > 0) return totalBottles;

  const totalPet = Number(row.totalPet) || 0;
  const bottlePerPet = Number(row.bottlePerPet) || 1;

  return row.bottleType === '500ml' || row.bottleType === '1.5L'
    ? totalPet * bottlePerPet
    : totalPet;
}

/** Active rate per bottle type, keyed for O(1) lookup while aggregating. */
function indexSellingPrices(rows: SellingPriceRow[]): BottleTypeRecord {
  const rates = createBottleTypeRecord();

  rows.forEach((row) => {
    const bottleType = toBottleType(row.priceManagement?.bottleType);
    if (bottleType) rates[bottleType] = Number(row.sellingPrice) || 0;
  });

  return rates;
}

function buildStockMetrics(
  rows: StockRow[],
  sellingPriceToday: BottleTypeRecord,
  monthlyProfitHistory: number[]
): StockMetrics {
  const overallStock = createBottleTypeRecord();
  const todayStock = createBottleTypeRecord();
  const costs = createBottleTypeRecord();
  const profitToday = createBottleTypeRecord();

  // Today's output can only be isolated if the rows say when they happened,
  // otherwise "produced today" and "overall stock" are the same number.
  const today = toDayKey(new Date());
  let datedRows = 0;

  rows.forEach((row) => {
    const bottleType = toBottleType(row.bottleType);
    if (!bottleType) return;

    const units = countUnits(row);
    const unitCost = Number(row.priceManagement?.perBottlePrice) || 0;
    const day = rowDate(row);

    if (day) {
      datedRows += 1;
      if (day === today) todayStock[bottleType] += units;
    }

    overallStock[bottleType] += units;
    costs[bottleType] += units * unitCost;
    profitToday[bottleType] += units * (sellingPriceToday[bottleType] || 0);
  });

  return {
    // No dated rows at all means the distinction cannot be made; say so with
    // `null` instead of reporting a zero or a duplicate.
    todayStock: datedRows > 0 ? todayStock : null,
    overallStock,
    costs,
    profitToday,
    sellingPriceToday,
    monthlyProfitHistory,
  };
}

/** The raw stock rows. cached: `short` (30s) under `stock`. */
async function fetchStockRows(
  forceRefresh: boolean
): Promise<StockRow[] | ServiceError> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get('/api/stock');
        return extractList<StockRow>(response.data);
      } catch (error) {
        return toServiceError(error, 'Stock metrics could not be loaded.');
      }
    },
    {
      key: 'stock-rows',
      tags: [CACHE_TAGS.stock],
      profile: 'short',
      forceRefresh,
    }
  );
}

/**
 * Dashboard metrics from three reads, each cached under its own tag rather than
 * as a whole. Secondary reads reuse the shared services, collapsing duplicates.
 */
export async function fetchStockMetrics({ forceRefresh = false } = {}): Promise<
  StockMetrics | ServiceError
> {
  const rows = await fetchStockRows(forceRefresh);

  if (!Array.isArray(rows)) return rows;

  const [rates, profit] = await Promise.all([
    fetchActiveSellingPrices({ forceRefresh }),
    fetchMonthlyProfit({ forceRefresh }),
  ]);

  const sellingPriceToday = Array.isArray(rates)
    ? indexSellingPrices(rates as SellingPriceRow[])
    : createBottleTypeRecord();

  const monthlyProfitHistory = Array.isArray(
    (profit as { monthlyProfitHistory?: unknown })?.monthlyProfitHistory
  )
    ? (profit as { monthlyProfitHistory: number[] }).monthlyProfitHistory
    : [];

  return buildStockMetrics(rows, sellingPriceToday, monthlyProfitHistory);
}

/**
 * Records today's output for one bottle type; toasts the outcome.
 * revalidates: `stock`, `profit` — output changes counts and derived sales.
 */
export async function saveDailyStock(
  data: DailyStockInput
): Promise<MutationOutcome> {
  if (!data.totalPet || Number(data.totalPet) <= 0) {
    return { success: false, message: 'Enter a quantity greater than zero.' };
  }

  try {
    const response = await axios.post('/api/stock', data, { showToast: true });

    revalidateTag(CACHE_TAGS.stock, CACHE_TAGS.profit);

    return response.data;
  } catch (error) {
    return toServiceError(error, 'Production could not be saved.');
  }
}
