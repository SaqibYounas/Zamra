'use client';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MonthOption } from '../types';

type MonthlyRecordsToolbarProps = {
  currentMonth: MonthOption;
  currentMonthIndex: number;
  monthCount: number;
  onPrev: () => void;
  onNext: () => void;
  onExport: () => void;
};

export default function MonthlyRecordsToolbar({
  currentMonth,
  currentMonthIndex,
  monthCount,
  onPrev,
  onNext,
  onExport,
}: MonthlyRecordsToolbarProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 p-3 sm:p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 md:gap-6">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="bg-sky-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg shadow-sky-100">
          <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Inventory Records
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Monthly Logistics
          </p>
        </div>
      </div>

      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl sm:rounded-2xl p-1 gap-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentMonthIndex === 0}
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-sm transition disabled:opacity-20"
          title="Previous month"
        >
          <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" />
        </button>
        <span className="text-xs sm:text-sm font-black text-slate-800 min-w-32 sm:min-w-35 text-center px-2">
          {currentMonth.month} {currentMonth.year}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={currentMonthIndex === monthCount - 1}
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-sm transition disabled:opacity-20"
          title="Next month"
        >
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex gap-2 sm:gap-3 w-full lg:w-auto">
        <button
          type="button"
          onClick={onExport}
          className="w-1/2! lg:w-auto! px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1 sm:gap-2"
        >
          EXPORT
        </button>
      </div>
    </div>
  );
}
