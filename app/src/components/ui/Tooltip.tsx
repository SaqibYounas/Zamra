'use client';

import { useId, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

export function Tooltip({
  content,
  children,
  side = 'top',
  className = '',
}: {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={id} className="inline-flex">
        {children}
      </span>

      <span
        role="tooltip"
        id={id}
        hidden={!open}
        className={`pointer-events-none absolute left-1/2 z-[60] w-max max-w-[14rem] -translate-x-1/2 animate-pop-in rounded-md bg-marine-950 px-2.5 py-1.5 text-2xs font-medium leading-snug text-ink-invert shadow-pop ${
          side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
        }`}
      >
        {content}
      </span>
    </span>
  );
}

/** Small `i` affordance for explaining a metric or an abbreviation. */
export function InfoHint({ content }: { content: string }) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        aria-label="More information"
        className="flex size-4 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-brand-600"
      >
        <Info className="size-3.5" />
      </button>
    </Tooltip>
  );
}
