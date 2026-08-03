'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}: DropdownProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="w-full mb-5">
      {label && (
        <label className="block mb-1 text-sm font-bold text-slate-700">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-pointer rounded-xl border bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm sm:text-sm ${
              disabled ? 'cursor-no t-allowed opacity-60' : ''
            }`}
          >
            <span className="block truncate font-semibold">
              {selectedOption?.label || placeholder || 'Select'}
            </span>

            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={18} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-center text-sm text-gray-500">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${
                        active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-bold' : 'font-normal'
                          }`}
                        >
                          {option.label}
                        </span>

                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                            <Check size={18} />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
