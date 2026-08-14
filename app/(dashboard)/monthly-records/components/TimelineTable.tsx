'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Download,
  FileSpreadsheet,
  Layers,
  Receipt,
  TrendingUp,
} from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { StatTile } from '@/app/src/components/ui/StatTile';
import { Badge } from '@/app/src/components/ui/Badge';
import { MonthPager } from '@/app/src/components/ui/MonthPager';
import { Alert } from '@/app/src/components/ui/Alert';
import {
  EmptyState,
  ErrorState,
} from '@/app/src/components/ui/StatePlaceholders';
import {
  SkeletonStatTiles,
  SkeletonTable,
} from '@/app/src/components/ui/Skeleton';
import Button from '@/app/src/components/ui/Button';
import Dropdown from '@/app/src/components/ui/Dropdown';
import { formatMoney, formatNumber, monthLabelFor } from '@/app/src/lib/format';

import { exportToCSV } from '../../utils/csvExport';
import { useAsyncData } from '../../hooks/useAsyncData';
import {
  fetchMonthlyTimeline,
  TIMELINE_IS_PLACEHOLDER,
} from '../../services/monthlyTimeline';
import {
  BOTTLE_TYPES,
  BottleType,
  CURRENCY_METRICS,
  METRIC_LABELS,
  TIMELINE_METRICS,
  TimelineDay,
  TimelineMetricKey,
  metricValue,
} from '../../types/timeline';
import { downloadTimelinePdf } from './exportTimelinePdf';

const ALL_SIZES = 'all';

const SIZE_OPTIONS = [
  { label: 'All bottle sizes', value: ALL_SIZES },
  ...BOTTLE_TYPES.map((size) => ({ label: size, value: size })),
];

function formatCell(value: number, metric: TimelineMetricKey) {
  return CURRENCY_METRICS.has(metric)
    ? formatMoney(value)
    : formatNumber(value);
}

/**
 * Month-scoped ledger, five metrics per bottle size. The size filter exists
 * because the full matrix is 25 columns wide and unreadable below desktop.
 */
export default function TimelineTable() {
  const now = useMemo(() => new Date(), []);

  const [period, setPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
  const [size, setSize] = useState<string>(ALL_SIZES);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  /**
   * Keyed on the period, so switching months reports `loading` and shows the
   * skeleton straight away, while the retry button refetches the same month.
   */
  const ledger = useAsyncData<TimelineDay[]>(
    async () => {
      try {
        return await fetchMonthlyTimeline(period.year, period.month);
      } catch {
        return {
          success: false as const,
          message: 'These records could not be loaded. Please try again.',
        };
      }
    },
    { key: `${period.year}-${period.month}` }
  );

  const days = ledger.data ?? [];
  const { loading, error } = ledger;

  const isCurrentMonth =
    period.year === now.getFullYear() && period.month === now.getMonth() + 1;

  const label = monthLabelFor(period.year, period.month);

  const goToPrevMonth = () =>
    setPeriod((current) =>
      current.month === 1
        ? { year: current.year - 1, month: 12 }
        : { year: current.year, month: current.month - 1 }
    );

  const goToNextMonth = () => {
    if (isCurrentMonth) return;

    setPeriod((current) =>
      current.month === 12
        ? { year: current.year + 1, month: 1 }
        : { year: current.year, month: current.month + 1 }
    );
  };

  /** Bottle types the table is currently showing columns for. */
  const visibleTypes: readonly BottleType[] =
    size === ALL_SIZES ? BOTTLE_TYPES : [size as BottleType];

  const totals = useMemo(() => {
    return days.reduce(
      (accumulator, day) => {
        visibleTypes.forEach((bottleSize) => {
          const metrics = day.bottles[bottleSize];
          if (!metrics) return;

          accumulator.stock += metrics.stock;
          accumulator.cost += metrics.cost;
          accumulator.profit += metrics.profit;
          accumulator.sold += metrics.sold;
        });

        return accumulator;
      },
      { stock: 0, cost: 0, profit: 0, sold: 0 }
    );
    // `visibleTypes` is derived from `size`, which is the real dependency.
  }, [days, size]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExportPdf = async () => {
    if (!days.length || exporting) return;

    setExporting(true);
    setExportError(null);

    try {
      await downloadTimelinePdf(label, days, TIMELINE_IS_PLACEHOLDER);
    } catch (pdfError) {
      console.error('PDF export failed', pdfError);
      setExportError('The PDF could not be generated. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCsv = () => {
    if (!days.length) return;

    const rows = days.flatMap((day) =>
      visibleTypes.map((bottleSize) => {
        const metrics = day.bottles[bottleSize];

        return {
          // First column so the warning is visible without scrolling.
          ...(TIMELINE_IS_PLACEHOLDER ? { Source: 'SAMPLE DATA' } : {}),
          Day: day.day,
          Date: day.date,
          Bottle: bottleSize,
          Stock: metrics?.stock ?? 0,
          Price: metrics?.price ?? 0,
          Sold: metrics?.sold ?? 0,
          Cost: metrics?.cost ?? 0,
          Profit: metrics?.profit ?? 0,
        };
      })
    );

    exportToCSV(
      `zamra-records-${label.replace(/\s+/g, '-').toLowerCase()}.csv`,
      rows
    );
  };

  return (
    <div className="space-y-4">
      {TIMELINE_IS_PLACEHOLDER ? (
        <Alert tone="warning" title="Sample figures, not your records">
          The backend has no per-day, per-bottle endpoint yet, so this ledger is
          filled with generated numbers to show the layout. Do not use them for
          decisions, and expect exports to be marked as samples.
        </Alert>
      ) : null}

      {/* Month summary */}
      {loading ? (
        <SkeletonStatTiles count={4} />
      ) : error || days.length === 0 ? null : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            label="Stock recorded"
            value={`${formatNumber(totals.stock)} units`}
            icon={<Layers className="size-4" />}
            tone="neutral"
            footnote={size === ALL_SIZES ? 'All sizes' : size}
          />
          <StatTile
            label="Bottles sold"
            value={formatNumber(totals.sold)}
            icon={<TrendingUp className="size-4" />}
            tone="brand"
            footnote={`Across ${days.length} days`}
          />
          <StatTile
            label="Cost"
            value={formatMoney(totals.cost)}
            icon={<Receipt className="size-4" />}
            tone="danger"
            footnote="Production and expenses"
          />
          <StatTile
            label="Profit"
            value={formatMoney(totals.profit)}
            icon={<TrendingUp className="size-4" />}
            tone={totals.profit >= 0 ? 'success' : 'danger'}
            footnote={totals.profit >= 0 ? 'Net gain' : 'Net loss'}
          />
        </div>
      )}

      <Card as="section">
        <CardHeader
          title="Daily ledger"
          description="Stock, price, sales, cost and profit for each day"
          icon={<CalendarDays className="size-4" />}
          metric={
            TIMELINE_IS_PLACEHOLDER ? (
              <Badge tone="warning">Sample data</Badge>
            ) : undefined
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <MonthPager
                label={label || '—'}
                onPrev={goToPrevMonth}
                onNext={goToNextMonth}
                nextDisabled={isCurrentMonth}
              />

              <Dropdown
                name="bottleSize"
                options={SIZE_OPTIONS}
                value={size}
                onChange={setSize}
                className="w-full sm:w-44"
              />

              <Button
                type="button"
                variant="secondary"
                size="sm"
                label="CSV"
                onClick={handleExportCsv}
                disabled={!days.length || loading}
                icon={<FileSpreadsheet className="size-3.5" />}
              />

              <Button
                type="button"
                size="sm"
                label="Export PDF"
                loadingLabel="Preparing…"
                loading={exporting}
                onClick={handleExportPdf}
                disabled={!days.length || loading}
                icon={<Download className="size-3.5" />}
              />
            </div>
          }
        />

        <CardBody>
          {exportError ? (
            <div className="mb-3">
              <Alert tone="danger">{exportError}</Alert>
            </div>
          ) : null}

          {loading ? (
            <SkeletonTable rows={8} columns={6} />
          ) : error ? (
            <ErrorState
              description={error}
              onRetry={ledger.refresh}
              size="block"
            />
          ) : days.length === 0 ? (
            <EmptyState
              title={`No records for ${label}`}
              description="Production and sales logged for this month will appear here."
              icon={<CalendarDays className="size-5" />}
              size="block"
            />
          ) : (
            <>
              <div className="scroll-x max-h-[60vh] overflow-y-auto rounded-card border border-line">
                <table className="data-table">
                  <thead>
                    {size === ALL_SIZES ? (
                      <>
                        <tr>
                          <th rowSpan={2} scope="col" data-sticky-col>
                            Day
                          </th>
                          {BOTTLE_TYPES.map((bottleSize) => (
                            <th
                              key={bottleSize}
                              colSpan={TIMELINE_METRICS.length}
                              scope="colgroup"
                              className="border-l border-line text-center text-ink-soft"
                            >
                              {bottleSize}
                            </th>
                          ))}
                        </tr>
                        <tr>
                          {BOTTLE_TYPES.map((bottleSize) =>
                            TIMELINE_METRICS.map((metric, index) => (
                              <th
                                key={`${bottleSize}-${metric}`}
                                scope="col"
                                data-header-row="2"
                                title={METRIC_LABELS[metric]}
                                className={`text-right ${
                                  index === 0 ? 'border-l border-line' : ''
                                }`}
                              >
                                {metric}
                              </th>
                            ))
                          )}
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <th scope="col" data-sticky-col>
                          Day
                        </th>
                        {TIMELINE_METRICS.map((metric) => (
                          <th key={metric} scope="col" className="text-right">
                            {METRIC_LABELS[metric]}
                          </th>
                        ))}
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    {days.map((day) => (
                      <tr key={day.day}>
                        <th scope="row" data-sticky-col>
                          {day.day}
                        </th>

                        {visibleTypes.map((bottleSize) =>
                          TIMELINE_METRICS.map((metric, index) => {
                            const metrics = day.bottles[bottleSize];
                            const value = metrics
                              ? metricValue(metrics, metric)
                              : 0;

                            return (
                              <td
                                key={`${day.day}-${bottleSize}-${metric}`}
                                className={`tabular whitespace-nowrap text-right ${
                                  index === 0 && size === ALL_SIZES
                                    ? 'border-l border-line'
                                    : ''
                                }`}
                              >
                                {metric === 'PRF' ? (
                                  <span
                                    className={`tabular font-semibold ${
                                      value > 0
                                        ? 'text-success-ink'
                                        : value < 0
                                          ? 'text-danger-ink'
                                          : 'text-ink-muted'
                                    }`}
                                  >
                                    {formatCell(value, metric)}
                                  </span>
                                ) : (
                                  formatCell(value, metric)
                                )}
                              </td>
                            );
                          })
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {TIMELINE_METRICS.map((metric) => (
                  <Badge key={metric} tone="neutral">
                    <span className="font-mono">{metric}</span>
                    <span className="font-normal text-ink-muted">
                      {METRIC_LABELS[metric]}
                    </span>
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
