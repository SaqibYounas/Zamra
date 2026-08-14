'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, LayoutDashboard, RefreshCw } from 'lucide-react';

import { PageContainer } from '@/app/src/components/layout/PageShell';
import { Card, CardBody } from '@/app/src/components/ui/Card';
import Button from '@/app/src/components/ui/Button';

/**
 * Error boundary for the dashboard group: keeps the navigation shell usable
 * and offers a re-render before falling back to a full navigation.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard route error:', error);
  }, [error]);

  return (
    <PageContainer width="form">
      <Card>
        <CardBody className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
            <AlertTriangle className="size-6" />
          </span>

          <div className="max-w-md space-y-1.5">
            <h1 className="text-lg font-semibold text-ink">
              This page ran into a problem
            </h1>
            <p className="text-sm leading-relaxed text-ink-muted">
              The page could not finish loading. Trying again usually clears it;
              if it keeps happening, contact your administrator.
            </p>
          </div>

          {error?.digest ? (
            <p className="rounded-field bg-surface-sunken px-3 py-1.5 font-mono text-2xs text-ink-faint">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
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
              <LayoutDashboard className="size-4" />
              Back to dashboard
            </Link>
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
