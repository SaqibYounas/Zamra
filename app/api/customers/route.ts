import { forwardGet } from '../_lib/backendClient';

/**
 * Saved customer billing profiles.
 *
 * `GET` -> backend `/customers`
 *
 * Read-only: customers are created by the backend as a side effect of invoice
 * submission, not through this app.
 */
export async function GET() {
  return forwardGet('/customers', 'Fetch customers');
}
