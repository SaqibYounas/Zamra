'use client';

import React from 'react';
import { InvoiceData } from '../../types/invoice';
import { formatDate, formatMoneyExact, toNumber } from '@/app/src/lib/format';

interface InvoiceTemplateProps {
  invoiceData: InvoiceData;
  logisticFields: { key: string; label: string }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  balanceDue: number;
  /**
   * DOM id for the PDF export to find. Omit it for the on-screen preview: two
   * elements sharing an id would make `getElementById` pick the wrong one.
   */
  domId?: string;
}

/**
 * Print template for the PDF export. Inline hex, not utilities: html2canvas
 * rasterises this off-screen, and the document stays on white paper either way.
 */
const C = {
  marine: '#0e1c2b',
  brand: '#0084c9',
  ink: '#0e1c2b',
  inkSoft: '#33475d',
  inkMuted: '#64798f',
  line: '#e3eaf3',
  panel: '#f4f7fb',
  white: '#ffffff',
  danger: '#a3202b',
  success: '#0a6b45',
};

const Field: React.FC<{
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}> = ({ label, value, strong }) => (
  <div className="flex gap-2" style={{ fontSize: 10.5, lineHeight: 1.5 }}>
    <span
      className="w-20 shrink-0"
      style={{ color: C.inkMuted, fontWeight: 500 }}
    >
      {label}
    </span>
    <span
      className="min-w-0 flex-1 break-words"
      style={{
        color: strong ? C.ink : C.inkSoft,
        fontWeight: strong ? 700 : 500,
      }}
    >
      {value || '—'}
    </span>
  </div>
);

const PartyBlock: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div
    className="rounded-lg p-4"
    style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}
  >
    <p
      className="mb-2"
      style={{
        fontSize: 9,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        color: C.brand,
        fontWeight: 700,
      }}
    >
      {title}
    </p>
    <div className="space-y-1">{children}</div>
  </div>
);

const TotalRow: React.FC<{
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}> = ({ label, value, color, bold }) => (
  <div
    className="flex items-baseline justify-between gap-3 py-1"
    style={{ borderBottom: `1px solid ${C.line}`, fontSize: 10.5 }}
  >
    <span style={{ color: C.inkMuted, fontWeight: 500 }}>{label}</span>
    <span
      style={{
        color: color ?? C.ink,
        fontWeight: bold ? 700 : 600,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </span>
  </div>
);

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoiceData,
  logisticFields,
  subtotal,
  taxAmount,
  totalAmount,
  balanceDue,
  domId,
}) => {
  const { companyInfo, meta, billTo, shipTo, logisticInfo, items } =
    invoiceData;

  return (
    <div
      id={domId}
      className="flex select-none flex-col"
      style={{
        width: 800,
        height: 1120,
        backgroundColor: C.white,
        color: C.ink,
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      {/* Header band */}
      <div
        className="flex items-start justify-between gap-6 px-12 py-8"
        style={{ backgroundColor: C.marine, color: C.white }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block"
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: C.brand,
              }}
            />
            <span
              style={{
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#9fbcd6',
                fontWeight: 700,
              }}
            >
              Zamra Water
            </span>
          </div>

          <h1
            className="mt-2"
            style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}
          >
            {companyInfo.name}
          </h1>

          <p style={{ fontSize: 10.5, color: '#9fbcd6', marginTop: 4 }}>
            {companyInfo.address} · {companyInfo.city}
          </p>
          <p style={{ fontSize: 10.5, color: '#9fbcd6' }}>
            {companyInfo.phone} · {companyInfo.email}
          </p>
        </div>

        <div className="text-right">
          <p
            style={{
              fontSize: 9,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: '#9fbcd6',
              fontWeight: 700,
            }}
          >
            Invoice
          </p>
          <p style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
            {meta.invoiceNo || '—'}
          </p>
          <p style={{ fontSize: 10.5, color: '#9fbcd6', marginTop: 6 }}>
            Issued {formatDate(meta.date)}
          </p>
          <p style={{ fontSize: 10.5, color: '#9fbcd6' }}>
            Manager: {companyInfo.poc}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-12 py-8">
        {/* Parties */}
        <div className="grid grid-cols-2 gap-6">
          <PartyBlock title="Bill to">
            <Field label="Name" value={billTo.name} strong />
            <Field label="Attention" value={billTo.attn} />
            <Field label="Address" value={billTo.address} />
            <Field label="City" value={billTo.city} />
            <Field label="Phone" value={billTo.phone} />
            <Field label="Email" value={billTo.email} />
          </PartyBlock>

          <PartyBlock title="Ship to">
            <Field label="Name" value={shipTo.name} strong />
            <Field label="Attention" value={shipTo.attn} />
            <Field label="Address" value={shipTo.address} />
            <Field label="City" value={shipTo.city} />
            <Field label="Phone" value={shipTo.phone} />
          </PartyBlock>
        </div>

        {/* Logistics strip */}
        <div
          className="mt-6 grid grid-cols-6 rounded-lg"
          style={{ border: `1px solid ${C.line}` }}
        >
          {(
            [
              ...logisticFields.map((field) => ({
                label: field.label,
                value: String(
                  logisticInfo[field.key as keyof typeof logisticInfo] ?? ''
                ),
              })),
              {
                label: 'Dispatch date',
                value: formatDate(logisticInfo.shipDate),
              },
            ] satisfies { label: string; value: string }[]
          ).map((cell, index) => (
            <div
              key={cell.label}
              className="px-3 py-2.5"
              style={{
                borderLeft: index === 0 ? 'none' : `1px solid ${C.line}`,
              }}
            >
              <p
                style={{
                  fontSize: 8,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  color: C.inkMuted,
                  fontWeight: 700,
                }}
              >
                {cell.label}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: C.ink,
                  fontWeight: 600,
                  marginTop: 3,
                }}
              >
                {cell.value || '—'}
              </p>
            </div>
          ))}
        </div>

        {/* Items */}
        <table
          className="mt-6 w-full"
          style={{ borderCollapse: 'collapse', fontSize: 10.5 }}
        >
          <thead>
            <tr style={{ backgroundColor: C.marine, color: C.white }}>
              {[
                { label: 'Code', align: 'left' as const, width: 56 },
                { label: 'Description', align: 'left' as const },
                { label: 'Size', align: 'left' as const, width: 80 },
                { label: 'Qty', align: 'right' as const, width: 56 },
                { label: 'Rate', align: 'right' as const, width: 96 },
                { label: 'Amount', align: 'right' as const, width: 110 },
              ].map((column) => (
                <th
                  key={column.label}
                  style={{
                    width: column.width,
                    textAlign: column.align,
                    padding: '8px 10px',
                    fontSize: 8.5,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 1 ? C.panel : C.white,
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <td style={{ padding: '7px 10px', color: C.inkMuted }}>
                  {item.no}
                </td>
                <td
                  style={{ padding: '7px 10px', color: C.ink, fontWeight: 600 }}
                >
                  {item.description || '—'}
                </td>
                <td style={{ padding: '7px 10px', color: C.inkSoft }}>
                  {item.bottleType || '—'}
                </td>
                <td
                  style={{
                    padding: '7px 10px',
                    textAlign: 'right',
                    color: C.inkSoft,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {toNumber(item.qty)}
                </td>
                <td
                  style={{
                    padding: '7px 10px',
                    textAlign: 'right',
                    color: C.inkSoft,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatMoneyExact(item.unitPrice)}
                </td>
                <td
                  style={{
                    padding: '7px 10px',
                    textAlign: 'right',
                    color: C.ink,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatMoneyExact(
                    toNumber(item.qty) * toNumber(item.unitPrice)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div style={{ width: 300 }}>
            <TotalRow label="Subtotal" value={formatMoneyExact(subtotal)} />
            <TotalRow
              label={`Tax (${invoiceData.taxRate || 0}%)`}
              value={formatMoneyExact(taxAmount)}
            />
            <TotalRow
              label="Shipping"
              value={formatMoneyExact(invoiceData.shipping)}
            />
            <TotalRow
              label="Misc charges"
              value={formatMoneyExact(invoiceData.other)}
            />
            <TotalRow
              label="Previous due"
              value={formatMoneyExact(invoiceData.previousDue)}
              color={C.danger}
            />
            <TotalRow
              label="Amount paid"
              value={formatMoneyExact(invoiceData.payment.paidAmount)}
              color={C.success}
            />
            <TotalRow
              label="Invoice total"
              value={formatMoneyExact(totalAmount)}
              bold
            />

            <div
              className="mt-3 flex items-center justify-between rounded-lg px-4 py-3"
              style={{ backgroundColor: C.marine, color: C.white }}
            >
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#9fbcd6',
                }}
              >
                Balance due
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatMoneyExact(balanceDue)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer pinned to the bottom of the page */}
        <div
          className="mt-auto pt-6"
          style={{ borderTop: `1px solid ${C.line}` }}
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <p style={{ fontSize: 9, color: C.inkMuted, lineHeight: 1.6 }}>
                Payments are due per the agreed terms
                {logisticInfo.terms ? ` (${logisticInfo.terms})` : ''}. Please
                quote invoice {meta.invoiceNo || '—'} with any payment.
              </p>
              <p
                className="mt-3"
                style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: C.brand,
                  fontWeight: 700,
                }}
              >
                Thank you for your business
              </p>
            </div>

            <div className="text-right">
              <div
                style={{
                  width: 150,
                  borderTop: `1px solid ${C.inkMuted}`,
                  paddingTop: 5,
                }}
              >
                <p style={{ fontSize: 9, color: C.inkMuted }}>
                  Authorised signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
