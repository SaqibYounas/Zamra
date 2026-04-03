'use client';
import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Filter,
  Database,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import Button from '../../src/components/button/Button';

const bottleTypes = ['500ml', '1.5L', '5L', '19L', '19L Refill'];

const columnThemes = [
  { header: 'text-indigo-600', bg: 'bg-indigo-50/40' },
  { header: 'text-emerald-600', bg: 'bg-emerald-50/40' },
  { header: 'text-amber-600', bg: 'bg-amber-50/40' },
  { header: 'text-rose-600', bg: 'bg-rose-50/40' },
  { header: 'text-violet-600', bg: 'bg-violet-50/40' },
];

const MONTHS = [
  { month: 'January', year: 2026 },
  { month: 'February', year: 2026 },
  { month: 'March', year: 2026 },
  { month: 'April', year: 2026 },
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getDaysInMonth(monthName: string, year: number): number {
  const mi = MONTH_NAMES.indexOf(monthName);
  return new Date(year, mi + 1, 0).getDate();
}

function generateMonthlyData(monthName: string, year: number) {
  const days = getDaysInMonth(monthName, year);
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    bottles: bottleTypes.map((name) => {
      const stock = Math.floor(Math.random() * 200 + 10);
      const price = Math.floor(Math.random() * 200 + 50);
      const production = Math.floor(Math.random() * 150 + 5);
      const cost = production * price;
      const profit = Math.floor(Math.random() * 500 + 100);
      return { name, stock, price, production, cost, profit };
    }),
  }));
}

export default function App() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const currentMonth = MONTHS[currentMonthIndex];

  const monthlyData = useMemo(
    () => generateMonthlyData(currentMonth.month, currentMonth.year),
    [currentMonth.month, currentMonth.year]
  );

  const totals = useMemo(
    () =>
      monthlyData.reduce(
        (acc, day) => {
          day.bottles.forEach((b) => {
            acc.stock += b.stock;
            acc.cost += b.cost;
            acc.profit += b.profit;
          });
          return acc;
        },
        { stock: 0, cost: 0, profit: 0 }
      ),
    [monthlyData]
  );

  const handleExportCSV = () => {
    const rows = monthlyData.flatMap((day) =>
      day.bottles.map((b) => ({
        Day: day.day,
        Bottle: b.name,
        Stock: b.stock,
        Price: `Rs${b.price}`,
        Production: b.production,
        Cost: `Rs${b.cost}`,
        Profit: `Rs${b.profit}`,
      }))
    );
    exportToCSV(`Monthly_${currentMonth.month}.csv`, rows);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col md:pl-20">
      <div className="p-2 sm:p-4 md:p-6 lg:p-8 w-full flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
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
              onClick={() =>
                currentMonthIndex > 0 && setCurrentMonthIndex((i) => i - 1)
              }
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
              onClick={() =>
                currentMonthIndex < MONTHS.length - 1 &&
                setCurrentMonthIndex((i) => i + 1)
              }
              disabled={currentMonthIndex === MONTHS.length - 1}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-sm transition disabled:opacity-20"
              title="Next month"
            >
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" />
            </button>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full lg:w-auto">
            <Button
              label="EXPORT"
              onClick={handleExportCSV}
              className="!w-1/2 lg:!w-auto px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1 sm:gap-2"
            />
            <Button
              label="FILTER"
              className="!w-1/2 lg:!w-auto px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1 sm:gap-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto">
            {['Daily Records', 'Summary Statistics'].map((tab, i) => (
              <button
                key={tab}
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
            <Database className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-sky-400" />
            Live Sync: Active
          </div>
        </div>

        {activeTab === 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse border-spacing-0 min-w-max sm:min-w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-30 bg-slate-50 px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-b border-r border-slate-200 text-left text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                      Timeline
                    </th>
                    {bottleTypes.map((bottle, idx) => (
                      <th
                        key={bottle}
                        colSpan={5}
                        className={`border-b border-r border-slate-200 px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 text-center text-[9px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] ${columnThemes[idx].header} ${columnThemes[idx].bg}`}
                      >
                        {bottle}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th className="sticky left-0 z-30 bg-slate-50 px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border-b border-r border-slate-200 text-left text-[8px] sm:text-xs font-black text-slate-800">
                      DAY
                    </th>
                    {bottleTypes.map((_, idx) =>
                      ['STK', 'PRC', 'PRD', 'CST', 'PRF'].map((sub, j) => (
                        <th
                          key={`${idx}-${sub}`}
                          className={`border-b px-1 sm:px-2 md:px-2 py-2 sm:py-2.5 text-center text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-white ${j === 4 ? 'border-r border-slate-100' : ''}`}
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
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 border-b border-r border-slate-200 px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-xs font-black text-slate-900 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
                        {day.day}
                      </td>
                      {day.bottles.map((b, idx) => (
                        <React.Fragment key={idx}>
                          <td className="border-b px-1 sm:px-2 py-2 sm:py-2.5 md:py-3 text-center text-[8px] sm:text-[10px] md:text-[11px] font-medium text-slate-500 tracking-tight">
                            {b.stock}
                          </td>
                          <td className="border-b px-1 sm:px-2 py-2 sm:py-2.5 md:py-3 text-center text-[8px] sm:text-[10px] md:text-[11px] font-medium text-slate-400">
                            ₨{b.price}
                          </td>
                          <td className="border-b px-1 sm:px-2 py-2 sm:py-2.5 md:py-3 text-center text-[8px] sm:text-[10px] md:text-[11px] font-bold text-slate-700">
                            {b.production}
                          </td>
                          <td className="border-b px-1 sm:px-2 py-2 sm:py-2.5 md:py-3 text-center text-[8px] sm:text-[10px] md:text-[11px] font-bold text-slate-800">
                            ₨{b.cost.toLocaleString()}
                          </td>
                          <td className="border-b border-r border-slate-100 px-1 sm:px-2 py-2 sm:py-2.5 md:py-3 text-center text-[8px] sm:text-[10px] md:text-[11px] font-black text-emerald-600 bg-emerald-50/10 group-hover:bg-emerald-50/30 transition-all">
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
        )}

        {activeTab === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[
              {
                label: 'Inventory Holding',
                value: totals.stock.toLocaleString(),
                icon: <Database />,
                color: 'bg-indigo-600',
                sub: 'Total units in stock',
              },
              {
                label: 'Monthly Expenditure',
                value: `₨${totals.cost.toLocaleString()}`,
                icon: <FileText />,
                color: 'bg-rose-600',
                sub: 'Gross production costs',
              },
              {
                label: 'Net Profit Yield',
                value: `₨${totals.profit.toLocaleString()}`,
                icon: <TrendingUp />,
                color: 'bg-emerald-600',
                sub: 'Total earnings realized',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-4 sm:p-6 md:p-7 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-slate-200 shadow-sm flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start justify-between gap-3 sm:gap-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="space-y-1 flex-1">
                  <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    {card.label}
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {card.value}
                  </h2>
                  <p className="text-slate-300 text-[9px] sm:text-[10px] font-medium">
                    {card.sub}
                  </p>
                </div>
                <div
                  className={`${card.color} p-3 sm:p-4 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl text-white shadow-lg rotate-3 flex-shrink-0`}
                >
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
        )}
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
