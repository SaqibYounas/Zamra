import {
  BOTTLE_SIZES,
  BottleDayMetrics,
  BottleSize,
  TimelineDay,
} from './timelineTypes';

export async function fetchMonthlyTimeline(
  year: number,
  month: number
): Promise<TimelineDay[]> {
  // simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 350));

  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month - 1, day).toISOString().slice(0, 10);

    const bottles = {} as Record<BottleSize, BottleDayMetrics>;

    BOTTLE_SIZES.forEach((size) => {
      const price = 50 + Math.round(Math.random() * 200);
      const sold = 10 + Math.round(Math.random() * 190);
      const stock = 10 + Math.round(Math.random() * 190);
      const cost = sold * price;
      const profit = Math.round(cost * (0.05 + Math.random() * 0.35));

      bottles[size] = { stock, price, sold, cost, profit };
    });

    return { day, date, bottles };
  });
}
