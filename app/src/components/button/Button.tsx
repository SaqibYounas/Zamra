'use client';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  label: string;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  label,
  loading = false,
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full cursor-pointer py-4 bg-sky-400  disabled:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-3 cursor-pointer${className}`}
    >
      {loading ? <Loader2 className="animate-spin" /> : label}
    </button>
  );
}
