import { forwardGet } from '../_lib/backendClient';

/**
 * Revenue, cost and profit for the current month, plus the day-by-day history
 * the dashboard charts.
 *
 * `GET` -> backend `/profit/monthly`
 */
export async function GET() {
  return forwardGet('/profit/monthly', 'Fetch monthly profit');
}
