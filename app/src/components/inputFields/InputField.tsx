import { ChangeEvent, JSX } from 'react';
import { LucideIcon } from 'lucide-react';

interface WaterInputFieldProps {
  label: string;
  icon: LucideIcon;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  dark?: boolean;
  togglePassword?: () => void;
  showPassword?: boolean;
  iconToggle?: { show: JSX.Element; hide: JSX.Element };
}

export default function WaterInputField({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  error,
  dark = false,
  togglePassword,
  showPassword,
  iconToggle,
}: WaterInputFieldProps) {
  return (
    <div className="mb-4">
      <label
        className={`block text-sm font-medium mb-1.5 ${dark ? 'text-blue-200' : 'text-slate-700'}`}
      >
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${dark ? 'text-blue-400 group-focus-within:text-blue-300' : 'text-blue-400 group-focus-within:text-blue-600'}`}
        >
          <Icon size={18} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-10 py-3 rounded-2xl border transition-all focus:outline-none ${
            dark
              ? 'bg-blue-950/50 border-blue-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
              : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'
          } ${error ? 'border-red-500' : ''}`}
        />
        {type === 'password' || type === 'text'
          ? togglePassword && (
              <button
                type="button"
                onClick={togglePassword}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${dark ? 'text-blue-400 hover:text-blue-200 cursor-pointer' : 'text-slate-400 hover:text-blue-600 '}`}
              >
                {showPassword ? iconToggle?.show : iconToggle?.hide}
              </button>
            )
          : null}
      </div>
      {error && (
        <p className="mt-1.5 pl-4 text-xs text-red-500 flex items-center gap-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
