import { badRequest, forwardPost } from '../_lib/backendClient';

interface CompanyInfoRequestBody {
  companyName?: string;
  ownerName?: string;
  city?: string;
  contact?: string;
  address?: string;
  email?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CompanyInfoRequestBody;
  const { companyName, ownerName, city, contact, address, email } = body;

  if (
    !companyName?.trim() ||
    !ownerName?.trim() ||
    !city?.trim() ||
    !contact?.trim() ||
    !address?.trim() ||
    !email?.trim()
  ) {
    return badRequest('Please complete every company field.');
  }

  return forwardPost(
    '/company/register',
    { name: companyName, owner: ownerName, city, contact, address, email },
    'Save company information'
  );
}
