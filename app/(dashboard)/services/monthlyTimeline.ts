import axios from 'axios';
import {
  BOTTLE_TYPES,
  type BottleDayMetrics,
  type BottleType,
  type TimelineDay,
} from '../types/timeline';

export const TIMELINE_IS_PLACEHOLDER = false;

// Backend item structure interface
interface ProfitDetailRow {
  date: string | Date;
  soldQty?: number | string;
  sold?: number | string;
  revenue?: number | string;
  cost?: number | string;
  profit?: number | string;
}

interface ProfitApiResponse {
  totalRevenue?: number;
  totalCost?: number;
  totalProfit?: number;
  monthlyProfitHistory?: number[];
  details?: ProfitDetailRow[];
}

export async function fetchMonthlyTimeline(
  year: number,
  month: number
): Promise<TimelineDay[]> {
  try {
    const response = await axios.get<ProfitApiResponse>('/api/monthly-profit', {
      params: { year, month },
    });

    const payload = response.data;
    const details = Array.isArray(payload?.details) ? payload.details : [];

    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(Date.UTC(year, month - 1, day))
        .toISOString()
        .slice(0, 10);

      const matching = details.find((d: ProfitDetailRow) =>
        String(d.date).startsWith(date)
      );

      // Distribute numeric totals evenly across bottle types
      const totalSold = Number(matching?.soldQty ?? matching?.sold ?? 0) || 0;
      const totalCost = Number(matching?.cost ?? 0) || 0;
      const totalProfit = Number(matching?.profit ?? 0) || 0;
      const avgPrice =
        totalSold > 0
          ? Math.round((Number(matching?.revenue ?? 0) || 0) / totalSold)
          : 0;

      const bottles = {} as Record<BottleType, BottleDayMetrics>;

      const perSize = (n: number) => Math.floor(n / BOTTLE_TYPES.length);
      const remainder = (n: number) => n - perSize(n) * BOTTLE_TYPES.length;

      const soldBase = perSize(totalSold);
      const costBase = perSize(totalCost);
      const profitBase = perSize(totalProfit);

      BOTTLE_TYPES.forEach((bottleType, idx) => {
        const extraSold = idx < remainder(totalSold) ? 1 : 0;
        const extraCost = idx < remainder(totalCost) ? 1 : 0;
        const extraProfit = idx < remainder(totalProfit) ? 1 : 0;

        bottles[bottleType] = {
          stock: 0,
          price: avgPrice,
          sold: soldBase + extraSold,
          cost: costBase + extraCost,
          profit: profitBase + extraProfit,
        };
      });

      return { day, date, bottles };
    });
  } catch (error) {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(Date.UTC(year, month - 1, day))
        .toISOString()
        .slice(0, 10);
      const bottles = {} as Record<BottleType, BottleDayMetrics>;

      BOTTLE_TYPES.forEach((bottleType) => {
        bottles[bottleType] = {
          stock: 0,
          price: 0,
          sold: 0,
          cost: 0,
          profit: 0,
        };
      });

      return { day, date, bottles };
    });
  }
}
