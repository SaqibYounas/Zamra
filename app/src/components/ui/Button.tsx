'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'marine';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode;
  loading?: boolean;
  /** Replaces the label while `loading` is true. Falls back to the label. */
  loadingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  marine: 'btn-marine',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
};

/**
 * The one button in the app. Variant carries meaning: `primary` for the single
 * main action on a view, `secondary` for alternatives, `ghost` for low-weight
 * controls, `danger` for destructive confirmations.
 */
export default function Button({
  label,
  loading = false,
  loadingLabel,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const isBlocked = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isBlocked}
      aria-busy={loading || undefined}
      className={`btn ${VARIANTS[variant]} ${SIZES[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      <span className="truncate">
        {loading ? (loadingLabel ?? label) : label}
      </span>
      {!loading && iconRight}
    </button>
  );
}

/** Square icon-only button. Requires an accessible label. */
export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: Omit<ButtonProps, 'label' | 'icon'> & {
  icon: ReactNode;
  label: string;
}) {
  const sizes: Record<ButtonSize, string> = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-11',
  };

  return (
    <button
      {...props}
      type={type}
      title={label}
      aria-label={label}
      className={`btn ${VARIANTS[variant]} ${sizes[size]} shrink-0 p-0 ${className}`}
    >
      {icon}
    </button>
  );
}
