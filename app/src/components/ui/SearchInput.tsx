'use client';

import { useId } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search box for filtering a list in place.
 *
 * The label is visually hidden because the magnifier icon carries the meaning,
 * but it stays in the accessibility tree.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible name; falls back to the placeholder. */
  label?: string;
  className?: string;
}) {
  const id = useId();

  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label ?? placeholder}
      </label>

      <div className="field-shell h-9 min-h-0">
        <Search className="size-4 shrink-0 text-ink-faint" aria-hidden />

        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="field-input py-0 text-[0.8125rem]"
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink-soft"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
