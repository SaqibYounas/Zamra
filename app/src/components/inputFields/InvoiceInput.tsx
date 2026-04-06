'use client';

import { ChangeEvent } from 'react';

interface InvoiceInputProps {
  value: string | number;
  onValueChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  prefix?: string;
  label?: string;
  textarea?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  title?: string;
}

export default function InvoiceInput({
  value,
  onValueChange,
  type = 'text',
  placeholder = '',
  prefix,
  label,
  textarea = false,
  rows = 1,
  className = '',
  inputClassName = '',
  wrapperClassName = '',
  title,
}: InvoiceInputProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    onValueChange(event.target.value);
  };

  return (
    <div className={`min-w-0 ${wrapperClassName}`}>
      {label ? (
        <label className="block mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </label>
      ) : null}
      <div className={`flex items-center gap-2 ${className}`}>
        {prefix ? (
          <span className="text-[11px] font-semibold text-slate-500">
            {prefix}
          </span>
        ) : null}
        {textarea ? (
          <textarea
            value={String(value)}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            title={title}
            className={`w-full bg-transparent border-none focus:ring-0 resize-none text-slate-700 ${inputClassName}`}
          />
        ) : (
          <input
            type={type}
            value={String(value)}
            onChange={handleChange}
            placeholder={placeholder}
            title={title}
            className={`w-full bg-transparent border-none focus:ring-0 text-slate-700 ${inputClassName}`}
          />
        )}
      </div>
    </div>
  );
}
