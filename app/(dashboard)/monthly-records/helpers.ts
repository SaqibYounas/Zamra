import type { DayRecord, Totals } from './types';

export function getTotals(monthlyData: DayRecord[]): Totals {
  return monthlyData.reduce(
    (acc, day) => {
      day.bottles.forEach((bottle) => {
        acc.stock += bottle.stock;
        acc.cost += bottle.cost;
        acc.profit += bottle.profit;
      });
      return acc;
    },
    { stock: 0, cost: 0, profit: 0 }
  );
}

export function buildExportRows(monthlyData: DayRecord[]) {
  return monthlyData.flatMap((day) =>
    day.bottles.map((bottle) => ({
      Day: day.day,
      Bottle: bottle.name,
      Stock: bottle.stock,
      Price: `Rs${bottle.price}`,
      Production: bottle.production,
      Cost: `Rs${bottle.cost}`,
      Profit: `Rs${bottle.profit}`,
    }))
  );
}
