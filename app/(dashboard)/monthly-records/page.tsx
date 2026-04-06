'use client';

import React, { useMemo, useState } from 'react';
import { exportToCSV } from '../utils/csvExport';
import { MONTHS } from './constants';
import { buildExportRows, getTotals } from './helpers';
import { generateMonthlyData } from './data';
import {
  MonthlyRecordsDesktopTable,
  MonthlyRecordsMobileCards,
  MonthlyRecordsSummaryCards,
  MonthlyRecordsTabs,
  MonthlyRecordsToolbar,
} from './components';

export default function MonthlyRecordsPage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const currentMonth = MONTHS[currentMonthIndex];

  const monthlyData = useMemo(
    () => generateMonthlyData(currentMonth.month, currentMonth.year),
    [currentMonth.month, currentMonth.year]
  );

  const totals = useMemo(() => getTotals(monthlyData), [monthlyData]);

  const handleExportCSV = () => {
    const rows = buildExportRows(monthlyData);
    exportToCSV(`Monthly_${currentMonth.month}.csv`, rows);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        <MonthlyRecordsToolbar
          currentMonth={currentMonth}
          currentMonthIndex={currentMonthIndex}
          monthCount={MONTHS.length}
          onPrev={() => setCurrentMonthIndex((index) => Math.max(index - 1, 0))}
          onNext={() =>
            setCurrentMonthIndex((index) =>
              Math.min(index + 1, MONTHS.length - 1)
            )
          }
          onExport={handleExportCSV}
        />

        <MonthlyRecordsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 0 && (
          <>
            <MonthlyRecordsMobileCards monthlyData={monthlyData} />
            <MonthlyRecordsDesktopTable monthlyData={monthlyData} />
          </>
        )}

        {activeTab === 1 && <MonthlyRecordsSummaryCards totals={totals} />}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar { height: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: #e2e8f0; 
            border-radius: 20px; 
            border: 2px solid white;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        `,
        }}
      />
    </div>
  );
}
