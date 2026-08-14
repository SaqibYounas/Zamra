import { badRequest, forwardGet, forwardPost } from '../_lib/backendClient';

/**
 * Selling prices — the customer-facing rate per bottle.
 *
 * `GET`  -> backend `/selling-price/active` : the active rate per bottle type
 * `POST` -> backend `/selling-price/create` : set a new rate
 */

interface SellingPriceRequestBody {
  sellingPrice?: string;
  /** Id of the cost price this rate is based on. */
  priceManagementId?: number;
}

export async function GET() {
  return forwardGet('/selling-price/active', 'Fetch selling prices');
}

export async function POST(request: Request) {
  const { sellingPrice, priceManagementId } =
    (await request.json()) as SellingPriceRequestBody;

  if (!sellingPrice?.trim()) {
    return badRequest('A selling price is required.');
  }

  if (isNaN(Number(sellingPrice))) {
    return badRequest('The selling price must be a valid number.');
  }

  if (!priceManagementId) {
    return badRequest(
      'A cost price must exist for this bottle type before a rate can be set.'
    );
  }

  return forwardPost(
    '/selling-price/create',
    { sellingPrice, priceManagementId },
    'Create selling price'
  );
}
