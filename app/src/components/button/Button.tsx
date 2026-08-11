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
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl
        font-semibold uppercase text-sm tracking-[0.2em]
        transition-all duration-200 shadow-md
        ${
          loading || disabled
            ? 'btn-primary opacity-70 cursor-not-allowed'
            : 'btn-primary cursor-pointer hover:-translate-y-0.5 hover:shadow-lg'
        }
        text-white ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{label}</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}
