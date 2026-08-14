import type { ReactNode } from 'react';

/**
 * Heading for a group of fields inside a longer form, e.g. "Bill to" or
 * "Logistics".
 *
 * Pair it with a `<section>` so the grouping is structural, not just visual.
 */
export function FieldsetHeading({
  title,
  description,
  icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Right-aligned control, e.g. a "load saved customer" select. */
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        {icon ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-marine-900 text-brand-200">
            {icon}
          </span>
        ) : null}

        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {description ? (
            <p className="text-xs text-ink-muted">{description}</p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
