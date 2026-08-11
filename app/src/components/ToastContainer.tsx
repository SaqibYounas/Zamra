'use client';

import { useEffect, useState } from 'react';
import { subscribeApiToast, type ApiToast } from '../lib/apiToast';
import { X } from 'lucide-react';

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

    return () => unsubscribe();
  }, []);

  if (toasts.length === 0) return null;
  const removeToast = (id: string | number) => {
    setToasts((current) =>
      current.filter((toast) => String(toast.id) !== String(id))
    );
  };
  return (
    <div className="fixed top-3 right-3 left-3 sm:left-auto sm:right-4 sm:top-4 z-[9999] flex flex-col gap-3 sm:w-[380px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`group relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl animate-[toastSlideIn_0.35s_ease-out]
            
            ${
              toast.type === 'error'
                ? 'border-red-400/30 bg-gradient-to-r from-red-600 via-red-500 to-rose-500'
                : toast.type === 'info'
                  ? 'border-blue-400/30 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500'
                  : 'border-emerald-400/30 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500'
            }
          `}
        >
          <div className="absolute inset-0 bg-white/5" />

          <div className="relative flex items-start gap-3 p-4 sm:p-5">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-white shadow-lg" />

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm sm:text-base">
                {toast.title}
              </h4>

              <p className="mt-1 text-xs sm:text-sm text-white/90 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1.5 text-white/80 transition-all hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Close toast"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-1 bg-white/20">
            <div className="h-full bg-white/70 animate-[toastProgress_5s_linear]" />
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
