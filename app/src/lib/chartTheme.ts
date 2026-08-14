import type { Theme } from './theme';

/**
 * Shared chart language for Chart.js (bar charts) and Recharts (profit report).
 * Two libraries, one palette — a bottle type or a metric keeps the same colour
 * wherever it appears, including the exported PDF.
 *
 * Values are duplicated as literals rather than read from the CSS tokens because
 * canvas cannot resolve custom properties, and Recharts passes colours as SVG
 * attributes, where `var()` does not resolve either. Keep them in step with
 * globals.css by hand.
 */

/**
 * Series colours are theme-independent: each one was picked to read on both a
 * white and a near-black background, so a bottle type never changes colour when
 * the theme flips.
 */
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

/**
 * Chart chrome — the parts that must follow the theme: grid lines, tick labels,
 * tooltip surface and the hover cursor.
 */
export interface ChartChrome {
  grid: string;
  tick: string;
  axisLine: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipBorder: string;
  /** Fill for the bar-hover highlight behind a column. */
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
  // Lighter than the card it floats over, so the tooltip reads as raised.
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
