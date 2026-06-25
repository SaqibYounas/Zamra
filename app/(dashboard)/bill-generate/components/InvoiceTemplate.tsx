'use client';

import React from 'react';
import { InvoiceData } from '../../types/types';

interface InvoiceTemplateProps {
  invoiceData: InvoiceData;
  logisticFields: { key: string; label: string }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  balanceDue: number;
}

const InfoRow: React.FC<{
  label: string;
  value: React.ReactNode;
  labelWidth?: string;
}> = ({ label, value, labelWidth = 'w-20' }) => (
  <div className="flex items-start gap-2">
    <span className={`${labelWidth} shrink-0 font-bold text-slate-900`}>
      {label}:
    </span>
    <span className="flex-1 text-slate-600 font-medium break-words">
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
}) => {
  return (
    <div
      id="invoice-doc"
      className="w-[800px] h-[1120px] bg-white p-12 flex flex-col text-slate-800 text-xs relative select-none"
    >
      {/* BRAND/META LAYER */}
      <div className="border-b-2 border-teal-700 pb-4 mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            {invoiceData.companyInfo.name}
          </h1>
          <div className="flex gap-3 text-[11px] font-mono text-slate-500 items-center">
            <div>
              <span className="font-sans text-black font-bold">Date:</span>{' '}
              {invoiceData.meta.date}
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-full px-3 py-1 flex items-center gap-1">
              <span className="font-sans text-slate-700 font-bold">
                Invoice No:
              </span>
              <span className="text-teal-700 font-black">
                {invoiceData.meta.invoiceNo}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-[11px] pt-2 border-t border-slate-100">
          <InfoRow
            label="Manager"
            value={invoiceData.companyInfo.poc}
            labelWidth="w-16"
          />
          <InfoRow
            label="Address"
            value={invoiceData.companyInfo.address}
            labelWidth="w-16"
          />
          <InfoRow
            label="City"
            value={invoiceData.companyInfo.city}
            labelWidth="w-16"
          />
        </div>
      </div>

      {/* CUSTOMER PROFILES */}
      <div className="grid grid-cols-2 gap-8 relative mb-6">
        <div className="flex flex-col">
          <h3 className="text-teal-700 text-[10px] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-0.5">
            Bill To
          </h3>
          <div className="space-y-1.5">
            <InfoRow
              label="Company"
              value={
                <span className="font-bold text-slate-900">
                  {invoiceData.billTo.name}
                </span>
              }
            />
            <InfoRow label="Attention" value={invoiceData.billTo.attn} />
            <InfoRow label="Address" value={invoiceData.billTo.address} />
            <InfoRow label="Phone" value={invoiceData.billTo.phone} />
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200" />
        <div className="flex flex-col">
          <h3 className="text-teal-700 text-[10px] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-0.5">
            Ship To
          </h3>
          <div className="space-y-1.5">
            <InfoRow
              label="Warehouse"
              value={
                <span className="font-bold text-slate-900">
                  {invoiceData.shipTo.name}
                </span>
              }
            />
            <InfoRow label="Attention" value={invoiceData.shipTo.attn} />
            <InfoRow label="Address" value={invoiceData.shipTo.address} />
            <InfoRow label="Phone" value={invoiceData.shipTo.phone} />
          </div>
        </div>
      </div>

      {/* LOGISTICS BLOCK ROW */}
      <div className="bg-slate-50 border border-slate-100 rounded-md mb-6 px-3 py-2">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="text-slate-500 text-[9px] font-bold uppercase text-center">
              {logisticFields.map((f) => (
                <th key={f.key} className="pb-1 font-bold">
                  {f.label}
                </th>
              ))}
              <th className="pb-1 font-bold">DISPATCH DATE</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-slate-800 font-semibold text-center font-mono">
              {logisticFields.map((f) => (
                <td key={f.key} className="py-1 text-[10px]">
                  {
                    invoiceData.logisticInfo[
                      f.key as keyof typeof invoiceData.logisticInfo
                    ]
                  }
                </td>
              ))}
              <td className="py-1 text-[10px]">
                {invoiceData.logisticInfo.shipDate}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PRODUCT ITEMS TABLE — no longer flex-1, so it doesn't stretch and push totals to page bottom */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[10px] font-bold uppercase text-left">
              <th className="py-2 px-2 w-12 text-center rounded-tl-md">Id</th>
              <th className="py-2 px-2 text-left">Description</th>
              <th className="py-2 px-2 w-16 text-center">Qty</th>
              <th className="py-2 px-2 w-24 text-right">Unit Rate</th>
              <th className="py-2 px-2 w-28 text-right rounded-tr-md">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-700 font-medium">
            {invoiceData.items.map((item, idx) => (
              <tr
                key={item.id}
                className={`text-[11px] ${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-100`}
              >
                <td className="py-2 px-2 text-center font-mono">{item.no}</td>
                <td className="py-2 px-2 text-left text-slate-800 font-semibold">
                  {item.description || '—'}
                </td>
                <td className="py-2 px-2 text-center font-mono">{item.qty}</td>
                <td className="py-2 px-2 text-right font-mono">
                  Rs {item.unitPrice.toFixed(2)}
                </td>
                <td className="py-2 px-2 text-right font-bold text-slate-900 font-mono">
                  Rs {(item.qty * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LEDGER MATH SUMMARIES — now sits right after the items table, with just mt-4 spacing */}
      <div className="flex justify-end mt-4">
        <div className="w-72 rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-[11px]">
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-200">
            <span className="text-slate-900 font-bold">Subtotal:</span>
            <span className="font-mono text-slate-700 font-bold">
              Rs {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-200">
            <span className="text-slate-900 font-bold">
              Tax ({invoiceData.taxRate}%):
            </span>
            <span className="font-mono text-slate-600 font-semibold">
              Rs {taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-200">
            <span className="text-slate-900 font-bold">Shipping:</span>
            <span className="font-mono text-slate-700 font-semibold">
              Rs {Number(invoiceData.shipping).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-200">
            <span className="text-slate-900 font-bold">Misc Charges:</span>
            <span className="font-mono text-slate-700 font-semibold">
              Rs {Number(invoiceData.other).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-rose-600 pb-1 border-b border-slate-200 font-bold">
            <span>Previous Due:</span>
            <span className="font-mono">
              Rs {Number(invoiceData.previousDue).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-200">
            <span className="text-slate-900 font-bold">Amount Paid:</span>
            <span className="font-mono text-emerald-700 font-bold">
              Rs {Number(invoiceData.payment.paidAmount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-800 font-bold pb-2 border-b border-slate-200">
            <span className="text-slate-900 font-bold">Balance Due:</span>
            <span className="font-mono text-rose-600 text-xs">
              Rs {balanceDue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center -mx-4 -mb-4 px-4 py-3 bg-teal-700 rounded-b-lg text-white font-black">
            <span className="uppercase tracking-wide">Total</span>
            <span className="font-mono text-sm">
              Rs {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer stays pinned to the bottom of the page regardless of how much/little content is above it */}
      <div className="text-center pt-4 border-t border-slate-100 mt-auto">
        <div className="text-[10px] font-black text-teal-700 tracking-[0.4em] uppercase">
          Thank You For Your Business
        </div>
      </div>
    </div>
  );
};
