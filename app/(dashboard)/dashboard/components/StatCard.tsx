'use client';

import { ReactNode } from 'react';
import RupeesIcon from '@/public/RupeesIcon';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  isCurrency?: boolean;
  unit?: string;
  iconBg?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  isCurrency = false,
  unit = '',
  iconBg = 'bg-sky-100',
}: StatCardProps) {
  return (
    <div className="group ring-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <h3 className="mb-2 text-center text-sm font-bold text-slate-700">
        {label}
      </h3>

      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>

        <div className="flex items-center gap-1 text-xl font-bold text-blue-400">
          {isCurrency && <RupeesIcon />}
          <span>{value.toLocaleString()}</span>

          {!isCurrency && unit && (
            <span className="text-sm font-medium text-slate-500">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
}
