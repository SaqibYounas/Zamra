import { forwardGet } from '../_lib/backendClient';

export async function GET() {
  return forwardGet('/profit/monthly', 'Fetch monthly profit');
}
