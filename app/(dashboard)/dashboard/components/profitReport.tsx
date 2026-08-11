'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Receipt, Wallet } from 'lucide-react';
import RupeesIcon from '@/public/RupeesIcon';
interface DailyDetail {
  date: string;
  soldQty: string | number;
  revenue: string | number;
  cost: string | number;
  profit: string | number;
}

interface ProfitReport {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  monthlyProfitHistory: number[];
  details: DailyDetail[];
}

function generateDummyReport(): ProfitReport {
  const details: DailyDetail[] = [];
  const monthlyProfitHistory: number[] = [];
  const today = new Date();

  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const soldQty = 40 + Math.round(Math.random() * 160);
    const rate = 220 + Math.random() * 40;
    const perBottleCost = 95 + Math.random() * 25;

    const revenue = soldQty * rate;
    const cost = soldQty * perBottleCost;
    const profit = revenue - cost;

    totalRevenue += revenue;
    totalCost += cost;
    totalProfit += profit;

    monthlyProfitHistory.push(Math.round(profit));
    details.push({
      date: d.toISOString().slice(0, 10),
      soldQty,
      revenue: revenue.toFixed(2),
      cost: cost.toFixed(2),
      profit: profit.toFixed(2),
    });
  }

  return {
    totalRevenue: Math.round(totalRevenue),
    totalCost: Math.round(totalCost),
    totalProfit: Math.round(totalProfit),
    monthlyProfitHistory,
    details,
  };
}

async function fetchProfitReport(): Promise<ProfitReport> {
  try {
    const res = await fetch('/api/profit', { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const data = (await res.json()) as ProfitReport;

    if (!data || !Array.isArray(data.monthlyProfitHistory)) {
      throw new Error('Invalid API response');
    }

    return data;
  } catch (err) {
    console.warn('Profit API failed, falling back to dummy report', err);
    // fallback to local generated data so UI still renders
    return generateDummyReport();
  }
}

const formatRs = (n: number) => n.toLocaleString();

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function MarginGauge({ marginPct }: { marginPct: number }) {
  const clamped = Math.max(0, Math.min(100, marginPct));
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-10 rounded-full border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-400 to-yellow-300 transition-all duration-700"
          style={{ height: `${clamped}%` }}
        />
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-slate-200" />
      </div>
      <div>
        <p className="font-mono text-2xl font-bold text-slate-900">
          {clamped.toFixed(1)}%
        </p>
        <p className="text-xs uppercase tracking-widest text-slate-500">
          Margin fill
        </p>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  icon,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconColor: string;
}) {
  return (
    <div className="bg-slate-100 ring-1 rounded-3xl p-4 sm:p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
        <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
          {label}
        </p>
      </div>
      <div
        className="flex items-center text-2xl font-bold"
        style={{ color: iconColor }}
      >
        <RupeesIcon />
        {value}
      </div>
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: readonly {
    dataKey?: string | number;
    name?: ReactNode;
    color?: string;
    value?: ReactNode;
  }[];
}

function ChartTooltip(props: unknown) {
  const { active, payload, label } = props as ChartTooltipProps;
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-bold text-slate-500">{label}</p>
      {payload.map((p) => (
        <p
          key={p.dataKey as string}
          style={{ color: p.color }}
          className="font-mono"
        >
          {p.name}: Rs{' '}
          {typeof p.value === 'number' ? formatRs(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard section
// ---------------------------------------------------------------------------

export default function ProfitReport() {
  const [report, setReport] = useState<ProfitReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchProfitReport()
      .then((data) => {
        if (mounted) setReport(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load the profit report. Try again.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const trendData = useMemo(() => {
    if (!report) return [];
    return report.monthlyProfitHistory.map((profit, idx) => ({
      day: `D${idx + 1}`,
      profit,
    }));
  }, [report]);

  const dailyData = useMemo(() => {
    if (!report) return [];
    return report.details.map((row) => ({
      date: shortDate(row.date),
      revenue: Number(row.revenue),
      cost: Number(row.cost),
      profit: Number(row.profit),
    }));
  }, [report]);

  const marginPct = useMemo(() => {
    if (!report || report.totalRevenue === 0) return 0;
    return (report.totalProfit / report.totalRevenue) * 100;
  }, [report]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-slate-100 rounded-3xl border border-slate-100 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <span className="text-5xl animate-bounce">💧</span>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 bg-slate-100 rounded-3xl border border-slate-100 shadow-lg">
        <p className="text-sm font-semibold text-rose-600">
          {error ?? 'No data.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-sky-500">
          Production &amp; Sales
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          Monthly Profit Report
        </h2>
        <p className="text-sm text-slate-500">
          Last 30 days · cost priced per bottle at time of sale
        </p>
      </div> */}

      {/* Profit trend — area chart */}
      <section className="bg-slate-100 ring-1 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
        <h3 className="mb-4 font-bold text-lg text-slate-900">
          Profit trend (30 days)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ left: 0, right: 10 }}>
              <defs>
                <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={ChartTooltip} />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#eab308"
                strokeWidth={2}
                fill="url(#profitFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Revenue vs Cost vs Profit — composed chart */}
      <section className="bg-slate-100 ring-1 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
        <h3 className="mb-4 font-bold text-lg text-slate-900">
          Revenue vs cost vs profit, per day
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={ChartTooltip} />
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  color: '#64748b',
                  fontWeight: 600,
                }}
                iconType="circle"
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="rgba(79,70,229,0.85)"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
              <Bar
                dataKey="cost"
                name="Cost"
                fill="rgba(244,63,94,0.6)"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#eab308"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
