'use client';

import { useRouter } from 'next/navigation';
import Button from '../../src/components/button/Button';

const invoices = [
  {
    id: 'INV-1001',
    date: '2026-04-05',
    customer: 'Khan Water Traders',
    amount: 1840.0,
    status: 'Paid',
  },
  {
    id: 'INV-1002',
    date: '2026-04-03',
    customer: 'Ali General Store',
    amount: 2920.0,
    status: 'Pending',
  },
  {
    id: 'INV-1003',
    date: '2026-03-28',
    customer: 'Sunrise Catering',
    amount: 1350.0,
    status: 'Paid',
  },
  {
    id: 'INV-1004',
    date: '2026-03-22',
    customer: 'Green Valley Farms',
    amount: 2140.0,
    status: 'Unpaid',
  },
];

export default function InvoicesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-screen max-w-4xl items-start justify-center">
        <div className="w-full bg-slate-50 shadow-lg rounded-3xl p-6 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-teal-600 uppercase tracking-[0.4em] text-[11px] font-black mb-2">
                Invoices
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                Previous Invoices
              </h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Review and manage all previously generated invoices for Zamra
                Water customers.
              </p>
            </div>
            <Button
              label="Create New Invoice"
              onClick={() => router.push('/bill-generate')}
              className="md:w-auto"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Invoice
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 transition hover:bg-slate-100"
                    >
                      <td className="px-4 py-4 text-sm font-black text-slate-900">
                        {invoice.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {invoice.date}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-800">
                        {invoice.customer}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-black text-slate-900">
                        Rs{invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black tracking-[0.2em] ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : invoice.status === 'Pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => router.push('/bill-generate')}
                          className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-sky-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
