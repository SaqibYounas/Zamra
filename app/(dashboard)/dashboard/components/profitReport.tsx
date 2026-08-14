'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3,
  Coins,
  Percent,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { StatTile } from '@/app/src/components/ui/StatTile';
import { SegmentedControl } from '@/app/src/components/ui/SegmentedControl';
import {
  EmptyState,
  ErrorState,
} from '@/app/src/components/ui/StatePlaceholders';
import {
  SkeletonChart,
  SkeletonStatTiles,
} from '@/app/src/components/ui/Skeleton';
import {
  getChartChrome,
  METRIC_COLORS,
  rechartsAxis,
  rechartsGrid,
  type ChartChrome,
} from '@/app/src/lib/chartTheme';
import { useTheme } from '@/app/src/lib/useTheme';
import {
  formatCompact,
  formatMoney,
  formatPercent,
  formatDateShort,
  toNumber,
} from '@/app/src/lib/format';
import { fetchMonthlyProfit } from '../../services/monthlyProfit';
import { useAsyncData } from '../../hooks/useAsyncData';

interface DailyDetail {
  date: string;
  soldQty: string | number;
  revenue: string | number;
  cost: string | number;
  profit: string | number;
}

interface ProfitReportData {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  monthlyProfitHistory: number[];
  details: DailyDetail[];
}

type ChartView = 'trend' | 'breakdown';

/**
 * Normalises the `/api/monthly-profit` payload once, since the backend mixes
 * money as strings and numbers across its fields.
 */
function normalizeReport(payload: unknown): ProfitReportData | null {
  if (!payload || typeof payload !== 'object') return null;

  const raw = payload as Record<string, unknown>;
  if (raw.success === false) return null;

  const history = Array.isArray(raw.monthlyProfitHistory)
    ? (raw.monthlyProfitHistory as unknown[]).map(toNumber)
    : [];

  const details = Array.isArray(raw.details)
    ? (raw.details as DailyDetail[])
    : [];

  return {
    totalRevenue: toNumber(raw.totalRevenue),
    totalCost: toNumber(raw.totalCost),
    totalProfit: toNumber(raw.totalProfit),
    monthlyProfitHistory: history,
    details,
  };
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string | number;
  payload?: readonly {
    dataKey?: string | number;
    name?: string;
    color?: string;
    value?: number;
  }[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-field border border-line bg-surface px-3 py-2 shadow-pop">
      <p className="mb-1 text-2xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <ul className="space-y-0.5">
        {payload.map((entry) => (
          <li
            key={String(entry.dataKey)}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className="text-ink-muted">{entry.name}</span>
            <span className="tabular ml-auto font-semibold text-ink">
              {formatMoney(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Monthly profit section, driven entirely by `/api/monthly-profit`. On failure it
 * reports and offers a retry; it never substitutes generated figures.
 */
export default function ProfitReport() {
  const [view, setView] = useState<ChartView>('trend');

  // Recharts takes colours as SVG attributes, where `var()` does not resolve,
  // so the chrome is resolved from the active theme here.
  const chrome: ChartChrome = getChartChrome(useTheme());

  // Normalised inside the loader, so an unparseable response reaches the hook
  // as a failure rather than as an empty report.
  const {
    data: report,
    error,
    loading,
    refresh,
  } = useAsyncData<ProfitReportData>(
    async () => {
      const payload = await fetchMonthlyProfit();

      return (
        normalizeReport(payload) ?? {
          success: false as const,
          message:
            (payload as { message?: string })?.message ||
            'The profit report could not be loaded.',
        }
      );
    },
    {
      key: 'monthly-profit',
      fallbackMessage: 'The profit report could not be loaded.',
    }
  );

  const trendData = useMemo(
    () =>
      (report?.monthlyProfitHistory ?? []).map((profit, index) => ({
        day: `Day ${index + 1}`,
        profit,
      })),
    [report]
  );

  const dailyData = useMemo(
    () =>
      (report?.details ?? []).map((row) => ({
        date: formatDateShort(row.date) || String(row.date),
        revenue: toNumber(row.revenue),
        cost: toNumber(row.cost),
        profit: toNumber(row.profit),
      })),
    [report]
  );

  const marginPct =
    report && report.totalRevenue !== 0
      ? (report.totalProfit / report.totalRevenue) * 100
      : 0;

  const hasTrend = trendData.some((row) => row.profit !== 0);
  const hasDaily = dailyData.length > 0;
  const activeHasData = view === 'trend' ? hasTrend : hasDaily;

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonStatTiles count={4} />
        <Card>
          <CardBody>
            <SkeletonChart className="h-72" />
          </CardBody>
        </Card>
      </section>
    );
  }

  if (error || !report) {
    return (
      <Card>
        <CardHeader
          title="Monthly profit"
          description="Revenue, cost and profit for the current period"
          icon={<TrendingUp className="size-4" />}
        />
        <CardBody>
          <ErrorState
            title="Profit report unavailable"
            description={error ?? 'No profit data was returned.'}
            onRetry={refresh}
            size="block"
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Revenue"
          value={formatMoney(report.totalRevenue)}
          icon={<Coins className="size-4" />}
          tone="brand"
          footnote="Sales recorded this period"
        />
        <StatTile
          label="Cost"
          value={formatMoney(report.totalCost)}
          icon={<Receipt className="size-4" />}
          tone="danger"
          footnote="Production and expenses"
        />
        <StatTile
          label="Profit"
          value={formatMoney(report.totalProfit)}
          icon={<Wallet className="size-4" />}
          tone={report.totalProfit >= 0 ? 'success' : 'danger'}
          footnote={report.totalProfit >= 0 ? 'Net gain' : 'Net loss'}
        />
        <StatTile
          label="Margin"
          value={formatPercent(marginPct)}
          icon={<Percent className="size-4" />}
          tone={marginPct >= 0 ? 'success' : 'danger'}
          footnote="Profit as a share of revenue"
        />
      </div>

      <Card>
        <CardHeader
          title={
            view === 'trend' ? 'Daily profit trend' : 'Revenue, cost and profit'
          }
          description={
            view === 'trend'
              ? 'Profit recorded for each day of the period'
              : 'Daily revenue and cost bars with the profit line on top'
          }
          icon={
            view === 'trend' ? (
              <TrendingUp className="size-4" />
            ) : (
              <BarChart3 className="size-4" />
            )
          }
          actions={
            <SegmentedControl
              label="Chart view"
              value={view}
              onChange={setView}
              options={[
                { value: 'trend', label: 'Trend' },
                { value: 'breakdown', label: 'Breakdown' },
              ]}
            />
          }
        />

        <CardBody>
          {!activeHasData ? (
            <EmptyState
              title="No figures for this period yet"
              description="Daily revenue, cost and profit appear here as soon as sales are recorded."
              icon={<TrendingUp className="size-5" />}
            />
          ) : (
            <div className="h-72 w-full sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {view === 'trend' ? (
                  <AreaChart
                    data={trendData}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="zamraProfit"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={METRIC_COLORS.profit}
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="100%"
                          stopColor={METRIC_COLORS.profit}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...rechartsGrid(chrome)} />
                    <XAxis
                      dataKey="day"
                      {...rechartsAxis(chrome)}
                      interval="preserveStartEnd"
                      minTickGap={24}
                      tickFormatter={(value: string) =>
                        value.replace('Day ', '')
                      }
                    />
                    <YAxis
                      {...rechartsAxis(chrome)}
                      width={52}
                      tickFormatter={(value: number) => formatCompact(value)}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ stroke: METRIC_COLORS.profit, strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      name="Profit"
                      stroke={METRIC_COLORS.profit}
                      strokeWidth={2}
                      fill="url(#zamraProfit)"
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  </AreaChart>
                ) : (
                  <ComposedChart
                    data={dailyData}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid {...rechartsGrid(chrome)} />
                    <XAxis
                      dataKey="date"
                      {...rechartsAxis(chrome)}
                      interval="preserveStartEnd"
                      minTickGap={20}
                    />
                    <YAxis
                      {...rechartsAxis(chrome)}
                      width={52}
                      tickFormatter={(value: number) => formatCompact(value)}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: chrome.cursorFill }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    />
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      fill={METRIC_COLORS.revenue}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={14}
                    />
                    <Bar
                      dataKey="cost"
                      name="Cost"
                      fill={METRIC_COLORS.cost}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={14}
                      fillOpacity={0.75}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Profit"
                      stroke={METRIC_COLORS.profit}
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
