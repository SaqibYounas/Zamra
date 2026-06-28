'use client';

import { ChangeEvent, JSX, Fragment } from 'react';
import { LucideIcon } from 'lucide-react';
import { Transition } from '@headlessui/react';

interface WaterInputFieldProps {
  label: string;
  customicon?: () => JSX.Element;
  icon?: LucideIcon;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  dark?: boolean;
  togglePassword?: () => void;
  showPassword?: boolean;
  iconToggle?: { show: JSX.Element; hide: JSX.Element };
  name?: string;
}

export default function WaterInputField({
  label,
  value,
  onChange,
  icon: Icon,
  customicon: customicon,
  type,
  placeholder,
  error,
  dark,
  togglePassword,
  showPassword,
  iconToggle,
}: WaterInputFieldProps) {
  return (
    <div className="mb-4 w-full">
      <label
        className={`block mb-1 text-sm  font-bold ${
          dark ? 'text-sky-300' : 'text-slate-700'
        }`}
      >
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-600">
          {customicon ? customicon() : Icon && <Icon size={18} />}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full ${Icon || customicon ? 'pl-12' : 'pl-3'} pr-10 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-2 ${
            dark
              ? 'bg-sky-950/50 border-sky-800 text-white  focus:border-sky-500'
              : 'bg-white border-slate-300 text-slate-800 focus:ring-sky-400 focus:border-sky-700'
          } ${error ? 'border-red-500 ' : ''}`}
        />

        {(type === 'password' || type === 'text') && togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ${
              dark
                ? 'text-sky-400 hover:text-sky-200'
                : 'text-slate-400 hover:text-sky-600'
            }`}
          >
            {showPassword ? iconToggle?.show : iconToggle?.hide}
          </button>
        )}
      </div>

      <Transition
        as="div"
        show={!!error}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {error && (
          <p className="mt-1.5 text-xs text-red-400 pl-4 flex items-center gap-1 font-bold ">
            {error}
          </p>
        )}
      </Transition>
    </div>
  );
}
