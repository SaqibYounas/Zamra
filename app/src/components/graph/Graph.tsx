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
import { TrendingUp, Receipt, Layers, ArrowUpRight } from 'lucide-react';
import { JSX } from 'react';
import RupeesIcon from '@/public/RupeesIcon';
import {
  MetricType,
  StockMetrics,
  StockBottleType,
} from '../../../(dashboard)/types/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const METRIC_CONFIG: Record<
  MetricType,
  { color: string; icon: JSX.Element; unit: string; isCurrency: boolean }
> = {
  'Today Stock': {
    color: 'rgba(79, 70, 229, 0.85)',
    icon: <Layers className="w-5 h-5 text-sky-500" />,
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
    icon: <Layers className="w-5 h-5 text-sky-500" />,
    unit: ' units',
    isCurrency: false,
  },
  'Monthly Profit': {
    color: 'rgba(234, 179, 8, 0.85)',
    icon: <TrendingUp className="w-5 h-5 text-yellow-600" />,
    unit: 'Rs',
    isCurrency: true,
  },
};

const labels: StockBottleType[] = ['500ml', '1.5L', '5L', '19L', '19L Refill'];
const days = Array.from({ length: 30 }, (_, i) => `${i + 1}`);

interface GraphCardProps {
  title: MetricType;
  rawStockData?: StockMetrics;
}

export default function GraphCard({ title, rawStockData }: GraphCardProps) {
  const config = METRIC_CONFIG[title];
  if (!config) return null;

  const processChartData = (): number[] => {
    if (!rawStockData) return [];

    switch (title) {
      case 'Today Stock':
        return labels.map((size) => rawStockData.todayStock?.[size] || 0);

      case 'Total Cost':
        return labels.map((size) => rawStockData.costs?.[size] || 0);

      case 'Profit Today':
        return labels.map((size) => rawStockData.profitToday?.[size] || 0);

      case 'Overall Stock':
        return labels.map((size) => rawStockData.overallStock?.[size] || 0);

      case 'Monthly Profit':
        return (
          rawStockData.monthlyProfitHistory ||
          Array.from({ length: 30 }, () => 0)
        );

      default:
        return [];
    }
  };

  const chartData = processChartData();
  const totalValue = chartData.reduce((a, b) => a + b, 0);

  const data: ChartData<'bar'> = {
    labels: title === 'Monthly Profit' ? days : labels,
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
    onHover: (event, elements) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length ? 'pointer' : 'default';
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>) => {
            const value = tooltipItem.raw as number;
            return config.isCurrency
              ? `${tooltipItem.dataset.label}: Rs ${value.toLocaleString()}`
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
      y: {
        beginAtZero: true,
        ticks: { font: { weight: 'bold' } },
      },
      x: {
        title: {
          display: true,
          text: title === 'Monthly Profit' ? 'Days' : 'Bottle Types',
          font: { weight: 'bold' },
        },
        ticks: { font: { weight: 'bold' } },
      },
    },
  };

  return (
    <div
      className={`bg-slate-100 rounded-3xl p-4 sm:p-6 md:p-6 lg:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full w-full ${
        title === 'Monthly Profit' ? 'col-span-1 sm:col-span-2' : ''
      }`}
    >
      <div className="flex flex-row items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 bg-slate-50 rounded-xl shrink-0">
            {config.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 truncate">
              {title}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
              {title === 'Monthly Profit'
                ? 'Monthly Overview'
                : 'Daily Overview'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 relative">
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-sky-500 flex items-center gap-1 whitespace-nowrap relative">
            <span className="flex items-center">
              {config.isCurrency ? <RupeesIcon /> : config.icon}
            </span>
            {totalValue.toLocaleString()}
            <div className="absolute -top-2 bottom-8 right-0 flex items-center text-emerald-500 text-[8px] sm:text-xs font-bold gap-1">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>15%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grow min-h-45 sm:min-h-65 md:min-h-75">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
