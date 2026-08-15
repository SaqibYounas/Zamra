'use client';

import { Moon, Sun } from 'lucide-react';
import { toggleTheme } from '../../lib/theme';
export function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Switch between light and dark"
      aria-label="Switch between light and dark theme"
      className={`btn btn-secondary size-9 shrink-0 p-0 ${className}`}
    >
      <Sun className="theme-icon-light size-4" aria-hidden />
      <Moon className="theme-icon-dark size-4" aria-hidden />
    </button>
  );
}
