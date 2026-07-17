'use client';

import { JSX } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { TrendingUp, Receipt, Layers, ArrowUpRight } from 'lucide-react';

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

/* -------------------------------------------------------------------------- */
/*                                Configuration                               */
/* -------------------------------------------------------------------------- */

const BOTTLE_LABELS: StockBottleType[] = [
  '500ml',
  '1.5L',
  '5L',
  '19L',
  '19L Refill',
];

const DAYS = Array.from({ length: 30 }, (_, i) => `${i + 1}`);

const METRIC_CONFIG: Record<
  MetricType,
  {
    color: string;
    icon: JSX.Element;
    unit: string;
    isCurrency: boolean;
  }
> = {
  'Today Stock': {
    color: 'rgba(79,70,229,0.85)',
    icon: <Layers className="w-5 h-5 text-sky-500" />,
    unit: ' units',
    isCurrency: false,
  },

  'Overall Stock': {
    color: 'rgba(139,92,246,0.85)',
    icon: <Layers className="w-5 h-5 text-sky-500" />,
    unit: ' units',
    isCurrency: false,
  },

  'Total Cost': {
    color: 'rgba(244,63,94,0.85)',
    icon: <Receipt className="w-5 h-5 text-rose-600" />,
    unit: 'Rs',
    isCurrency: true,
  },

  'Profit Today': {
    color: 'rgba(16,185,129,0.85)',
    icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
    unit: 'Rs',
    isCurrency: true,
  },

  'Monthly Profit': {
    color: 'rgba(234,179,8,0.85)',
    icon: <TrendingUp className="w-5 h-5 text-yellow-600" />,
    unit: 'Rs',
    isCurrency: true,
  },
};

interface GraphCardProps {
  title: MetricType;
  rawStockData?: StockMetrics;
}

/* -------------------------------------------------------------------------- */
/*                               Helper Function                              */
/* -------------------------------------------------------------------------- */

function getChartData(title: MetricType, stock?: StockMetrics): number[] {
  if (!stock) return [];

  const metricMap = {
    'Today Stock': stock.todayStock,
    'Overall Stock': stock.overallStock,
    'Total Cost': stock.costs,
    'Profit Today': stock.profitToday,
  };

  if (title === 'Monthly Profit') {
    return stock.monthlyProfitHistory ?? Array(30).fill(0);
  }

  const metric = metricMap[title as keyof typeof metricMap];

  return BOTTLE_LABELS.map((size) => metric?.[size] ?? 0);
}

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

export default function GraphCard({ title, rawStockData }: GraphCardProps) {
  const config = METRIC_CONFIG[title];

  if (!config) return null;

  const chartData = getChartData(title, rawStockData);

  const totalValue = chartData.reduce((sum, value) => sum + value, 0);

  const data: ChartData<'bar'> = {
    labels: title === 'Monthly Profit' ? DAYS : BOTTLE_LABELS,

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

    onHover(event, elements) {
      const target = event.native?.target as HTMLElement;

      if (target) {
        target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (item: TooltipItem<'bar'>) => {
            const value = item.raw as number;

            return config.isCurrency
              ? `${title}: Rs ${value.toLocaleString()}`
              : `${title}: ${value}${config.unit}`;
          },
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            weight: 'bold',
          },
        },
      },

      x: {
        title: {
          display: true,
          text: title === 'Monthly Profit' ? 'Days' : 'Bottle Types',

          font: {
            weight: 'bold',
          },
        },

        ticks: {
          font: {
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div
      className={`bg-slate-100 ring-1 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full w-full ${
        title === 'Monthly Profit' ? 'col-span-1 sm:col-span-2' : ''
      }`}
    >
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl">{config.icon}</div>

          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
        </div>

        <div className="relative flex flex-col items-end">
          <div className="flex items-center text-2xl font-bold text-sky-500">
            {config.isCurrency ? <RupeesIcon /> : config.icon}

            {totalValue.toLocaleString()}
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="grow min-h-72">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
