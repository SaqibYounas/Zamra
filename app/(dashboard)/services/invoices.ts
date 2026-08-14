import axios from 'axios';
import type {
  InvoiceRecord,
  InvoiceSummary,
  InvoiceUpdateInput,
} from '../types/invoice';
import {
  extractList,
  toServiceError,
  type MutationOutcome,
  type ServiceError,
} from './serviceResult';
import {
  cachedRequest,
  CACHE_TAGS,
  revalidateTag,
  type CacheProfile,
} from './requestCache';

/**
 * Invoice submission, history and editing. Creating one also creates the
 * customer and shipping records, which is why those are read-only elsewhere.
 */

interface InvoiceLineInput {
  itemCode: string;
  description: string;
  bottleType: string;
  qty: number;
  /** Unit price charged, per bottle. */
  rate: number;
  sortOrder: number;
}

interface CustomerInput {
  companyName: string;
  attentionPoc: string;
  mailingAddress: string;
  city: string;
  email: string;
  phone: string;
}

export interface CreateInvoiceInput {
  invoiceNo: string;
  /** Set when an existing customer was selected instead of typed in. */
  customerId?: number;
  customer?: CustomerInput;
  shippingAddressId?: number;

  poNo: string;
  shipVia: string;
  rep: string;
  fob: string;
  terms: string;
  /** ISO date (`yyyy-mm-dd`). */
  dispatchDate: string;

  /** Percentage, e.g. `3.8` for 3.8%. */
  taxRate: number;
  shippingCharges: number;
  miscCharges: number;
  previousDueArrears: number;
  amountPaid: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  balanceDue: number;

  items: InvoiceLineInput[];
}

/**
 * Saves an invoice; toasts the outcome. `success` comes from the HTTP status,
 * since the backend body may omit it. revalidates: all four write-affected tags.
 */
export async function createInvoice(
  data: CreateInvoiceInput
): Promise<MutationOutcome> {
  try {
    const response = await axios.post('/api/invoices', data, {
      showToast: true,
    });

    revalidateTag(
      CACHE_TAGS.customers,
      CACHE_TAGS.shippingAddresses,
      CACHE_TAGS.profit,
      CACHE_TAGS.stock,
      CACHE_TAGS.invoices
    );

    return {
      ...response.data,
      success: response.status >= 200 && response.status < 300,
    };
  } catch (error) {
    return toServiceError(error, 'The invoice could not be saved.');
  }
}

/**
 * Saved invoices, newest first as the backend orders them.
 * cached: `short` (30s) under `invoices`; every invoice write invalidates it.
 */
export async function fetchInvoices({
  profile = 'short' as CacheProfile,
  forceRefresh = false,
} = {}): Promise<InvoiceSummary[] | ServiceError> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get('/api/invoices');
        return extractList<InvoiceSummary>(response.data);
      } catch (error) {
        return toServiceError(error, 'Invoices could not be loaded.');
      }
    },
    { key: 'invoices', tags: [CACHE_TAGS.invoices], profile, forceRefresh }
  );
}

/**
 * One saved invoice in full.
 * cached: `short` (30s) under `invoices`, keyed by id.
 */
export async function fetchInvoiceById(
  id: string,
  { profile = 'short' as CacheProfile, forceRefresh = false } = {}
): Promise<InvoiceRecord | ServiceError> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get(`/api/invoices/${id}`);
        const payload = response.data as
          | { data?: InvoiceRecord }
          | InvoiceRecord;

        // The backend may answer bare or enveloped; both are accepted.
        const record =
          payload && typeof payload === 'object' && 'data' in payload
            ? payload.data
            : (payload as InvoiceRecord);

        return (
          record ?? toServiceError(null, 'That invoice could not be found.')
        );
      } catch (error) {
        return toServiceError(error, 'That invoice could not be loaded.');
      }
    },
    {
      key: `invoice:${id}`,
      tags: [CACHE_TAGS.invoices],
      profile,
      forceRefresh,
    }
  );
}

/**
 * Edits a saved invoice; toasts the outcome. revalidates: `invoices` plus the
 * figures an invoice feeds — `profit` and `stock`.
 */
export async function updateInvoice(
  id: string,
  data: InvoiceUpdateInput
): Promise<MutationOutcome> {
  try {
    const response = await axios.put(`/api/invoices/${id}`, data, {
      showToast: true,
    });

    revalidateTag(CACHE_TAGS.invoices, CACHE_TAGS.profit, CACHE_TAGS.stock);

    return { success: true, ...response.data };
  } catch (error) {
    return toServiceError(error, 'The invoice could not be updated.');
  }
}

/**
 * Removes a saved invoice; toasts the outcome.
 * revalidates: `invoices`, `profit`, `stock` — the sale is no longer counted.
 */
export async function deleteInvoice(id: string): Promise<MutationOutcome> {
  try {
    const response = await axios.delete(`/api/invoices/${id}`, {
      showToast: true,
    });

    revalidateTag(CACHE_TAGS.invoices, CACHE_TAGS.profit, CACHE_TAGS.stock);

    return { success: true, ...response.data };
  } catch (error) {
    return toServiceError(error, 'The invoice could not be deleted.');
  }
}
