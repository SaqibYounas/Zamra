import type { ReactNode } from 'react';

/**
 * The single card surface used across the app. Server-safe (no client hooks)
 * so pages can render it without opting into a client bundle.
 */

type CardProps = {
  children: ReactNode;
  className?: string;
  /** `panel` = slightly larger radius, for full-width page sections. */
  variant?: 'card' | 'panel';
  as?: 'div' | 'section' | 'article' | 'aside';
};

export function Card({
  children,
  className = '',
  variant = 'card',
  as: Tag = 'div',
}: CardProps) {
  const base = variant === 'panel' ? 'surface-panel' : 'surface-card';

  return <Tag className={`${base} ${className}`}>{children}</Tag>;
}

type CardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Right-aligned controls: filters, buttons, month pickers. */
  actions?: ReactNode;
  /** Large right-aligned figure, e.g. a table's row count or a chart total. */
  metric?: ReactNode;
  className?: string;
};

export function CardHeader({
  title,
  description,
  icon,
  actions,
  metric,
  className = '',
}: CardHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 border-b border-line px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-field bg-brand-50 text-brand-600">
            {icon}
          </span>
        ) : null}

        <div className="min-w-0">
          <h2 className="truncate text-[0.9375rem] font-semibold text-ink">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
          ) : null}
        </div>
      </div>

      {metric || actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          {metric}
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function CardBody({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-sunken/60 px-4 py-3 sm:px-5 ${className}`}
    >
      {children}
    </div>
  );
}
