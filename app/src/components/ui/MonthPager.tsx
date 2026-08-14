'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Previous / label / next stepper for month-scoped reports.
 *
 * The label is a live region so the month change is announced when navigating
 * by keyboard.
 */
export function MonthPager({
  label,
  onPrev,
  onNext,
  nextDisabled = false,
  prevDisabled = false,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 rounded-field border border-line bg-surface p-1">
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous month"
        className="flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-35"
      >
        <ChevronLeft className="size-4" />
      </button>

      <span
        aria-live="polite"
        className="min-w-[8.5rem] text-center text-xs font-semibold text-ink"
      >
        {label}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next month"
        className="flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-35"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
