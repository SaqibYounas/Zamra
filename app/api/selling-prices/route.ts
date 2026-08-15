import { badRequest, forwardGet, forwardPost } from '../_lib/backendClient';

interface SellingPriceRequestBody {
  sellingPrice?: string;
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
