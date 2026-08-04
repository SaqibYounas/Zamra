import { BACKEND_API } from '../url';
import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface InvoiceItem {
  itemCode: string;
  description: string;
  bottleType?: string;
  qty: number;
  rate: number;
  sortOrder: number;
}

interface Customer {
  companyName: string;
  attentionPoc: string;
  mailingAddress: string;
  city: string;
  email: string;
  phone: string;
}

interface ShippingAddress {
  warehouseName: string;
  attentionTo: string;
  phone: string;
  deliveryAddress: string;
}

interface CreateInvoiceRequestBody {
  invoiceNo: string;

  customerId?: number;
  customer?: Customer;

  shippingAddressId?: number;
  shippingAddress?: ShippingAddress;

  poNo: string;
  shipVia: string;
  rep: string;
  fob: string;
  terms: string;
  dispatchDate: string;

  taxRate: number;
  shippingCharges: number;
  miscCharges: number;
  previousDueArrears: number;
  amountPaid: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  balanceDue: number;

  items: InvoiceItem[];
}

interface BackendErrorResponse {
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateInvoiceRequestBody;

    const payload = {
      ...body,
      items: body.items?.map((item) => ({
        itemCode: item.itemCode,
        description: item.description,
        bottleType: item.bottleType,
        qty: item.qty,
        rate: item.rate,
        sortOrder: item.sortOrder,
      })),
    };

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await axios.post(
      `${BACKEND_API}/invoice/create`,
      payload,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;

    console.error(
      'Invoice Error:',
      axiosError.response?.data || axiosError.message
    );

    return NextResponse.json(
      {
        success: false,
        error: axiosError.response?.data?.message || 'Something went wrong',
      },
      {
        status: axiosError.response?.status || 500,
      }
    );
  }
}
