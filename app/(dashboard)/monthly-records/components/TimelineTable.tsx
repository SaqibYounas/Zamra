'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';

import { fetchMonthlyTimeline } from './getTimeline';
import {
  BOTTLE_SIZES,
  CURRENCY_METRICS,
  METRIC_LABELS,
  TIMELINE_METRICS,
  TimelineDay,
  metricValue,
  monthLabel,
} from './timelineTypes';
import { downloadTimelinePdf } from './exportTimelinePdf';

function formatCell(value: number, metric: (typeof TIMELINE_METRICS)[number]) {
  return CURRENCY_METRICS.has(metric)
    ? `Rs ${value.toLocaleString()}`
    : value.toLocaleString();
}

export default function TimelineTable() {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [days, setDays] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    fetchMonthlyTimeline(year, month)
      .then((data) => {
        if (mounted) setDays(data);
      })
      .catch(() => {
        if (mounted) {
          setError('Could not load the timeline. Try again.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [year, month]);

  function goToPrevMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (isCurrentMonth) return;

    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  async function handleExport() {
    if (!days.length || exporting) return;

    setExporting(true);

    try {
      await downloadTimelinePdf(monthLabel(year, month), days);
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {' '}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 p-2 text-white shadow-md">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
              {' '}
              Stock Timeline
            </h3>
            <p className="hidden text-sm text-slate-500 sm:block">
              {' '}
              Daily stock, sales, cost and profit tracking
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto">
          {' '}
          <div className="flex w-full items-center justify-between rounded-xl border border-sky-100 bg-sky-50 px-2 py-1 shadow-sm sm:w-auto sm:justify-center sm:rounded-full">
            <button
              onClick={goToPrevMonth}
              aria-label="Previous month"
              className="rounded-full p-2 transition-all hover:bg-sky-100 hover:text-sky-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="flex-1 text-center text-xs font-bold text-slate-700 sm:min-w-[9rem] sm:text-sm">
              {' '}
              {monthLabel(year, month)}
            </span>

            <button
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
              aria-label="Next month"
              className="rounded-full p-2 transition-all hover:bg-sky-100 hover:text-sky-600 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={!days.length || exporting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-40 sm:w-auto sm:rounded-full cursor-pointer"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Preparing PDF...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="animate-bounce text-5xl">💧</span>
            <p className="text-sm font-medium text-slate-500">
              Loading timeline...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          </div>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-x-auto overflow-y-auto rounded-2xl border border-slate-200 shadow-sm">
          {' '}
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead className="sticky top-0 z-20">
              <tr>
                <th
                  rowSpan={2}
                  className="sticky left-0 top-0 z-30 border-b border-r border-slate-200 bg-white px-3 py-3 text-left font-bold uppercase tracking-widest text-slate-600"
                >
                  Day
                </th>

                {BOTTLE_SIZES.map((size) => (
                  <th
                    key={size}
                    colSpan={TIMELINE_METRICS.length}
                    className="border-b border-l border-slate-200 bg-gradient-to-r from-sky-100 to-cyan-100 px-3 py-3 text-center font-bold text-slate-800 whitespace-nowrap"
                  >
                    {size}
                  </th>
                ))}
              </tr>

              <tr>
                {BOTTLE_SIZES.map((size) =>
                  TIMELINE_METRICS.map((metric, idx) => (
                    <th
                      key={`${size}-${metric}`}
                      title={METRIC_LABELS[metric]}
                      className={`bg-slate-100 px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap border-b border-slate-200 ${
                        idx === 0 ? 'border-l border-slate-200' : ''
                      }`}
                    >
                      {metric}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {days.map((day, rowIdx) => {
                const rowBg = rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70';

                return (
                  <tr
                    key={day.day}
                    className={`${rowBg} group transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50`}
                  >
                    <td
                      className={`sticky left-0 z-10 border-r border-slate-200 px-3 py-2 font-bold text-sky-700 transition-all duration-300 group-hover:bg-sky-100 ${rowBg}`}
                    >
                      {day.day}
                    </td>

                    {BOTTLE_SIZES.map((size) =>
                      TIMELINE_METRICS.map((metric, idx) => {
                        const value = metricValue(day.bottles[size], metric);

                        return (
                          <td
                            key={`${day.day}-${size}-${metric}`}
                            className={`px-3 py-2 text-right text-slate-700 whitespace-nowrap transition-all duration-300 group-hover:text-slate-900 ${
                              idx === 0 ? 'border-l border-slate-200' : ''
                            }`}
                          >
                            {metric === 'PRF' ? (
                              <span
                                className={`inline-flex rounded-lg px-1.5 py-1 text-[10px] sm:px-2 sm:text-xs font-semibold ${
                                  value > 0
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : value < 0
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {formatCell(value, metric)}
                              </span>
                            ) : metric === 'PRD' ? (
                              <span className="inline-flex rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                                {formatCell(value, metric)}
                              </span>
                            ) : metric === 'STK' ? (
                              <span className="inline-flex rounded-lg bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                                {formatCell(value, metric)}
                              </span>
                            ) : (
                              formatCell(value, metric)
                            )}
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center text-[10px] font-medium text-slate-500 sm:text-xs">
        {' '}
        STK = Stock • PRC = Price • PRD = Sold • CST = Cost • PRF = Profit
      </div>
    </div>
  );
}
