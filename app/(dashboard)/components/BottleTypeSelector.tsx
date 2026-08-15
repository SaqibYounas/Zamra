'use client';

import type { ReactNode } from 'react';

import { BOTTLE_TYPE_OPTIONS, type BottleType } from '../data/bottleTypes';

interface BottleTypeSelectorProps {
  value: BottleType;
  onChange: (bottleType: BottleType) => void;
  /** Line under each size, e.g. the figure already saved against it. */
  caption?: (bottleType: BottleType) => ReactNode;
  legend?: string;
  name?: string;
}

export default function BottleTypeSelector({
  value,
  onChange,
  caption,
  legend = 'Bottle size',
  name = 'bottleType',
}: BottleTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="field-label mb-2">{legend}</legend>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {BOTTLE_TYPE_OPTIONS.map((bottle) => {
          const isActive = bottle.value === value;

          return (
            <label
              key={bottle.value}
              className={`flex cursor-pointer flex-col gap-1 rounded-field border p-3 transition-colors ${
                isActive
                  ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                  : 'border-line bg-surface hover:border-marine-300'
              }`}
            >
              <span className="flex items-center justify-between gap-1">
                {/* Kept for semantics and keyboard use but drawn by the span
                    below; native radios ignore `color-scheme`. */}
                <input
                  type="radio"
                  name={name}
                  value={bottle.value}
                  checked={isActive}
                  onChange={() => onChange(bottle.value)}
                  className="peer sr-only"
                />

                <span
                  className={`text-sm font-semibold ${
                    isActive ? 'text-brand-800' : 'text-ink'
                  }`}
                >
                  {bottle.label}
                </span>
                <span
                  aria-hidden
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface ${
                    isActive
                      ? 'border-brand-600 bg-brand-600'
                      : 'border-line-strong'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full bg-brand-fg transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </span>
              </span>

              {caption ? (
                <span className="text-2xs text-ink-muted">
                  {caption(bottle.value)}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
