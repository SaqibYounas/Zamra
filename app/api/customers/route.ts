import { forwardGet } from '../_lib/backendClient';

export async function GET() {
  return forwardGet('/customers', 'Fetch customers');
}
