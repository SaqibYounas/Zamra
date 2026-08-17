'use client';

import { Coins, Tags } from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { Badge } from '@/app/src/components/ui/Badge';
import { ErrorState } from '@/app/src/components/ui/StatePlaceholders';
import { Skeleton } from '@/app/src/components/ui/Skeleton';
import { InfoHint } from '@/app/src/components/ui/Tooltip';
import { formatMoney, formatPercent } from '@/app/src/lib/format';
import type { BottleRateSummary } from '../../utils/pricing';

interface Props {
  summaries: BottleRateSummary[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  /** Highlights the size currently selected in the form. */
  activeBottleType?: string;
}

export default function RateBoard({
  summaries,
  loading,
  error,
  onRetry,
  activeBottleType,
}: Props) {
  return (
    <Card as="section">
      <CardHeader
        title="Today's rates"
        description="Production cost against the active customer rate for each size"
        icon={<Coins className="size-4" />}
        metric={
          <span className="flex items-center gap-1.5 text-2xs text-ink-muted">
            Margin
            <InfoHint content="Selling price minus total production cost, per bottle." />
          </span>
        }
      />

      <CardBody>
        {error ? (
          <ErrorState description={error} onRetry={onRetry} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {summaries.map((summary) => {
              const isActive = summary.bottleType === activeBottleType;
              const hasMargin =
                summary.margin !== null && summary.marginPct !== null;

              return (
                <div
                  key={summary.bottleType}
                  className={`rounded-card border p-3.5 transition-colors ${
                    isActive
                      ? 'border-brand-300 bg-brand-50'
                      : 'border-line bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                      <Tags className="size-3.5 text-ink-faint" />
                      {summary.bottleType}
                    </span>

                    {loading ? (
                      <Skeleton className="h-5 w-16" />
                    ) : !hasMargin ? (
                      <Badge tone="neutral">Incomplete</Badge>
                    ) : (
                      <Badge
                        tone={
                          summary.margin! > 0
                            ? 'success'
                            : summary.margin! < 0
                              ? 'danger'
                              : 'warning'
                        }
                      >
                        {formatPercent(summary.marginPct!, 0)} margin
                      </Badge>
                    )}
                  </div>

                  <dl className="mt-3 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <dt className="text-2xs uppercase tracking-wide text-ink-muted">
                        Cost
                      </dt>
                      <dd className="tabular text-sm font-medium text-ink-soft">
                        {loading ? (
                          <Skeleton className="h-4 w-16" />
                        ) : summary.costTotal === null ? (
                          '—'
                        ) : (
                          formatMoney(summary.costTotal)
                        )}
                      </dd>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <dt className="text-2xs uppercase tracking-wide text-ink-muted">
                        Selling
                      </dt>
                      <dd className="tabular text-base font-semibold text-ink">
                        {loading ? (
                          <Skeleton className="h-5 w-20" />
                        ) : summary.sellingPrice === null ? (
                          '—'
                        ) : (
                          formatMoney(summary.sellingPrice)
                        )}
                      </dd>
                    </div>

                    {!loading && hasMargin ? (
                      <div className="flex items-baseline justify-between gap-2 border-t border-line pt-1.5">
                        <dt className="text-2xs uppercase tracking-wide text-ink-muted">
                          Per bottle
                        </dt>
                        <dd
                          className={`tabular text-sm font-semibold ${
                            summary.margin! >= 0
                              ? 'text-success-ink'
                              : 'text-danger-ink'
                          }`}
                        >
                          {formatMoney(summary.margin!)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
