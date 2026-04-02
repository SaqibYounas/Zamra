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
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-sm tracking-wider transition-all shadow-lg shadow-blue-500/10
        ${loading || disabled ? 'bg-slate-800 cursor-not-allowed' : 'bg-sky-400 hover:bg-sky-500'}
        text-white ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" /> : label}
    </button>
  );
}
