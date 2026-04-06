'use client';

import { Database, FileText, TrendingUp } from 'lucide-react';
import type { Totals } from '../types';

type MonthlyRecordsSummaryCardsProps = {
  totals: Totals;
};

const cards = [
  {
    label: 'Inventory Holding',
    icon: <Database />,
    color: 'bg-indigo-600',
    sub: 'Total units in stock',
  },
  {
    label: 'Monthly Expenditure',
    icon: <FileText />,
    color: 'bg-rose-600',
    sub: 'Gross production costs',
  },
  {
    label: 'Net Profit Yield',
    icon: <TrendingUp />,
    color: 'bg-emerald-600',
    sub: 'Total earnings realized',
  },
];

export default function MonthlyRecordsSummaryCards({
  totals,
}: MonthlyRecordsSummaryCardsProps) {
  const values = [
    totals.stock.toLocaleString(),
    `₨${totals.cost.toLocaleString()}`,
    `₨${totals.profit.toLocaleString()}`,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="bg-white p-4 sm:p-6 md:p-7 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-slate-200 shadow-sm flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start justify-between gap-3 sm:gap-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
        >
          <div className="space-y-1 flex-1">
            <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              {card.label}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {values[index]}
            </h2>
            <p className="text-slate-300 text-[9px] sm:text-[10px] font-medium">
              {card.sub}
            </p>
          </div>
          <div
            className={`${card.color} p-3 sm:p-4 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl text-white shadow-lg rotate-3 shrink-0`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
