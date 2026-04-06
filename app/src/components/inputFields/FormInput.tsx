'use client';

import { ChangeEvent } from 'react';

interface FormInputProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'date' | 'email' | 'password';
  placeholder?: string;
  prefix?: string;
  className?: string;
  inputClassName?: string;
  title?: string;
  textarea?: boolean;
  rows?: number;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  prefix,
  className = '',
  inputClassName = '',
  title,
  textarea = false,
  rows = 3,
}: FormInputProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nextValue =
      type === 'number' ? Number(event.target.value) : event.target.value;
    onChange(nextValue);
  };

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="block mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-(--color-muted)">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          rows={rows}
          title={title}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`w-full rounded-2xl border border-surface bg-surface px-3 py-2 text-sm text-text focus-border-primary focus-ring-primary focus:outline-none ${inputClassName}`}
        />
      ) : (
        <div className="relative">
          {prefix && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-slate-400">
              {prefix}
            </span>
          )}
          <input
            type={type}
            title={title}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className={`w-full rounded-2xl border border-surface bg-surface px-3 py-2 text-sm text-text focus-border-primary focus-ring-primary focus:outline-none ${prefix ? 'pl-10' : ''} ${inputClassName}`}
          />
        </div>
      )}
    </div>
  );
}
