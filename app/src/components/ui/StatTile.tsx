import type { ReactNode } from 'react';
import { Skeleton } from './Skeleton';

export type StatTone = 'brand' | 'success' | 'danger' | 'warning' | 'neutral';

const ICON_TONES: Record<StatTone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-soft text-success-ink',
  danger: 'bg-danger-soft text-danger-ink',
  warning: 'bg-warning-soft text-warning-ink',
  neutral: 'bg-surface-sunken text-ink-soft',
};

const ACCENTS: Record<StatTone, string> = {
  brand: 'bg-brand-500',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  neutral: 'bg-line-strong',
};

export function StatTile({
  label,
  value,
  icon,
  tone = 'brand',
  footnote,
  loading = false,
  className = '',
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tone?: StatTone;
  /** Supporting context under the value — a breakdown, share or period. */
  footnote?: ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`surface-card relative overflow-hidden p-4 transition-shadow hover:shadow-raised ${className}`}
    >
      <span
        className={`absolute inset-y-0 left-0 w-0.5 ${ACCENTS[tone]}`}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
          {label}
        </p>

        {icon ? (
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-field ${ICON_TONES[tone]}`}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
      </div>

      {loading ? (
        <Skeleton className="mt-3 h-7 w-28" />
      ) : (
        <p className="tabular mt-2 text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
          {value}
        </p>
      )}

      {footnote ? (
        <div className="mt-2 flex items-center gap-1.5 text-2xs text-ink-muted">
          {loading ? <Skeleton className="h-3 w-20" /> : footnote}
        </div>
      ) : null}
    </div>
  );
}
