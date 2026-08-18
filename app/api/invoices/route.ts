import { badRequest, forwardGet, forwardPost } from '../_lib/backendClient';

const LIST_PATH = '/invoices';

export async function GET() {
  return forwardGet(LIST_PATH, 'Fetch invoices');
}

interface InvoiceLine {
  itemCode: string;
  description: string;
  bottleType?: string;
  qty: number;
  rate: number;
  sortOrder: number;
}

interface CreateInvoiceRequestBody {
  invoiceNo?: string;
  customerId?: number;
  customer?: Record<string, string>;
  shippingAddressId?: number;
  items?: InvoiceLine[];
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateInvoiceRequestBody;

  if (!body.invoiceNo?.trim()) {
    return badRequest('An invoice number is required.');
  }

  if (!body.items?.length) {
    return badRequest('An invoice needs at least one line item.');
  }

  return forwardPost('/invoice/create', body, 'Create invoice', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
