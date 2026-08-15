import axios from 'axios';
import { toServiceError } from './serviceResult';
import { cachedRequest, CACHE_TAGS, type CacheProfile } from './requestCache';

export async function fetchMonthlyProfit({
  profile = 'short' as CacheProfile,
  forceRefresh = false,
} = {}): Promise<unknown> {
  return cachedRequest(
    async () => {
      try {
        const response = await axios.get('/api/monthly-profit');
        return response.data;
      } catch (error) {
        return toServiceError(error, 'The profit report could not be loaded.');
      }
    },
    { key: 'monthly-profit', tags: [CACHE_TAGS.profit], profile, forceRefresh }
  );
}
