'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Droplets, Home, RefreshCw } from 'lucide-react';
import Button from './src/components/ui/Button';

/**
 * Root error boundary. Rendered outside the dashboard shell, so it carries its
 * own brand mark and full-page layout.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-center gap-2 text-ink-muted">
          <Droplets className="size-4 text-brand-600" />
          <span className="text-2xs font-semibold uppercase tracking-[0.14em]">
            Zamra Water
          </span>
        </div>

        <div className="surface-panel p-6 text-center sm:p-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
            <AlertTriangle className="size-6" />
          </span>

          <h1 className="mt-4 text-xl font-semibold text-ink">
            Something went wrong
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            An unexpected error stopped the portal from rendering this view. You
            can retry straight away — your saved data is unaffected.
          </p>

          {error?.digest ? (
            <p className="mx-auto mt-4 w-fit rounded-field bg-surface-sunken px-3 py-1.5 font-mono text-2xs text-ink-faint">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              type="button"
              label="Try again"
              onClick={reset}
              icon={<RefreshCw className="size-4" />}
            />
            <Link
              href="/dashboard"
              className="btn btn-secondary h-11 px-4 text-sm"
            >
              <Home className="size-4" />
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
