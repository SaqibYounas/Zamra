'use client';

import { useEffect, type ReactNode } from 'react';
import { setupApiToastInterceptors } from '../../lib/apiToast';
import { watchSystemTheme } from '../../lib/theme';
import { ToastContainer } from '../ui/ToastContainer';

/**
 * App-wide client setup: the axios toast interceptors and the OS theme watcher.
 *
 * The theme itself is applied before paint by the inline script in the root
 * layout; this only keeps the app in step if the OS switches while it is open
 * and the user has not made an explicit choice.
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    setupApiToastInterceptors();
  }, []);

  useEffect(() => watchSystemTheme(), []);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
