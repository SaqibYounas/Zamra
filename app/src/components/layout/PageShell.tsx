import type { ReactNode } from 'react';

/**
 * Every page opens with this block, which keeps the information hierarchy
 * identical across routes: eyebrow -> title -> supporting line, with actions
 * pinned to the right on wide screens and stacked underneath on mobile.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Secondary context, e.g. "Updated today" pills. */
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-brand-600">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>

      {meta ? (
        <div className="flex flex-wrap items-center gap-2">{meta}</div>
      ) : null}
    </header>
  );
}

/**
 * Page shell: consistent max width, gutters and vertical rhythm for every
 * dashboard route.
 */
export function PageContainer({
  children,
  className = '',
  width = 'wide',
}: {
  children: ReactNode;
  className?: string;
  /** `narrow` for single-column forms, `wide` for data-heavy pages. */
  width?: 'narrow' | 'form' | 'wide';
}) {
  const widths = {
    narrow: 'max-w-2xl',
    form: 'max-w-4xl',
    wide: 'max-w-[86rem]',
  } as const;

  return (
    <div
      className={`mx-auto w-full ${widths[width]} space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
