import type { ReactNode } from 'react';

const TONES = {
  info: 'border-info/25 bg-info-soft text-info-ink',
  success: 'border-success/25 bg-success-soft text-success-ink',
  warning: 'border-warning/25 bg-warning-soft text-warning-ink',
  danger: 'border-danger/25 bg-danger-soft text-danger-ink',
} as const;

export function Alert({
  tone = 'info',
  title,
  children,
  className = '',
}: {
  tone?: keyof typeof TONES;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={`animate-fade-in rounded-field border px-3.5 py-3 text-xs leading-relaxed ${TONES[tone]} ${className}`}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? (
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      ) : null}
    </div>
  );
}
