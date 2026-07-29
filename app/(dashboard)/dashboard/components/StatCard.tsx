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
    <div className="group flex h-full w-full items-center ring-1 justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shrink-0`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold truncate">{label}</h3>

          <div className="mt-1 flex items-center gap-1 text-2xl font-bold text-blue-400">
            {isCurrency && <RupeesIcon />}
            <span>{value.toLocaleString()}</span>
            {!isCurrency && unit && (
              <span className="text-base font-medium text-slate-500">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
