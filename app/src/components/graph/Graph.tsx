'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
} from 'chart.js';
import {
  Package,
  TrendingUp,
  Receipt,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { JSX } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type MetricType =
  | 'Today Stock'
  | 'Total Cost'
  | 'Profit Today'
  | 'Overall Stock';

const METRIC_CONFIG: Record<
  MetricType,
  { color: string; icon: JSX.Element; unit: string; isCurrency: boolean }
> = {
  'Today Stock': {
    color: 'rgba(79, 70, 229, 0.85)',
    icon: <Package className="w-5 h-5 text-indigo-600" />,
    unit: ' units',
    isCurrency: false,
  },
  'Total Cost': {
    color: 'rgba(244, 63, 94, 0.85)',
    icon: <Receipt className="w-5 h-5 text-rose-600" />,
    unit: 'Rs',
    isCurrency: true,
  },
  'Profit Today': {
    color: 'rgba(16, 185, 129, 0.85)',
    icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
    unit: 'Rs',
    isCurrency: true,
  },
  'Overall Stock': {
    color: 'rgba(139, 92, 246, 0.85)',
    icon: <Layers className="w-5 h-5 text-violet-600" />,
    unit: ' units',
    isCurrency: false,
  },
};

const labels = ['500ml', '1.5L', '5L', '19L', '19L Refill'];

const generateData = (type: MetricType) => {
  switch (type) {
    case 'Today Stock':
      return [120, 80, 50, 30, 15];
    case 'Total Cost':
      return [2400, 4000, 2500, 1800, 500];
    case 'Profit Today':
      return [500, 1200, 800, 600, 200];
    case 'Overall Stock':
      return [150, 120, 60, 35, 20];
    default:
      return [];
  }
};

interface GraphCardProps {
  title: MetricType;
}

export default function GraphCard({ title }: GraphCardProps) {
  const config = METRIC_CONFIG[title];

  if (!config) return null;

  const chartData = generateData(title);
  const totalValue = chartData.reduce((a, b) => a + b, 0);

  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: title,
        data: chartData,
        backgroundColor: config.color,
        borderRadius: 8,
        barThickness: 'flex',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>) => {
            const value = tooltipItem.raw as number;
            return config.isCurrency
              ? `${tooltipItem.dataset.label}: ₹${value.toLocaleString()}`
              : `${tooltipItem.dataset.label}: ${value}${config.unit}`;
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: 'Bottle Types', font: { size: 12 } } },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-6 lg:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <div className="p-2.5 bg-slate-50 rounded-xl">{config.icon}</div>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
              {title}
            </h3>
            <p className="text-[9px] sm:text-xs md:text-sm font-bold pl-1 text-slate-400 uppercase tracking-wider">
              Daily Overview
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
            {config.isCurrency ? 'Rs ' : ''}
            {totalValue.toLocaleString()}
          </div>
          <div className="flex items-center text-emerald-500 text-[9px] sm:text-[10px] md:text-xs font-bold justify-end">
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            <span>15%</span>
          </div>
        </div>
      </div>

      <div className="grow min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export function DashboardGraphGrid() {
  const metrics: MetricType[] = [
    'Today Stock',
    'Total Cost',
    'Profit Today',
    'Overall Stock',
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <GraphCard key={metric} title={metric} />
      ))}
    </div>
  );
}
