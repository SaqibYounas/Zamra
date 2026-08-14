import axios from 'axios';
import type { SellingPriceRecord } from '../types/prices';
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
 * Customer-facing rate per bottle, linked to the cost price it was based on so
 * the backend can report margin. Backed by `/api/selling-prices`.
 */

export interface SellingPriceInput {
  /** Whole rupees, as typed into the form. */
  sellingPrice: string;
  /** Id of the cost price this rate is based on. */
  priceManagementId: number;
}

/**
 * Sets the active rate for one bottle type; toasts the outcome.
 * revalidates: `selling-prices`, `stock` — metrics value units at this rate.
 */
export async function saveSellingPrice(
  data: SellingPriceInput
): Promise<MutationOutcome> {
  try {
    const response = await axios.post('/api/selling-prices', data, {
      showToast: true,
    });

    revalidateTag(CACHE_TAGS.sellingPrices, CACHE_TAGS.stock);

    return response.data;
  } catch (error) {
    return toServiceError(error, 'The selling price could not be saved.');
  }
}

/**
 * The active rate for each bottle type.
 * cached: `medium` (2 min); three dashboard callers share one request.
 */
export async function fetchActiveSellingPrices({
  profile = 'medium' as CacheProfile,
  forceRefresh = false,
} = {}): Promise<SellingPriceRecord[] | ServiceError> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get('/api/selling-prices');
        return extractList<SellingPriceRecord>(response.data);
      } catch (error) {
        return toServiceError(
          error,
          'Current selling prices could not be loaded.'
        );
      }
    },
    {
      key: 'selling-prices',
      tags: [CACHE_TAGS.sellingPrices],
      profile,
      forceRefresh,
    }
  );
}
