import { badRequest, forwardGet, forwardPost } from '../_lib/backendClient';
interface DailyStockRequestBody {
  bottleType?: string;
  totalPet?: string;
  bottlePerPet?: string;
}

export async function GET() {
  return forwardGet('/daily-stock', 'Fetch daily stock');
}

export async function POST(request: Request) {
  const { bottleType, totalPet, bottlePerPet } =
    (await request.json()) as DailyStockRequestBody;

  if (!bottleType?.trim()) {
    return badRequest('A bottle type is required.');
  }

  if (!totalPet?.trim() || Number(totalPet) <= 0) {
    return badRequest('Enter a quantity greater than zero.');
  }

  return forwardPost(
    '/daily-stock/create',
    { bottleType, totalPet, bottlePerPet },
    'Create daily stock'
  );
}
