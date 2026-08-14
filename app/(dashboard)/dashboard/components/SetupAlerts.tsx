'use client';

import Link from 'next/link';
import { ArrowRight, CircleCheck } from 'lucide-react';

import { Alert } from '@/app/src/components/ui/Alert';
import { findPricingGaps, type BottleRateSummary } from '../../utils/pricing';

/**
 * What is blocking work, at the top of the first page opened. An unpriced size
 * cannot be invoiced, and that was previously only found mid-invoice.
 */
export default function SetupAlerts({
  summaries,
  loading,
  unavailable = false,
}: {
  summaries: BottleRateSummary[];
  loading: boolean;
  /**
   * Pricing data could not be fetched — stay silent, since with no data every
   * size looks unpriced and the warning would be wrong.
   */
  unavailable?: boolean;
}) {
  // Nothing to say until the pricing data has actually arrived.
  if (loading || unavailable) return null;

  const { missingCost, missingRate, sellingBelowCost } =
    findPricingGaps(summaries);

  const allPriced =
    missingCost.length === 0 &&
    missingRate.length === 0 &&
    sellingBelowCost.length === 0;

  if (allPriced) {
    return (
      <Alert tone="success">
        <span className="flex items-center gap-1.5">
          <CircleCheck className="size-3.5 shrink-0" />
          Every bottle size has a cost price and a selling price above it.
        </span>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {missingRate.length > 0 ? (
        <Alert tone="warning" title="Cannot be invoiced yet">
          <p>
            {list(missingRate)} {verb(missingRate)} no selling price, so{' '}
            {missingRate.length === 1 ? 'it' : 'they'} cannot be added to an
            invoice.
          </p>
          <FixLink href="/selling-price" label="Set a selling price" />
        </Alert>
      ) : null}

      {missingCost.length > 0 ? (
        <Alert tone="warning" title="Missing a cost price">
          <p>
            {list(missingCost)} {verb(missingCost)} no cost price, so margin and
            profit cannot be calculated — and a selling price cannot be set
            until one exists.
          </p>
          <FixLink href="/price" label="Record a cost price" />
        </Alert>
      ) : null}

      {sellingBelowCost.length > 0 ? (
        <Alert tone="danger" title="Selling below cost">
          <p>
            {list(sellingBelowCost)}{' '}
            {sellingBelowCost.length === 1 ? 'is' : 'are'} priced under what{' '}
            {sellingBelowCost.length === 1 ? 'it costs' : 'they cost'} to
            produce, so every bottle sold loses money.
          </p>
          <FixLink href="/selling-price" label="Review selling prices" />
        </Alert>
      ) : null}
    </div>
  );
}

/** Cost and selling price live on separate pages, so each fix links to its own. */
function FixLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-1.5 inline-flex items-center gap-1 font-semibold underline decoration-current/40 underline-offset-2 hover:decoration-current"
    >
      {label}
      <ArrowRight className="size-3" />
    </Link>
  );
}

/** "500ml", "500ml and 5L", "500ml, 5L and 19L". */
function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function verb(items: string[]): string {
  return items.length === 1 ? 'has' : 'have';
}
