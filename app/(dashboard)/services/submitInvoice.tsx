import axios, { AxiosError } from 'axios';
interface InvoiceItem {
  itemCode: string;
  description: string;
  bottleType: string;
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

interface ErrorResponse {
  error: string;
}

export async function submitInvoice(data: CreateInvoiceRequestBody) {
  try {
    const response = await axios.post('/api/invoice-create', data, {
      showToast: true,
    });
    const result = response.data;

    return {
      ...result,
      success: response.status >= 200 && response.status < 300,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}
