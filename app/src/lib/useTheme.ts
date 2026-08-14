'use client';

import { useSyncExternalStore } from 'react';
import { getTheme, subscribeTheme, type Theme } from './theme';

/**
 * Subscribes a component to the active theme.
 *
 * Only needed by code that cannot express itself in CSS — the canvas and SVG
 * charts, whose colours are passed as JavaScript values. Anything styled with
 * utility classes flips on its own and must not call this.
 *
 * Split from `theme.ts` because that module is also imported by the root layout,
 * a server component, which cannot import React hooks.
 *
 * The server snapshot is `light`. That is safe because every chart renders a
 * skeleton until its data arrives client-side, so no theme-dependent markup is
 * produced during SSR and there is nothing for hydration to mismatch.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, getTheme, () => 'light');
}
