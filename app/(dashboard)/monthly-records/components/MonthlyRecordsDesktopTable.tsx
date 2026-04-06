'use client';

import React from 'react';
import { bottleTypes, columnThemes } from '../constants';
import type { DayRecord } from '../types';

type MonthlyRecordsDesktopTableProps = {
  monthlyData: DayRecord[];
};

export default function MonthlyRecordsDesktopTable({
  monthlyData,
}: MonthlyRecordsDesktopTableProps) {
  return (
    <div className="hidden md:block bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full table-auto border-collapse border-spacing-0 min-w-full">
          <thead>
            <tr>
              <th className="sticky left-0 z-30 bg-slate-50 px-3 md:px-6 py-3 md:py-4 border-b border-r border-slate-200 text-left text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                Timeline
              </th>
              {bottleTypes.map((bottle, idx) => (
                <th
                  key={bottle}
                  colSpan={5}
                  className={`border-b border-r border-slate-200 px-3 md:px-4 py-3 md:py-4 text-center text-[10px] sm:text-xs font-black uppercase tracking-widest sm:tracking-[0.15em] ${columnThemes[idx].header} ${columnThemes[idx].bg}`}
                >
                  {bottle}
                </th>
              ))}
            </tr>
            <tr>
              <th className="sticky left-0 z-30 bg-slate-50 px-3 md:px-6 py-2 md:py-3 border-b border-r border-slate-200 text-left text-[9px] sm:text-[10px] font-black text-slate-800">
                DAY
              </th>
              {bottleTypes.map((_, idx) =>
                ['STK', 'PRC', 'PRD', 'CST', 'PRF'].map((sub, j) => (
                  <th
                    key={`${idx}-${sub}`}
                    className={`border-b px-2 md:px-3 py-2 md:py-2.5 text-center text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-white ${j === 4 ? 'border-r border-slate-100' : ''}`}
                  >
                    {sub}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((day) => (
              <tr
                key={day.day}
                className="group hover:bg-slate-100 transition-colors"
              >
                <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-100 border-b border-r border-slate-200 px-3 md:px-6 py-2 md:py-3 text-[10px] sm:text-[11px] font-black text-slate-900 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
                  {day.day}
                </td>
                {day.bottles.map((b, idx) => (
                  <React.Fragment key={idx}>
                    <td className="border-b px-2 py-2 md:px-3 md:py-2.5 text-center text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-tight">
                      {b.stock}
                    </td>
                    <td className="border-b px-2 py-2 md:px-3 md:py-2.5 text-center text-[10px] sm:text-[11px] font-medium text-slate-400">
                      ₨{b.price}
                    </td>
                    <td className="border-b px-2 py-2 md:px-3 md:py-2.5 text-center text-[10px] sm:text-[11px] font-bold text-slate-700">
                      {b.production}
                    </td>
                    <td className="border-b px-2 py-2 md:px-3 md:py-2.5 text-center text-[10px] sm:text-[11px] font-bold text-slate-800">
                      ₨{b.cost.toLocaleString()}
                    </td>
                    <td className="border-b border-r border-slate-100 px-2 py-2 md:px-3 md:py-2.5 text-center text-[10px] sm:text-[11px] font-black text-emerald-600 bg-emerald-50/10 group-hover:bg-emerald-50/30 transition-all">
                      ₨{b.profit.toLocaleString()}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
