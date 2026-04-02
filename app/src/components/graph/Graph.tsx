'use client';

import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const METRIC_CONFIG = {
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
  'Over all Stock': {
    color: 'rgba(139, 92, 246, 0.85)',
    icon: <Layers className="w-5 h-5 text-violet-600" />,
    unit: ' units',
    isCurrency: false,
  },
};
const labels = ['500ml', '1.5L', '5L', '19L', '19L Refill'];

const generateData = (type: string) => {
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
      return [0, 0, 0, 0, 0];
  }
};

interface GraphCardProps {
  title: keyof typeof METRIC_CONFIG;
}

export default function GraphCard({ title }: GraphCardProps) {
  const config = METRIC_CONFIG[title];
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
        barThickness: 28,
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
            if (config.isCurrency) {
              return `${tooltipItem.dataset.label}: ₹${value.toLocaleString()}`;
            }
            return `${tooltipItem.dataset.label}: ${value}${config.unit}`;
          },
        },
      },
      title: { display: true, text: title, font: { size: 16, weight: 'bold' } },
    },
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: 'Bottle Types' } },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full w-full">
      {' '}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-50 rounded-xl">{config.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Daily Overview
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-slate-900">
            {config.isCurrency ? 'Rs' : ''}
            {totalValue.toLocaleString()}
          </div>
          <div className="flex items-center text-emerald-500 text-[10px] font-bold justify-end">
            <ArrowUpRight className="w-3 h-3" />
            <span>12%</span>
          </div>
        </div>
      </div>
      <div className="flex-grow min-h-[220px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
