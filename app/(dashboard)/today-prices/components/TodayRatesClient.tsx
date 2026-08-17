'use client';

import { useCallback, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

import Button from '@/app/src/components/ui/Button';

import { useAsyncData } from '../../hooks/useAsyncData';
import { fetchActiveCostPrices } from '../../services/costPrices';
import { fetchActiveSellingPrices } from '../../services/sellingPrices';
import { buildRateSummaries } from '../../utils/pricing';
import RateBoard from './RateBoard';

export default function TodayRatesClient() {
  const costs = useAsyncData(fetchActiveCostPrices, {
    key: 'today-cost-prices',
    fallbackMessage: 'Current cost prices could not be loaded.',
  });

  const rates = useAsyncData(fetchActiveSellingPrices, {
    key: 'today-selling-prices',
    fallbackMessage: 'Today rates could not be loaded.',
  });

  const summaries = useMemo(
    () => buildRateSummaries(costs.data ?? [], rates.data ?? []),
    [costs.data, rates.data]
  );

  const refreshRates = useCallback(() => {
    costs.refresh();
    rates.refresh();
  }, [costs, rates]);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          label="Refresh Rates"
          loadingLabel="Refreshing…"
          loading={costs.refreshing || rates.refreshing}
          onClick={refreshRates}
          icon={<RefreshCw className="size-3.5" />}
        />
      </div>

      <RateBoard
        summaries={summaries}
        loading={costs.loading || rates.loading}
        error={costs.error || rates.error}
        onRetry={refreshRates}
      />
    </>
  );
}
