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
      <div className="border-b border-slate-100 pb-4 mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
            {invoiceData.companyInfo.name}
          </h1>
          <div className="flex gap-6 text-[11px] font-mono text-slate-500">
            <div>
              <span className="font-sans text-black font-bold">Date:</span>{' '}
              {invoiceData.meta.date}
            </div>
            <div>
              <span className="font-sans text-black font-bold">
                Invoice No:
              </span>{' '}
              <span className="text-teal-600 font-black">
                {invoiceData.meta.invoiceNo}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-50">
          <div>
            <span className="text-black font-bold">Manager:</span>{' '}
            <span className="text-slate-600">
              {invoiceData.companyInfo.poc}
            </span>
          </div>
          <div>
            <span className="text-black font-bold">Address:</span>{' '}
            <span className="text-slate-600">
              {invoiceData.companyInfo.address}
            </span>
          </div>
          <div>
            <span className="text-black font-bold">City:</span>{' '}
            <span className="text-slate-600">
              {invoiceData.companyInfo.city}
            </span>
          </div>
        </div>
      </div>

      {/* CUSTOMER PROFILES */}
      <div className="grid grid-cols-2 gap-8 relative mb-6">
        <div className="flex flex-col">
          <h3 className="text-teal-600 text-[10px] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-0.5">
            Bill To
          </h3>
          <div className="space-y-1 text-slate-600 font-medium">
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Company:
              </span>
              <span className="font-bold text-slate-800">
                {invoiceData.billTo.name}
              </span>
            </div>
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Attention:
              </span>
              {invoiceData.billTo.attn}
            </div>
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Address:
              </span>
              {invoiceData.billTo.address}
            </div>
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Phone:
              </span>
              {invoiceData.billTo.phone}
            </div>
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200" />
        <div className="flex flex-col">
          <h3 className="text-teal-600 text-[10px] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-0.5">
            Ship To
          </h3>
          <div className="space-y-1 text-slate-600 font-medium">
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Warehouse:
              </span>
              <span className="font-bold text-slate-800">
                {invoiceData.shipTo.name}
              </span>
            </div>
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Attention:
              </span>
              {invoiceData.shipTo.attn}
            </div>
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Address:
              </span>
              {invoiceData.shipTo.address}
            </div>
            <div>
              <span className="w-16 inline-block text-black font-bold">
                Phone:
              </span>
              {invoiceData.shipTo.phone}
            </div>
          </div>
        </div>
      </div>

      {/* LOGISTICS BLOCK ROW */}
      <div className="border-b border-slate-100 mb-6">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="text-black text-[9px] font-bold border-b border-slate-100 uppercase text-center">
              {logisticFields.map((f) => (
                <th key={f.key} className="pb-1 font-bold text-black">
                  {f.label}
                </th>
              ))}
              <th className="pb-1 font-bold text-black">DISPATCH DATE</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-slate-700 font-semibold text-center font-mono">
              {logisticFields.map((f) => (
                <td key={f.key} className="py-1.5 text-[10px]">
                  {
                    invoiceData.logisticInfo[
                      f.key as keyof typeof invoiceData.logisticInfo
                    ]
                  }
                </td>
              ))}
              <td className="py-1.5 text-[10px]">
                {invoiceData.logisticInfo.shipDate}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PRODUCT ITEMS TABLE */}
      <div className="flex-1 mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-black text-[10px] font-bold border-b-2 border-slate-200 uppercase text-left">
              <th className="pb-2 w-12 text-center">Id</th>
              <th className="pb-2 text-left">Description</th>
              <th className="pb-2 w-16 text-center">Qty</th>
              <th className="pb-2 w-24 text-right">Unit Rate</th>
              <th className="pb-2 w-28 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 font-medium">
            {invoiceData.items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 text-[11px]"
              >
                <td className="py-2 text-center font-mono">{item.no}</td>
                <td className="py-2 text-left text-slate-800 font-semibold">
                  {item.description || '—'}
                </td>
                <td className="py-2 text-center font-mono">{item.qty}</td>
                <td className="py-2 text-right font-mono">
                  Rs {item.unitPrice.toFixed(2)}
                </td>
                <td className="py-2 text-right font-bold text-slate-800 font-mono">
                  Rs {(item.qty * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LEDGER MATH SUMMARIES */}
      <div className="flex justify-end mt-4">
        <div className="w-72 space-y-2 text-[11px] border-t border-slate-100 pt-2">
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="text-black font-bold">Subtotal:</span>
            <span className="font-mono text-slate-700 font-bold">
              Rs {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="text-black font-bold">
              Tax ({invoiceData.taxRate}%):
            </span>
            <span className="font-mono text-slate-600 font-semibold">
              Rs {taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="text-black font-bold">Shipping:</span>
            <span className="font-mono text-slate-700 font-semibold">
              Rs {Number(invoiceData.shipping).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="text-black font-bold">Misc Charges:</span>
            <span className="font-mono text-slate-700 font-semibold">
              Rs {Number(invoiceData.other).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-rose-600 pb-1 border-b border-slate-100 font-bold">
            <span>Previous Due:</span>
            <span className="font-mono">
              Rs {Number(invoiceData.previousDue).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="text-black font-bold">Amount Paid:</span>
            <span className="font-mono text-emerald-700 font-bold">
              Rs {Number(invoiceData.payment.paidAmount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-800 font-bold pb-1 border-b border-slate-100">
            <span className="text-black font-bold">Balance Due:</span>
            <span className="font-mono text-rose-600 text-xs">
              Rs {balanceDue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 text-slate-900 border-t-2 border-slate-900 font-black">
            <span className="text-black uppercase">Total:</span>
            <span className="font-mono text-sm text-slate-900">
              Rs {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-slate-50 mt-auto">
        <div className="text-[10px] font-black text-teal-600 tracking-[0.4em] uppercase">
          Thank You For Your Business
        </div>
      </div>
    </div>
  );
};
