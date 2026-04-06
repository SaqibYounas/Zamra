'use client';

import { TAB_LABELS } from '../constants';

type MonthlyRecordsTabsProps = {
  activeTab: number;
  setActiveTab: (index: number) => void;
};

export default function MonthlyRecordsTabs({
  activeTab,
  setActiveTab,
}: MonthlyRecordsTabsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="flex gap-1 sm:gap-2 overflow-x-auto">
        {TAB_LABELS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
              activeTab === i
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-100'
                : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] whitespace-nowrap">
        <span className="w-3 h-3 rounded-full bg-sky-400" />
        Live Sync: Active
      </div>
    </div>
  );
}
