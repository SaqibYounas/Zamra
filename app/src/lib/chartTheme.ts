import type { Theme } from './theme';
export const SERIES_COLORS = [
  '#0aa5ec',
  '#7c5cf0',
  '#0f9d63',
  '#e0821b',
  '#d94a86',
  '#14a5a5',
] as const;

export function seriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

/** Metric colours. Revenue/cost/profit must stay distinguishable together. */
export const METRIC_COLORS = {
  stock: '#0aa5ec',
  cost: '#dc3a45',
  revenue: '#7c5cf0',
  profit: '#0f9d63',
  price: '#e0821b',
} as const;

export interface ChartChrome {
  grid: string;
  tick: string;
  axisLine: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipBorder: string;
  cursorFill: string;
}

const LIGHT_CHROME: ChartChrome = {
  grid: '#e3eaf3',
  tick: '#64798f',
  axisLine: '#cddaea',
  tooltipBackground: '#0e1c2b',
  tooltipText: '#f6fafd',
  tooltipBorder: '#e3eaf3',
  cursorFill: 'rgba(14,28,43,0.04)',
};

const DARK_CHROME: ChartChrome = {
  grid: '#203549',
  tick: '#93a9bd',
  axisLine: '#2b445c',
  tooltipBackground: '#1d3348',
  tooltipText: '#eaf2f9',
  tooltipBorder: '#2b445c',
  cursorFill: 'rgba(255,255,255,0.06)',
};

export function getChartChrome(theme: Theme): ChartChrome {
  return theme === 'dark' ? DARK_CHROME : LIGHT_CHROME;
}

/** Recharts grid props, so every chart's gridlines match. */
export function rechartsGrid(chrome: ChartChrome) {
  return {
    stroke: chrome.grid,
    strokeDasharray: '3 3',
    vertical: false,
  } as const;
}

/** Recharts axis props, so every chart's ticks match. */
export function rechartsAxis(chrome: ChartChrome) {
  return {
    stroke: chrome.grid,
    tick: { fontSize: 11, fill: chrome.tick },
    tickLine: false,
  } as const;
}
