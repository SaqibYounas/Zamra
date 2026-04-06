'use client';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
}

export default function Button({
  label,
  loading = false,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-sm tracking-wider transition-all shadow-lg shadow-[rgba(56,189,248,0.15)]
        ${loading || disabled ? 'bg-(--color-disabled) cursor-not-allowed' : 'bg-(--color-primary) hover:bg-(--color-primary-strong)'}
        text-white ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" /> : label}
    </button>
  );
}
