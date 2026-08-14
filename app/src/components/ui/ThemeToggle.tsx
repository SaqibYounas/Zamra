'use client';

import { Moon, Sun } from 'lucide-react';
import { toggleTheme } from '../../lib/theme';

/**
 * One-click light/dark switch.
 *
 * Holds no React state on purpose. The current theme lives on `<html>`, the two
 * icons are swapped by CSS, and the click handler reads the document to decide
 * which way to flip. Consequences worth keeping:
 *
 * - no hydration mismatch, even though the server cannot know the theme
 * - the right icon is showing before React has hydrated
 * - no re-render of the tree when the theme changes; the CSS does the work
 *
 * The accessible name is direction-neutral for the same reason — it does not
 * have to be re-rendered when the theme flips.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Switch between light and dark"
      aria-label="Switch between light and dark theme"
      className={`btn btn-secondary size-9 shrink-0 p-0 ${className}`}
    >
      {/* Exactly one of these is visible; see the rules in globals.css. */}
      <Sun className="theme-icon-light size-4" aria-hidden />
      <Moon className="theme-icon-dark size-4" aria-hidden />
    </button>
  );
}
