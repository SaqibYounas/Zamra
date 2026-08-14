'use client';

import { Fragment, useId, type ReactNode } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { AlertCircle, Check, ChevronDown, Loader2 } from 'lucide-react';

type Option = {
  label: string;
  value: string;
  /** Optional right-aligned secondary text, e.g. a price or a city. */
  meta?: string;
};

type DropdownProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  hint?: string;
  loading?: boolean;
  required?: boolean;
  icon?: ReactNode;
  /** Message shown when `options` is empty (e.g. "No saved customers yet"). */
  emptyMessage?: string;
  name?: string;
  className?: string;
};

/**
 * Select control built on Headless UI's Listbox, so keyboard interaction
 * (type-ahead, arrows, Home/End, Escape) and ARIA wiring come for free.
 */
export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  error,
  hint,
  loading = false,
  required = false,
  icon,
  emptyMessage = 'No options available',
  name,
  className = '',
}: DropdownProps) {
  const reactId = useId();
  const fieldId = name ? `select-${name}` : `select-${reactId}`;
  const messageId = `${fieldId}-message`;
  const hasMessage = Boolean(error || hint);

  const selectedOption = options.find((option) => option.value === value);
  const isBlocked = disabled || loading;

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {label ? (
        <label htmlFor={fieldId} className="field-label mb-1.5">
          {label}
          {required ? (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <Listbox value={value} onChange={onChange} disabled={isBlocked}>
        <div className="relative">
          <ListboxButton
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            className="field-shell cursor-pointer text-left"
            data-invalid={error ? 'true' : undefined}
            data-disabled={isBlocked ? 'true' : undefined}
          >
            {icon ? (
              <span
                className="flex shrink-0 items-center text-ink-faint"
                aria-hidden
              >
                {icon}
              </span>
            ) : null}

            <span
              className={`field-input truncate ${
                selectedOption ? 'font-medium text-ink' : 'text-ink-faint'
              }`}
            >
              {loading
                ? 'Loading…'
                : (selectedOption?.label ?? placeholder ?? 'Select')}
            </span>

            {loading ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-ink-faint" />
            ) : (
              <ChevronDown
                className="size-4 shrink-0 text-ink-faint"
                aria-hidden
              />
            )}
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-50 mt-1.5 max-h-64 w-full overflow-auto rounded-field border border-line bg-surface p-1 shadow-pop focus:outline-none">
              {options.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-ink-muted">
                  {emptyMessage}
                </p>
              ) : (
                options.map((option) => (
                  <ListboxOption
                    key={option.value}
                    value={option.value}
                    className="group flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-ink-soft data-[focus]:bg-brand-50 data-[focus]:text-brand-800 data-[selected]:font-semibold"
                  >
                    {({ selected }) => (
                      <>
                        <span className="flex size-4 shrink-0 items-center justify-center text-brand-600">
                          {selected ? <Check className="size-3.5" /> : null}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {option.label}
                        </span>
                        {option.meta ? (
                          <span className="shrink-0 text-2xs text-ink-muted">
                            {option.meta}
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                ))
              )}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>

      {hasMessage ? (
        <p
          id={messageId}
          className={`mt-1.5 flex items-start gap-1 text-xs ${
            error ? 'font-medium text-danger' : 'text-ink-muted'
          }`}
        >
          {error ? (
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
          ) : null}
          <span>{error || hint}</span>
        </p>
      ) : null}
    </div>
  );
}
