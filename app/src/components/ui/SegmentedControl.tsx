'use client';

import type { ReactNode } from 'react';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className = '',
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`inline-flex shrink-0 items-center gap-1 rounded-field border border-line bg-surface-sunken p-1 ${className}`}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-1.5 rounded-[0.4rem] font-medium transition-all ${
              size === 'sm' ? 'px-2.5 py-1 text-2xs' : 'px-3 py-1.5 text-xs'
            } ${
              isActive
                ? 'bg-surface text-ink shadow-card'
                : 'text-ink-muted hover:text-ink-soft'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
