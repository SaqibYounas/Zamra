import { forwardGet } from '../_lib/backendClient';

/**
 * Saved delivery destinations.
 *
 * `GET` -> backend `/shipping-addresses`
 *
 * Read-only, for the same reason as `/api/customers`.
 */
export async function GET() {
  return forwardGet('/shipping-addresses', 'Fetch shipping addresses');
}
