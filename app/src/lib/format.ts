/**
 * Centralised formatters. Every "Rs 1,234" / "12 units" / date string in the
 * UI goes through here so number and currency presentation stays identical
 * across pages, tables, charts, tooltips and PDFs.
 */

const CURRENCY_PREFIX = 'Rs';

const numberFormatter = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-PK', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Coerces API values (which arrive as strings surprisingly often) to a number. */
export function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function formatNumber(value: unknown): string {
  return numberFormatter.format(toNumber(value));
}

/** `Rs 12,400` — the default money format for tables, tiles and charts. */
export function formatMoney(value: unknown): string {
  const amount = toNumber(value);
  const sign = amount < 0 ? '-' : '';
  return `${sign}${CURRENCY_PREFIX} ${numberFormatter.format(Math.abs(amount))}`;
}

/** `Rs 12,400.00` — used where cents matter, e.g. invoice lines. */
export function formatMoneyExact(value: unknown): string {
  const amount = toNumber(value);
  const sign = amount < 0 ? '-' : '';
  return `${sign}${CURRENCY_PREFIX} ${decimalFormatter.format(Math.abs(amount))}`;
}

/** Compact axis labels: 1_200 -> "1.2k", 3_400_000 -> "3.4m". */
export function formatCompact(value: unknown): string {
  const amount = toNumber(value);
  const abs = Math.abs(amount);

  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000)
    return `${(amount / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}k`;

  return numberFormatter.format(amount);
}

export function formatPercent(value: unknown, fractionDigits = 1): string {
  return `${toNumber(value).toFixed(fractionDigits)}%`;
}

/** `5 Apr 2026` from an ISO date, resilient to unparseable input. */
export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** `5 Apr` — for dense chart axes. */
export function formatDateShort(iso: string | undefined | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function monthLabelFor(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}
