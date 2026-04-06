'use client';

import type { DayRecord } from '../types';

type MonthlyRecordsMobileCardsProps = {
  monthlyData: DayRecord[];
};

export default function MonthlyRecordsMobileCards({
  monthlyData,
}: MonthlyRecordsMobileCardsProps) {
  return (
    <div className="md:hidden space-y-3">
      {monthlyData.map((day) => (
        <div
          key={day.day}
          className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">
                Day
              </p>
              <p className="text-xl font-black text-slate-900">{day.day}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Daily details
            </div>
          </div>

          <div className="grid gap-3">
            {day.bottles.map((bottle, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-3 hover:bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-sm font-black text-slate-900">
                    {bottle.name}
                  </p>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-black">
                    Profit
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="rounded-3xl bg-white p-3 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Stock
                    </p>
                    <p className="text-base font-bold text-slate-900">
                      {bottle.stock}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white p-3 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Price
                    </p>
                    <p className="text-base font-bold text-slate-900">
                      ₨{bottle.price}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white p-3 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Production
                    </p>
                    <p className="text-base font-bold text-slate-900">
                      {bottle.production}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white p-3 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Cost
                    </p>
                    <p className="text-base font-bold text-slate-900">
                      ₨{bottle.cost.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 rounded-3xl bg-emerald-50/90 p-3 text-[11px] text-emerald-700 font-black">
                  Profit: ₨{bottle.profit.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
