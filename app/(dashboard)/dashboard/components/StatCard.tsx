'use client';

import type { ReactNode } from 'react';
import { StatTile, type StatTone } from '@/app/src/components/ui/StatTile';
import { formatMoney, formatNumber } from '@/app/src/lib/format';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  isCurrency?: boolean;
  unit?: string;
  tone?: StatTone;
  loading?: boolean;
  /**
   * Per-bottle-size contribution to this metric. Rendered as a proportional
   * bar so the headline number also shows *where* it comes from.
   */
  breakdown?: Record<string, number>;
}

/**
 * Dashboard KPI: the shared StatTile plus an optional bottle-size breakdown.
 */
export default function StatCard({
  label,
  value,
  icon,
  isCurrency = false,
  unit = '',
  tone = 'brand',
  loading = false,
  breakdown,
}: StatCardProps) {
  const formatted = isCurrency
    ? formatMoney(value)
    : `${formatNumber(value)}${unit}`;

  const entries = Object.entries(breakdown ?? {}).filter(
    ([, amount]) => amount > 0
  );
  const total = entries.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <StatTile
      label={label}
      value={formatted}
      icon={icon}
      tone={tone}
      loading={loading}
      footnote={
        entries.length > 0 && total > 0 ? (
          <span className="w-full">
            <span className="flex h-1 w-full overflow-hidden rounded-full bg-surface-sunken">
              {entries.map(([size, amount], index) => (
                <span
                  key={size}
                  title={`${size}: ${isCurrency ? formatMoney(amount) : formatNumber(amount)}`}
                  style={{
                    width: `${(amount / total) * 100}%`,
                    backgroundColor: `var(--color-series-${(index % 6) + 1})`,
                  }}
                />
              ))}
            </span>
            <span className="mt-1.5 block truncate text-ink-faint">
              Across {entries.length} bottle{' '}
              {entries.length === 1 ? 'size' : 'sizes'}
            </span>
          </span>
        ) : undefined
      }
    />
  );
}
