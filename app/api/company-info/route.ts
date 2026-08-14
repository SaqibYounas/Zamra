import { badRequest, forwardPost } from '../_lib/backendClient';

/**
 * The plant's own business details, printed on invoices.
 *
 * `POST` -> backend `/company/register`
 *
 * The backend exposes no read endpoint, so the form always starts empty rather
 * than pre-filled.
 */

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

  // The backend uses shorter field names than this app's form.
  return forwardPost(
    '/company/register',
    { name: companyName, owner: ownerName, city, contact, address, email },
    'Save company information'
  );
}
