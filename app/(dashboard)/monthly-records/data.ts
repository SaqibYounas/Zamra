import { bottleTypes, MONTH_NAMES } from './constants';
import type { DayRecord } from './types';

export function getDaysInMonth(monthName: string, year: number): number {
  const monthIndex = MONTH_NAMES.indexOf(monthName);
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function generateMonthlyData(
  monthName: string,
  year: number
): DayRecord[] {
  const days = getDaysInMonth(monthName, year);

  return Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    bottles: bottleTypes.map((name) => {
      const stock = Math.floor(Math.random() * 200 + 10);
      const price = Math.floor(Math.random() * 200 + 50);
      const production = Math.floor(Math.random() * 150 + 5);
      const cost = production * price;
      const profit = Math.floor(Math.random() * 500 + 100);

      return { name, stock, price, production, cost, profit };
    }),
  }));
}
