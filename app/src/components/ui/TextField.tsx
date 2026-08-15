'use client';

import { useId, type ChangeEvent, type JSX, type KeyboardEvent } from 'react';
import { LucideIcon } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface TextFieldProps {
  label?: string;
  customicon?: () => JSX.Element;
  icon?: LucideIcon;
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  /** Renders for dark backgrounds (login card, invoice header band). */
  dark?: boolean;
  togglePassword?: () => void;
  showPassword?: boolean;
  iconToggle?: { show: JSX.Element; hide: JSX.Element };
  name?: string;
  /** Legacy spacing hook. Prefer flex/grid gaps on the parent. */
  marginBottom?: string;
  disabled?: boolean;
  /** Helper text shown when there is no error. */
  hint?: string;
  required?: boolean;
  /** Static text pinned inside the field, e.g. `Rs` or `%`. */
  prefix?: string;
  suffix?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  readOnly?: boolean;
}

export default function TextField({
  label,
  value,
  onChange,
  onKeyDown,
  icon: Icon,
  customicon,
  type,
  placeholder,
  error,
  dark,
  togglePassword,
  showPassword,
  iconToggle,
  name,
  marginBottom = '',
  disabled = false,
  hint,
  required = false,
  prefix,
  suffix,
  inputMode,
  autoComplete,
  min,
  max,
  step,
  readOnly = false,
}: TextFieldProps) {
  const reactId = useId();
  const inputId = name ? `field-${name}` : `field-${reactId}`;
  const messageId = `${inputId}-message`;
  const hasMessage = Boolean(error || hint);

  return (
    <div className={`w-full min-w-0 ${marginBottom}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className={`field-label mb-1.5 ${dark ? 'text-marine-200' : ''}`}
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div
        className="field-shell"
        data-tone={dark ? 'dark' : undefined}
        data-invalid={error ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
      >
        {Icon || customicon ? (
          <span
            className={`flex shrink-0 items-center ${
              dark ? 'text-brand-300' : 'text-ink-faint'
            }`}
            aria-hidden
          >
            {customicon ? (
              customicon()
            ) : Icon ? (
              <Icon className="size-4" />
            ) : null}
          </span>
        ) : null}

        {prefix ? (
          <span className="shrink-0 text-xs font-semibold text-ink-muted">
            {prefix}
          </span>
        ) : null}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          inputMode={inputMode}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className="field-input"
        />

        {suffix ? (
          <span className="shrink-0 text-xs font-semibold text-ink-muted">
            {suffix}
          </span>
        ) : null}

        {togglePassword ? (
          <button
            type="button"
            onClick={togglePassword}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={`-mr-1 flex size-8 shrink-0 items-center justify-center rounded-md transition-colors ${
              dark
                ? 'text-marine-200 hover:bg-white/10 hover:text-white'
                : 'text-ink-faint hover:bg-surface-sunken hover:text-ink-soft'
            }`}
          >
            {showPassword ? iconToggle?.show : iconToggle?.hide}
          </button>
        ) : null}
      </div>

      {hasMessage ? (
        <p
          id={messageId}
          className={`mt-1.5 flex items-start gap-1 text-xs ${
            error
              ? 'font-medium text-danger'
              : dark
                ? 'text-marine-300'
                : 'text-ink-muted'
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
