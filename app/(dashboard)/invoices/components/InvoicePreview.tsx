'use client';

import type { ReactNode } from 'react';
import { Building2, MapPin, Receipt, Truck } from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { Badge } from '@/app/src/components/ui/Badge';
import { formatDate, formatMoneyExact, toNumber } from '@/app/src/lib/format';

import type { InvoiceRecord, InvoiceStatus } from '../../types/invoice';

import { STATUS_TONES } from './statusTone';

/**
 * Safely converts a customer value into something React can render.
 *
 * Backend may return:
 * - string
 * - null
 * - Customer object
 *
 * Example Customer object:
 * {
 *   id: 19,
 *   companyName: 'ABC Company',
 *   attentionPoc: 'John',
 *   email: 'john@example.com'
 * }
 */
function getCustomerName(customer: unknown): string {
  if (customer === null || customer === undefined) {
    return '—';
  }

  if (typeof customer === 'string') {
    return customer.trim() || '—';
  }

  if (typeof customer === 'number') {
    return String(customer);
  }

  if (typeof customer === 'object') {
    const value = customer as {
      id?: unknown;
      companyName?: unknown;
      attentionPoc?: unknown;
      email?: unknown;
    };

    if (typeof value.companyName === 'string' && value.companyName.trim()) {
      return value.companyName.trim();
    }

    if (typeof value.attentionPoc === 'string' && value.attentionPoc.trim()) {
      return value.attentionPoc.trim();
    }

    if (typeof value.email === 'string' && value.email.trim()) {
      return value.email.trim();
    }

    if (value.id !== undefined && value.id !== null) {
      return `Customer #${String(value.id)}`;
    }
  }

  return '—';
}

/**
 * Safely extracts customer information from either the new
 * nested customer object or existing flattened invoice fields.
 */
function getCustomerEmail(customer: unknown, fallback?: unknown): string {
  if (
    typeof customer === 'object' &&
    customer !== null &&
    'email' in customer
  ) {
    const email = (customer as { email?: unknown }).email;

    if (typeof email === 'string' && email.trim()) {
      return email.trim();
    }
  }

  if (typeof fallback === 'string' && fallback.trim()) {
    return fallback.trim();
  }

  return '—';
}

/**
 * One label/value pair.
 * Missing values render as an em dash, never blank.
 */
function Detail({ label, value }: { label: string; value?: ReactNode }) {
  const isEmpty = value === null || value === undefined || value === '';

  return (
    <div className="min-w-0">
      <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>

      <p className="mt-0.5 break-words text-sm text-ink">
        {isEmpty ? '—' : value}
      </p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-field border border-line bg-surface-sunken/50 p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        <span className="flex size-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          {icon}
        </span>

        {title}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

/**
 * Money row in totals panel.
 */
function Total({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number | undefined | null;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        strong ? 'border-t border-line pt-2.5' : ''
      }`}
    >
      <span
        className={
          strong ? 'text-sm font-semibold text-ink' : 'text-xs text-ink-muted'
        }
      >
        {label}
      </span>

      <span
        className={`tabular whitespace-nowrap ${
          strong
            ? 'text-lg font-semibold text-ink'
            : 'text-sm font-medium text-ink-soft'
        }`}
      >
        {formatMoneyExact(toNumber(value))}
      </span>
    </div>
  );
}

/**
 * Read-only rendering of a saved invoice.
 */
export default function InvoicePreview({
  invoice,
}: {
  invoice: InvoiceRecord;
}) {
  const items = invoice.items ?? [];

  /*
   * Backend now returns customer as an object.
   * Never render invoice.customer directly.
   */
  const customerName = getCustomerName(invoice.customer);

  const customerEmail = getCustomerEmail(
    invoice.customer,
    invoice.customerEmail
  );

  const lineTotal = (qty: number, rate: number) =>
    toNumber(qty) * toNumber(rate);

  const computedSubtotal = items.reduce(
    (sum, item) => sum + lineTotal(item.qty, item.rate),
    0
  );

  const subtotal = invoice.subtotal ?? computedSubtotal;

  /*
   * Make status safe for STATUS_TONES.
   */
  const status = invoice.status as InvoiceStatus | null | undefined;

  const statusTone =
    status && STATUS_TONES[status] ? STATUS_TONES[status] : 'neutral';

  return (
    <Card as="section">
      <CardHeader
        title={`Invoice ${invoice.invoiceNo || invoice.id}`}
        description={`Raised ${formatDate(invoice.date)}`}
        icon={<Receipt className="size-4" />}
        metric={
          <Badge tone={statusTone} dot>
            {status ?? 'Unknown'}
          </Badge>
        }
      />

      <CardBody className="space-y-4">
        {/* BILL TO / SHIP TO */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* BILL TO */}
          <Section title="Bill to" icon={<Building2 className="size-3.5" />}>
            <Detail label="Customer" value={customerName} />

            <Detail label="Contact" value={invoice.customerPhone} />

            <Detail label="Email" value={customerEmail} />

            <Detail label="City" value={invoice.customerCity} />

            <div className="sm:col-span-2">
              <Detail label="Address" value={invoice.customerAddress} />
            </div>
          </Section>

          {/* SHIP TO */}
          <Section title="Ship to" icon={<Truck className="size-3.5" />}>
            <Detail label="Destination" value={invoice.shipToName} />

            <Detail label="Contact" value={invoice.shipToPhone} />

            <div className="sm:col-span-2">
              <Detail label="Address" value={invoice.shipToAddress} />
            </div>
          </Section>
        </div>

        {/* LOGISTICS */}
        <Section title="Logistics" icon={<MapPin className="size-3.5" />}>
          <Detail label="PO number" value={invoice.poNo} />

          <Detail label="Ship via" value={invoice.shipVia} />

          <Detail label="Representative" value={invoice.rep} />

          <Detail label="Terms" value={invoice.terms} />

          <Detail label="FOB" value={invoice.fob} />

          <Detail
            label="Dispatch date"
            value={
              invoice.dispatchDate
                ? formatDate(invoice.dispatchDate)
                : undefined
            }
          />
        </Section>

        {/* LINE ITEMS */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Line items
          </p>

          {items.length === 0 ? (
            <p className="rounded-field border border-line bg-surface-sunken/50 px-4 py-6 text-center text-xs text-ink-muted">
              This invoice has no line items recorded.
            </p>
          ) : (
            <div className="scroll-x rounded-card border border-line">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>

                    <th scope="col">Description</th>

                    <th scope="col">Size</th>

                    <th scope="col" className="text-right">
                      Qty
                    </th>

                    <th scope="col" className="text-right">
                      Rate
                    </th>

                    <th scope="col" className="text-right">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id ?? `${item.itemCode ?? 'line'}-${index}`}>
                      <td className="whitespace-nowrap">
                        {item.itemCode || '—'}
                      </td>

                      <td>
                        <span
                          className="block max-w-[18rem] truncate"
                          title={item.description || undefined}
                        >
                          {item.description || '—'}
                        </span>
                      </td>

                      <td className="whitespace-nowrap">
                        {item.bottleType || '—'}
                      </td>

                      <td className="tabular text-right">
                        {toNumber(item.qty)}
                      </td>

                      <td className="tabular text-right">
                        {formatMoneyExact(toNumber(item.rate))}
                      </td>

                      <td className="tabular text-right font-semibold text-ink">
                        {formatMoneyExact(lineTotal(item.qty, item.rate))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TOTALS */}
        <div className="flex justify-end">
          <div className="w-full space-y-2 rounded-field border border-line bg-surface-sunken/50 p-4 sm:max-w-sm">
            <Total label="Subtotal" value={subtotal} />

            <Total
              label={invoice.taxRate ? `Tax (${invoice.taxRate}%)` : 'Tax'}
              value={invoice.taxAmount}
            />

            <Total label="Shipping" value={invoice.shippingCharges} />

            <Total label="Other charges" value={invoice.miscCharges} />

            <Total
              label="Previous arrears"
              value={invoice.previousDueArrears}
            />

            <Total label="Amount paid" value={invoice.amountPaid} />

            <Total
              label="Balance due"
              value={
                invoice.balanceDue ?? invoice.totalAmount ?? invoice.amount
              }
              strong
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
