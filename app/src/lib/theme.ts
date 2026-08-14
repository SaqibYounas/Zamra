/**
 * Light/dark theme handling.
 *
 * The `data-theme` attribute on `<html>` is the single source of truth: the CSS
 * in globals.css keys off it, and this module reads it back rather than keeping
 * a parallel copy in React state. That means the toggle needs no state at all,
 * and there is nothing to get out of sync.
 *
 * Resolution order:
 *   1. an explicit choice the user made before (localStorage)
 *   2. otherwise the operating system setting
 *
 * Deliberately free of React imports: the root layout is a server component and
 * imports `themeInitScript` from here. The `useTheme` hook lives next door in
 * `useTheme.ts`, which is marked `'use client'`.
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'zamra:theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Runs in `<head>` before the first paint, so the correct theme is applied
 * before anything renders. Without this the page would paint light and then
 * flip to dark, which is the flash every themed app has to design away.
 *
 * Kept as a compact string because it is inlined into the document; it must not
 * throw when storage is blocked (private mode), hence the try/catch.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s==='dark'||(!s&&window.matchMedia('${DARK_QUERY}').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** The theme currently applied to the document. */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  notify();
}

/** Switches theme and remembers the choice. */
export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable: the choice applies for this session only.
  }

  applyTheme(theme);
}

/** One-click flip between light and dark. */
export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

/**
 * Follows the OS setting for as long as the user has not chosen explicitly.
 * Returns a cleanup function; call it from an effect.
 */
export function watchSystemTheme(): () => void {
  const media = window.matchMedia(DARK_QUERY);

  const onChange = (event: MediaQueryListEvent) => {
    let stored: string | null = null;

    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // Treated as "no explicit choice".
    }

    // An explicit choice always wins over the OS.
    if (stored === 'light' || stored === 'dark') return;

    applyTheme(event.matches ? 'dark' : 'light');
  };

  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/** Subscribes to theme changes. Consumed by the `useTheme` hook. */
export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
