import type { ReactNode } from 'react';

export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-sunken text-ink-soft',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-soft text-success-ink',
  warning: 'bg-warning-soft text-warning-ink',
  danger: 'bg-danger-soft text-danger-ink',
  info: 'bg-info-soft text-info-ink',
};

const DOTS: Record<BadgeTone, string> = {
  neutral: 'bg-ink-faint',
  brand: 'bg-brand-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  icon,
  className = '',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  /** Status dot — use for live/derived states rather than static labels. */
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span className={`badge ${TONES[tone]} ${className}`}>
      {dot ? (
        <span className={`size-1.5 rounded-full ${DOTS[tone]}`} aria-hidden />
      ) : null}
      {icon}
      {children}
    </span>
  );
}
