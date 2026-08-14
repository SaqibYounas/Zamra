import {
  BOTTLE_TYPES,
  type BottleDayMetrics,
  type BottleType,
  type TimelineDay,
} from '../types/timeline';

/**
 * Whether the ledger is locally generated. The banner, badge, CSV and PDF all
 * read this; set it to `false` when the real endpoint lands.
 */
export const TIMELINE_IS_PLACEHOLDER = true;

/**
 * ⚠ PLACEHOLDER DATA — no per-day, per-bottle-type endpoint exists, so these
 * figures are generated locally. Swap the body for a real call, keep the type.
 */
export async function fetchMonthlyTimeline(
  year: number,
  month: number
): Promise<TimelineDay[]> {
  // Stands in for network latency so the loading states are exercised.
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Day 0 of the next month is the last day of this one.
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month - 1, day).toISOString().slice(0, 10);

    const bottles = {} as Record<BottleType, BottleDayMetrics>;

    BOTTLE_TYPES.forEach((bottleType) => {
      const price = 50 + Math.round(Math.random() * 200);
      const sold = 10 + Math.round(Math.random() * 190);
      const stock = 10 + Math.round(Math.random() * 190);
      const cost = sold * price;

      // Roughly a fifth of day/type combinations run at a loss, so the red and
      // green treatments in the table and PDF both get exercised.
      const isLossDay = Math.random() < 0.2;
      const margin = isLossDay
        ? -(0.03 + Math.random() * 0.15)
        : 0.05 + Math.random() * 0.35;

      bottles[bottleType] = {
        stock,
        price,
        sold,
        cost,
        profit: Math.round(cost * margin),
      };
    });

    return { day, date, bottles };
  });
}
