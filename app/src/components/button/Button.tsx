'use client';
import { Loader2 } from 'lucide-react';
import { Fragment } from 'react';
import { Button as HeadlessButton } from '@headlessui/react';

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
    <HeadlessButton as={Fragment} disabled={disabled || loading}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-sm tracking-wider transition-all shadow-lg shadow-blue-500/10
          ${loading || disabled ? 'bg-slate-800 cursor-not-allowed' : 'bg-sky-400 hover:bg-sky-500'}
          text-white ${className}`}
      >
        {loading ? <Loader2 className="animate-spin" /> : label}
      </button>
    </HeadlessButton>
  );
}
