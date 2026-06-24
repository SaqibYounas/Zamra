'use client';

import React from 'react';
import { Field, Label, Input, Description } from '@headlessui/react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string; // Optional message string for inline error flags
}

export default function FormInput({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  error = '',
}: FormInputProps) {
  return (
    <Field className="flex flex-col gap-1.5 w-full">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-700 outline-none transition-all focus:ring-2 ${
          error
            ? 'border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-500'
        }`}
      />
      {error && (
        <Description className="text-[11px] font-semibold text-rose-600 mt-0.5">
          {error}
        </Description>
      )}
    </Field>
  );
}
