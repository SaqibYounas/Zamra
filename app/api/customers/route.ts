import { forwardGet } from '../_lib/backendClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  return forwardGet(
    `/customers?page=${encodeURIComponent(page)}`,
    'Fetch customers'
  );
}
