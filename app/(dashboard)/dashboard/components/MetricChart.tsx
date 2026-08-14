'use client';

import { JSX, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { Banknote, Layers, Receipt, TrendingUp } from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import {
  EmptyState,
  ErrorState,
} from '@/app/src/components/ui/StatePlaceholders';
import { SkeletonChart } from '@/app/src/components/ui/Skeleton';
import {
  getChartChrome,
  METRIC_COLORS,
  seriesColor,
} from '@/app/src/lib/chartTheme';
import { useTheme } from '@/app/src/lib/useTheme';
import { formatCompact, formatMoney, formatNumber } from '@/app/src/lib/format';

import type { MetricType, StockMetrics } from '../../types/stock';
import { BOTTLE_TYPES } from '../../data/bottleTypes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DAYS = Array.from({ length: 30 }, (_, index) => `${index + 1}`);

const METRIC_CONFIG: Record<
  MetricType,
  { color: string; icon: JSX.Element; isCurrency: boolean }
> = {
  'Today Stock': {
    color: METRIC_COLORS.stock,
    icon: <Layers className="size-4" />,
    isCurrency: false,
  },
  'Overall Stock': {
    color: METRIC_COLORS.stock,
    icon: <Layers className="size-4" />,
    isCurrency: false,
  },
  'Total Cost': {
    color: METRIC_COLORS.cost,
    icon: <Receipt className="size-4" />,
    isCurrency: true,
  },
  'Profit Today': {
    color: METRIC_COLORS.profit,
    icon: <TrendingUp className="size-4" />,
    isCurrency: true,
  },
  'Monthly Profit': {
    color: METRIC_COLORS.profit,
    icon: <TrendingUp className="size-4" />,
    isCurrency: true,
  },
  'Selling Price Today': {
    color: METRIC_COLORS.price,
    icon: <Banknote className="size-4" />,
    isCurrency: true,
  },
};

interface MetricChartProps {
  title: MetricType;
  rawStockData?: StockMetrics;
  /** Friendlier heading; the metric key stays the data selector. */
  label?: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function getChartData(title: MetricType, stock?: StockMetrics): number[] {
  if (!stock) return [];

  if (title === 'Monthly Profit') {
    return stock.monthlyProfitHistory ?? [];
  }

  const metricMap = {
    'Today Stock': stock.todayStock,
    'Overall Stock': stock.overallStock,
    'Total Cost': stock.costs,
    'Profit Today': stock.profitToday,
    'Selling Price Today': stock.sellingPriceToday,
  };

  const metric = metricMap[title as keyof typeof metricMap];

  return BOTTLE_TYPES.map((size) => metric?.[size] ?? 0);
}

/**
 * Bar chart over the `/api/stock` metrics — bottle-wise, or day-wise for Monthly
 * Profit. Owns its loading, error and empty states so the grid never collapses.
 */
export default function MetricChart({
  title,
  rawStockData,
  label,
  description,
  loading = false,
  error = null,
  onRetry,
}: MetricChartProps) {
  const config = METRIC_CONFIG[title];
  const heading = label ?? title;

  // Chart.js draws to canvas, which cannot read the CSS theme tokens, so the
  // chrome colours are resolved here instead.
  const chrome = getChartChrome(useTheme());

  const chartData = useMemo(
    () => getChartData(title, rawStockData),
    [title, rawStockData]
  );

  const isDaily = title === 'Monthly Profit';
  const total = chartData.reduce((sum, value) => sum + value, 0);
  const hasData = chartData.some((value) => value !== 0);

  const formatValue = (value: number) =>
    config.isCurrency ? formatMoney(value) : formatNumber(value);

  const data: ChartData<'bar'> = {
    labels: isDaily ? DAYS.slice(0, chartData.length) : [...BOTTLE_TYPES],
    datasets: [
      {
        label: heading,
        data: chartData,
        // Bottle-wise charts colour each bar by size to match the rest of the
        // app; the day series stays single-colour so the trend reads cleanly.
        backgroundColor: isDaily
          ? config.color
          : BOTTLE_TYPES.map((_, index) => seriesColor(index)),
        hoverBackgroundColor: isDaily ? config.color : undefined,
        borderRadius: 6,
        maxBarThickness: isDaily ? 18 : 56,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    layout: { padding: { top: 8 } },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: chrome.tooltipBackground,
        titleColor: chrome.tooltipText,
        bodyColor: chrome.tooltipText,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { size: 11, weight: 600 },
        bodyFont: { size: 12, weight: 600 },
        callbacks: {
          title: (items: TooltipItem<'bar'>[]) =>
            isDaily ? `Day ${items[0]?.label}` : String(items[0]?.label ?? ''),
          label: (item: TooltipItem<'bar'>) => formatValue(item.raw as number),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: chrome.grid },
        ticks: {
          color: chrome.tick,
          font: { size: 11 },
          padding: 6,
          maxTicksLimit: 6,
          callback: (value) => formatCompact(value as number),
        },
      },
      x: {
        border: { color: chrome.axisLine },
        grid: { display: false },
        ticks: {
          color: chrome.tick,
          font: { size: 11 },
          autoSkip: true,
          maxRotation: 0,
        },
      },
    },
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title={heading}
        description={description}
        icon={config.icon}
        metric={
          !loading && !error && hasData ? (
            <span className="tabular text-lg font-semibold text-ink">
              {formatValue(total)}
            </span>
          ) : undefined
        }
      />

      <CardBody className="flex-1">
        {loading ? (
          <SkeletonChart className="h-64" />
        ) : error ? (
          <ErrorState description={error} onRetry={onRetry} />
        ) : hasData ? (
          <div className="h-64">
            <Bar data={data} options={options} />
          </div>
        ) : (
          <EmptyState
            title="No figures recorded yet"
            description={
              isDaily
                ? 'Daily profit will appear here once sales are recorded this month.'
                : 'Save production and pricing for a bottle size to populate this chart.'
            }
            icon={config.icon}
          />
        )}
      </CardBody>
    </Card>
  );
}
