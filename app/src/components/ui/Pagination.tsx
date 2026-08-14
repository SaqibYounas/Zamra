'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Page numbers collapsed around the current page, so the control keeps a fixed
 * width no matter how many pages exist.
 *
 * Returns `1 … 4 5 6 … 20` style output; `'gap'` marks each elision.
 */
function buildPageWindow(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);

  if (page - 1 > 1) pages.add(page - 1);
  if (page + 1 < totalPages) pages.add(page + 1);
  if (page <= 3) pages.add(2).add(3);
  if (page >= totalPages - 2) pages.add(totalPages - 1).add(totalPages - 2);

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push('gap');
    result.push(value);
  });

  return result;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  summary,
  className = '',
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Row-count line, e.g. "Showing 1–10 of 42". */
  summary?: string;
  className?: string;
}) {
  // With a single page the controls would be inert, so only the count remains.
  if (totalPages <= 1) {
    return summary ? (
      <p className={`text-xs text-ink-muted ${className}`}>{summary}</p>
    ) : null;
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {summary ? <p className="text-xs text-ink-muted">{summary}</p> : <span />}

      <nav
        aria-label="Pagination"
        className="flex items-center gap-1 self-end sm:self-auto"
      >
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronLeft className="size-4" />
        </button>

        {buildPageWindow(page, totalPages).map((entry, index) =>
          entry === 'gap' ? (
            <span
              key={`gap-${index}`}
              className="px-1 text-xs text-ink-faint"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? 'page' : undefined}
              className={`size-8 rounded-md text-xs font-semibold transition-colors ${
                entry === page
                  ? 'bg-brand-600 text-brand-fg'
                  : 'text-ink-muted hover:bg-surface-sunken hover:text-ink'
              }`}
            >
              {entry}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className="flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}
