'use client';

import { useEffect, type ReactNode } from 'react';
import { setupApiToastInterceptors } from '../lib/apiToast';
import { ToastContainer } from './ToastContainer';

export function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    setupApiToastInterceptors();
  }, []);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
