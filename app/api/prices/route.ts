import { badRequest, forwardGet, forwardPost } from '../_lib/backendClient';

interface CostPriceRequestBody {
  type?: string;
  price?: string;
  labelCap?: string;
  otherExpense?: string;
}

export async function GET() {
  return forwardGet('/price', 'Fetch cost prices');
}

export async function POST(request: Request) {
  const body = (await request.json()) as CostPriceRequestBody;
  const { type, price, labelCap, otherExpense } = body;

  if (
    !type?.trim() ||
    !price?.trim() ||
    !labelCap?.trim() ||
    !otherExpense?.trim()
  ) {
    return badRequest('Please fill in all required fields before submitting.');
  }

  if ([price, labelCap, otherExpense].some((value) => isNaN(Number(value)))) {
    return badRequest('Price values must be valid numbers.');
  }

  // Field names differ between this app's form model and the backend contract.
  return forwardPost(
    '/price/create',
    {
      bottleType: type,
      perBottlePrice: price,
      labelCapPrice: labelCap,
      otherExpenses: otherExpense,
    },
    'Create cost price'
  );
}
