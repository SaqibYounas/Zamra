'use client';

import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
}

export default function Button({
  label,
  loading = false,
  type = 'submit',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold uppercase text-sm tracking-[0.2em] transition-all shadow-md cursor-pointer
        ${
          loading || disabled
            ? 'bg-(--color-disabled) cursor-not-allowed'
            : 'btn-primary hover:-translate-y-0.5'
        }
        text-white ${className}`}
    >
      {loading ? <Loader2 className="animate-spin" /> : label}
    </button>
  );
}
