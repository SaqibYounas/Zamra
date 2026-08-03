'use client';

import { ChangeEvent, JSX, KeyboardEvent } from 'react';
import { LucideIcon } from 'lucide-react';
import { Transition } from '@headlessui/react';

interface WaterInputFieldProps {
  label: string;
  customicon?: () => JSX.Element;
  icon?: LucideIcon;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  dark?: boolean;
  togglePassword?: () => void;
  showPassword?: boolean;
  iconToggle?: { show: JSX.Element; hide: JSX.Element };
  name?: string;
  marginBottom?: string;
}

export default function WaterInputField({
  label,
  value,
  onChange,
  onKeyDown,
  icon: Icon,
  customicon,
  type,
  placeholder,
  error,
  dark,
  togglePassword,
  showPassword,
  iconToggle,
  marginBottom = 'mb-4',
}: WaterInputFieldProps) {
  return (
    <div className={`w-full ${marginBottom}`}>
      {label && (
        <label
          className={`mb-1 block text-sm font-bold ${
            dark ? 'text-sky-300' : 'text-slate-700'
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {(Icon || customicon) && (
          <div
            className={`absolute left-0 flex h-[42px] items-center pl-3 ${
              dark ? 'text-sky-400' : 'text-sky-600'
            }`}
          >
            {customicon ? customicon() : Icon && <Icon size={18} />}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`
            h-[42px]
            w-full
            rounded-xl
            border
            text-sm
            transition-all
            focus:outline-none
            focus:ring-2
            ${Icon || customicon ? 'pl-11' : 'pl-3'}
            ${togglePassword ? 'pr-10' : 'pr-3'}
            ${
              dark
                ? 'border-sky-800 bg-sky-950/50 text-white focus:border-sky-500'
                : 'border-slate-300 bg-white text-slate-800 focus:border-sky-700 focus:ring-sky-400'
            }
            ${error ? 'border-red-500' : ''}
          `}
        />

        {togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className={`absolute right-0 flex h-[42px] items-center pr-3 ${
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
          <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>
        )}
      </Transition>
    </div>
  );
}
