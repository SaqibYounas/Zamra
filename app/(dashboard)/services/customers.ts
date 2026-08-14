import axios from 'axios';
import type { Customer, ShippingAddress } from '../types/customer';
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
 * Saved customer billing profiles and delivery destinations. Created by the
 * backend during invoicing; editable and removable from the dashboard.
 */

/** Editable fields of a customer profile. */
export type CustomerInput = Omit<Customer, 'id'>;

/** Editable fields of a delivery destination. */
export type ShippingAddressInput = Omit<ShippingAddress, 'id'>;

/**
 * cached: `long` (5 min) under `customers`. Only `createInvoice` changes them,
 * and it invalidates this tag.
 */
export async function fetchCustomers({
  profile = 'long' as CacheProfile,
  forceRefresh = false,
} = {}): Promise<Customer[] | ServiceError> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get('/api/customers');
        return extractList<Customer>(response.data);
      } catch (error) {
        return toServiceError(error, 'Customers could not be loaded.');
      }
    },
    {
      key: 'customers',
      tags: [CACHE_TAGS.customers],
      profile,
      forceRefresh,
    }
  );
}

/** cached: `long` (5 min) under `shipping-addresses`; see `fetchCustomers`. */
export async function fetchShippingAddresses({
  profile = 'long' as CacheProfile,
  forceRefresh = false,
} = {}): Promise<ShippingAddress[] | ServiceError> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get('/api/shipping-addresses');
        return extractList<ShippingAddress>(response.data);
      } catch (error) {
        return toServiceError(error, 'Shipping addresses could not be loaded.');
      }
    },
    {
      key: 'shipping-addresses',
      tags: [CACHE_TAGS.shippingAddresses],
      profile,
      forceRefresh,
    }
  );
}

/**
 * Edits a customer profile; toasts the outcome.
 * revalidates: `customers` — invoices read these profiles by id.
 */
export async function updateCustomer(
  id: number,
  data: CustomerInput
): Promise<MutationOutcome> {
  try {
    const response = await axios.put(`/api/customers/${id}`, data, {
      showToast: true,
    });

    revalidateTag(CACHE_TAGS.customers);

    return { success: true, ...response.data };
  } catch (error) {
    return toServiceError(error, 'The customer could not be updated.');
  }
}

/**
 * Removes a customer profile; toasts the outcome.
 * revalidates: `customers`.
 */
export async function deleteCustomer(id: number): Promise<MutationOutcome> {
  try {
    const response = await axios.delete(`/api/customers/${id}`, {
      showToast: true,
    });

    revalidateTag(CACHE_TAGS.customers);

    return { success: true, ...response.data };
  } catch (error) {
    return toServiceError(error, 'The customer could not be deleted.');
  }
}

/**
 * Edits a delivery destination; toasts the outcome.
 * revalidates: `shipping-addresses`.
 */
export async function updateShippingAddress(
  id: number,
  data: ShippingAddressInput
): Promise<MutationOutcome> {
  try {
    const response = await axios.put(`/api/shipping-addresses/${id}`, data, {
      showToast: true,
    });

    revalidateTag(CACHE_TAGS.shippingAddresses);

    return { success: true, ...response.data };
  } catch (error) {
    return toServiceError(error, 'The shipping address could not be updated.');
  }
}

/**
 * Removes a delivery destination; toasts the outcome.
 * revalidates: `shipping-addresses`.
 */
export async function deleteShippingAddress(
  id: number
): Promise<MutationOutcome> {
  try {
    const response = await axios.delete(`/api/shipping-addresses/${id}`, {
      showToast: true,
    });

    revalidateTag(CACHE_TAGS.shippingAddresses);

    return { success: true, ...response.data };
  } catch (error) {
    return toServiceError(error, 'The shipping address could not be deleted.');
  }
}
