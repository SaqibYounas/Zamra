import type { MonthOption } from './types';

export const bottleTypes = ['500ml', '1.5L', '5L', '19L', '19L Refill'];

export const columnThemes = [
  { header: 'text-indigo-600', bg: 'bg-indigo-50/40' },
  { header: 'text-emerald-600', bg: 'bg-emerald-50/40' },
  { header: 'text-amber-600', bg: 'bg-amber-50/40' },
  { header: 'text-rose-600', bg: 'bg-rose-50/40' },
  { header: 'text-violet-600', bg: 'bg-violet-50/40' },
];

export const MONTHS: MonthOption[] = [
  { month: 'January', year: 2026 },
  { month: 'February', year: 2026 },
  { month: 'March', year: 2026 },
  { month: 'April', year: 2026 },
];

export const MONTH_NAMES = [
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

export const TAB_LABELS = ['Daily Records', 'Summary Statistics'] as const;
