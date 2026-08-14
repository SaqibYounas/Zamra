import axios from 'axios';
import type { BottleType } from '../data/bottleTypes';
import type { CostPrice } from '../types/prices';
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
 * Production cost per bottle. Backed by `/api/prices`, which proxies the
 * backend's price-management endpoints.
 */

export interface CostPriceInput {
  type: BottleType;
  /** Whole rupees, as typed into the form. */
  price: string;
  labelCap: string;
  otherExpense: string;
}

/**
 * Records a new cost price for one bottle type; toasts the outcome.
 * revalidates: `cost-prices`, `stock` — cost totals multiply units by price.
 */
export async function saveCostPrice(
  data: CostPriceInput
): Promise<MutationOutcome> {
  try {
    const response = await axios.post('/api/prices', data, { showToast: true });

    revalidateTag(CACHE_TAGS.costPrices, CACHE_TAGS.stock);

    return response.data;
  } catch (error) {
    return toServiceError(error, 'The cost price could not be saved.');
  }
}

/**
 * The active cost price for each bottle type.
 * cached: `medium` (2 min) under `cost-prices`; every write invalidates it.
 */
export async function fetchActiveCostPrices({
  profile = 'medium' as CacheProfile,
  forceRefresh = false,
} = {}): Promise<CostPrice[] | ServiceError> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get('/api/prices');
        return extractList<CostPrice>(response.data);
      } catch (error) {
        return toServiceError(
          error,
          'Current cost prices could not be loaded.'
        );
      }
    },
    {
      key: 'cost-prices',
      tags: [CACHE_TAGS.costPrices],
      profile,
      forceRefresh,
    }
  );
}
