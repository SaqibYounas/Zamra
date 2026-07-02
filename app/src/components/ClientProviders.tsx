'use client';

import { useEffect, type ReactNode } from 'react';
import { setupApiToastInterceptors } from '../lib/apiToast';
import { attachAuthTokenToAxios } from '../lib/auth';
import { ToastContainer } from './ToastContainer';

export function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    setupApiToastInterceptors();
    attachAuthTokenToAxios();
  }, []);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
