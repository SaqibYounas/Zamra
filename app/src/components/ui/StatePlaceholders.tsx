'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw, WifiOff } from 'lucide-react';
import Button from './Button';

type PlaceholderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: 'inline' | 'block';
};

function Placeholder({
  title,
  description,
  icon,
  action,
  className = '',
  size = 'inline',
  tone,
}: PlaceholderProps & { tone: 'neutral' | 'danger' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${
        size === 'block' ? 'px-6 py-16' : 'px-4 py-10'
      } ${className}`}
    >
      <span
        className={`flex size-11 items-center justify-center rounded-full ${
          tone === 'danger'
            ? 'bg-danger-soft text-danger'
            : 'bg-surface-sunken text-ink-faint'
        }`}
      >
        {icon}
      </span>

      <div className="max-w-sm space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description ? (
          <p className="text-xs leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>

      {action}
    </div>
  );
}

/** Shown when a list or table has no rows yet. */
export function EmptyState({
  icon = <Inbox className="size-5" />,
  ...props
}: PlaceholderProps) {
  return <Placeholder tone="neutral" icon={icon} {...props} />;
}
export function ErrorState({
  title = 'Could not load this data',
  description = 'The request did not complete. Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
  retrying = false,
  size = 'inline',
  className = '',
  offline = false,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  retrying?: boolean;
  size?: 'inline' | 'block';
  className?: string;
  offline?: boolean;
}) {
  return (
    <Placeholder
      tone="danger"
      size={size}
      className={className}
      title={title}
      description={description}
      icon={
        offline ? (
          <WifiOff className="size-5" />
        ) : (
          <AlertTriangle className="size-5" />
        )
      }
      action={
        onRetry ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            label={retryLabel}
            loading={retrying}
            onClick={onRetry}
            icon={<RefreshCw className="size-3.5" />}
          />
        ) : undefined
      }
    />
  );
}
