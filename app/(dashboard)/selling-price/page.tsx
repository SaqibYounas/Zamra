'use client';

import { useCallback, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import Button from '@/app/src/components/ui/Button';

import { useAsyncData } from '../hooks/useAsyncData';
import { fetchActiveCostPrices } from '../services/costPrices';
import { fetchActiveSellingPrices } from '../services/sellingPrices';
import { buildRateSummaries } from '../utils/pricing';
import SellingPriceForm from './components/SellingPriceForm';

export default function SellingPricePage() {
  const costs = useAsyncData(fetchActiveCostPrices, {
    key: 'cost-prices',
    fallbackMessage: 'Current prices could not be loaded.',
  });

  const rates = useAsyncData(fetchActiveSellingPrices, {
    key: 'selling-prices',
    fallbackMessage: 'Current selling prices could not be loaded.',
  });
  const summaries = useMemo(
    () => buildRateSummaries(costs.data ?? [], rates.data ?? []),
    [costs.data, rates.data]
  );

  const refreshAll = useCallback(() => {
    costs.refresh();
    rates.refresh();
  }, [costs, rates]);

  return (
    <PageContainer width="form">
      <PageHeader
        eyebrow="Operations"
        title="Selling price"
        description="Set what customers pay per bottle and see the margin against production cost before you commit to it."
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            label="Refresh"
            loadingLabel="Refreshing…"
            loading={costs.refreshing || rates.refreshing}
            onClick={refreshAll}
            icon={<RefreshCw className="size-3.5" />}
          />
        }
      />

      <SellingPriceForm
        prices={costs.data ?? []}
        summaries={summaries}
        onSaved={refreshAll}
      />
    </PageContainer>
  );
}
