'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { subscribeApiToast, type ApiToast } from '../../lib/apiToast';

const TOAST_DURATION = 5000;
/** Hard cap so a burst of API errors can never cover the whole screen. */
const MAX_VISIBLE = 3;

const TONES = {
  success: {
    icon: CheckCircle2,
    accent: 'bg-success',
    iconClass: 'bg-success-soft text-success-ink',
  },
  error: {
    icon: AlertCircle,
    accent: 'bg-danger',
    iconClass: 'bg-danger-soft text-danger-ink',
  },
  info: {
    icon: Info,
    accent: 'bg-info',
    iconClass: 'bg-info-soft text-info-ink',
  },
} as const;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ApiToast[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const pending = timers.current;

    const unsubscribe = subscribeApiToast((toast) => {
      setToasts((current) => [...current, toast].slice(-MAX_VISIBLE));

      pending.set(
        toast.id,
        setTimeout(() => dismiss(toast.id), TOAST_DURATION)
      );
    });

    return () => {
      unsubscribe();
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, [dismiss]);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-3 top-3 z-[200] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-[24rem]"
    >
      {toasts.map((toast) => {
        const tone = TONES[toast.type] ?? TONES.info;
        const Icon = tone.icon;

        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex animate-toast-in gap-3 overflow-hidden rounded-card border border-line bg-surface p-3.5 shadow-pop"
          >
            <span
              className={`mt-px flex size-8 shrink-0 items-center justify-center rounded-field ${tone.iconClass}`}
            >
              <Icon className="size-4" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[0.8125rem] font-semibold text-ink">
                {toast.title}
              </p>
              <p className="mt-0.5 break-words text-xs leading-relaxed text-ink-muted">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink-soft"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
