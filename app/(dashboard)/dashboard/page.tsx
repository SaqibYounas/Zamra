'use client';

import { useCallback, useMemo } from 'react';
import {
  FilePlus2,
  Gauge,
  Layers,
  PackageCheck,
  Receipt,
  RefreshCw,
  Scale,
  Tag,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Badge } from '@/app/src/components/ui/Badge';
import Button from '@/app/src/components/ui/Button';
import { Card, CardBody } from '@/app/src/components/ui/Card';
import { ErrorState } from '@/app/src/components/ui/StatePlaceholders';
import { SkeletonStatTiles } from '@/app/src/components/ui/Skeleton';

import MetricChart from './components/MetricChart';
import StatCard from './components/StatCard';
import SetupAlerts from './components/SetupAlerts';
import CustomerDirectory from './components/CustomerDirectory';
import ShippingDirectory from './components/ShippingDirectory';
import ProfitReport from './components/ProfitReport';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchCustomers, fetchShippingAddresses } from '../services/customers';
import { fetchStockMetrics } from '../services/stock';
import { fetchActiveCostPrices } from '../services/costPrices';
import { fetchActiveSellingPrices } from '../services/sellingPrices';
import { buildRateSummaries } from '../utils/pricing';
import { BOTTLE_TYPES, type BottleType } from '../data/bottleTypes';

function sumBottles(metric?: Partial<Record<BottleType, number>> | null) {
  if (!metric) return 0;
  return BOTTLE_TYPES.reduce((sum, size) => sum + (metric[size] ?? 0), 0);
}

/** Jumps straight to the tasks the dashboard is usually opened to start. */
const QUICK_ACTIONS = [
  { href: '/production', label: 'Log production', icon: Gauge },
  { href: '/bill-generate', label: 'New invoice', icon: FilePlus2 },
  { href: '/price', label: 'Cost price', icon: Scale },
  { href: '/selling-price', label: 'Selling price', icon: Tag },
];

export default function DashboardPage() {
  // Five independent datasets, each owning its loading and error state, so one
  // failing read cannot blank the rest and every card can retry on its own.
  const stock = useAsyncData(fetchStockMetrics, {
    key: 'stock-metrics',
    fallbackMessage: 'Stock metrics could not be loaded.',
  });

  const customers = useAsyncData(fetchCustomers, {
    key: 'customers',
    fallbackMessage: 'Customers could not be loaded.',
  });

  const shipping = useAsyncData(fetchShippingAddresses, {
    key: 'shipping-addresses',
    fallbackMessage: 'Shipping addresses could not be loaded.',
  });

  const costs = useAsyncData(fetchActiveCostPrices, { key: 'cost-prices' });
  const rates = useAsyncData(fetchActiveSellingPrices, {
    key: 'selling-prices',
  });

  const refreshAll = useCallback(() => {
    stock.refresh();
    customers.refresh();
    shipping.refresh();
    costs.refresh();
    rates.refresh();
  }, [stock, customers, shipping, costs, rates]);

  const metrics = stock.data;

  const summaries = useMemo(
    () => buildRateSummaries(costs.data ?? [], rates.data ?? []),
    [costs.data, rates.data]
  );

  const totalProfit = (metrics?.monthlyProfitHistory ?? []).reduce(
    (sum, value) => sum + value,
    0
  );
  const totalCost = sumBottles(metrics?.costs);
  const overallStock = sumBottles(metrics?.overallStock);

  // `null` means the stock rows carry no date, so today cannot be separated
  // from the running total; the tile is omitted rather than duplicated.
  const todayStock = metrics?.todayStock ?? null;

  const refreshing =
    stock.refreshing || customers.refreshing || shipping.refreshing;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Live stock, cost and profit across every bottle size, straight from your plant records."
        actions={
          <Button
            type="button"
            variant="secondary"
            label="Refresh"
            loadingLabel="Refreshing…"
            loading={refreshing}
            onClick={refreshAll}
            icon={<RefreshCw className="size-3.5" />}
            size="sm"
          />
        }
        meta={
          !stock.loading && !stock.error ? (
            <Badge tone="success" dot>
              Data synced
            </Badge>
          ) : null
        }
      />

      {/* What needs attention, before any numbers. */}
      <SetupAlerts
        summaries={summaries}
        loading={costs.loading || rates.loading}
        unavailable={Boolean(costs.error || rates.error)}
      />

      {/* Quick actions: every task used to start with a sidebar click. */}
      <nav aria-label="Quick actions" className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="btn btn-secondary h-9 px-3 text-xs"
          >
            <Icon className="size-3.5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* KPIs */}
      {stock.loading ? (
        <SkeletonStatTiles count={4} />
      ) : stock.error ? (
        // Zeroes here would read as "no production", not "the service is down".
        <Card>
          <CardBody>
            <ErrorState
              title="Stock metrics unavailable"
              description={stock.error}
              onRetry={stock.refresh}
              retrying={stock.refreshing}
              size="block"
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {todayStock ? (
            <StatCard
              label="Produced today"
              value={sumBottles(todayStock)}
              unit=" units"
              tone="brand"
              icon={<PackageCheck className="size-4" />}
              breakdown={todayStock}
            />
          ) : null}

          <StatCard
            label="Overall stock"
            value={overallStock}
            unit=" units"
            tone="neutral"
            icon={<Layers className="size-4" />}
            breakdown={metrics?.overallStock}
          />
          <StatCard
            label="Production cost"
            value={totalCost}
            isCurrency
            tone="danger"
            icon={<Receipt className="size-4" />}
            breakdown={metrics?.costs}
          />
          <StatCard
            label="Profit to date"
            value={totalProfit}
            isCurrency
            tone={totalProfit >= 0 ? 'success' : 'danger'}
            icon={<TrendingUp className="size-4" />}
          />
        </div>
      )}

      <ProfitReport />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MetricChart
          title="Overall Stock"
          label="Stock by bottle size"
          description="Units currently accounted for per size"
          rawStockData={metrics ?? undefined}
          loading={stock.loading}
          error={stock.error}
          onRetry={stock.refresh}
        />
        <MetricChart
          title="Selling Price Today"
          label="Selling price by bottle size"
          description="Active customer rate per bottle"
          rawStockData={metrics ?? undefined}
          loading={stock.loading}
          error={stock.error}
          onRetry={stock.refresh}
        />
      </div>

      {/* Full width, not the 2-up grid the charts use: six columns plus row
          actions cannot fit half a page without clipping. */}
      <CustomerDirectory
        rows={customers.data ?? []}
        loading={customers.loading}
        error={customers.error}
        onRefresh={customers.refresh}
      />

      <ShippingDirectory
        rows={shipping.data ?? []}
        loading={shipping.loading}
        error={shipping.error}
        onRefresh={shipping.refresh}
      />
    </PageContainer>
  );
}
