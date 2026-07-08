'use client';

import { useEffect, useState } from 'react';
import { subscribeApiToast, type ApiToast } from '../lib/apiToast';

export function ToastContainer() {
  const [toasts, setToasts] = useState<ApiToast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeApiToast((toast) => {
      setToasts((currentToasts) => [...currentToasts, toast]);

      window.setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((item) => item.id !== toast.id)
        );
      }, 5000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-[slideIn_0.3s_ease-out] rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
            toast.type === 'error'
              ? 'border-red-200 bg-gradient-to-r from-rose-600 to-red-500 text-white'
              : toast.type === 'info'
                ? 'border-sky-200 bg-gradient-to-r from-sky-600 to-blue-500 text-white'
                : 'border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-500 text-white'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-white/80" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">{toast.title}</p>
              <p className="mt-0.5 text-sm leading-5 text-white/95">
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
