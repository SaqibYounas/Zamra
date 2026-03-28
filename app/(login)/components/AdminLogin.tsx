'use client';
import { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Factory,
  CloudRain,
  Eye,
  EyeOff,
} from 'lucide-react';
import WaterInputField from '../../src/components/inputFields/InputField';
import AppButton from '../../src/components/button/Button';

interface FormState {
  operatorId: string;
  accessToken: string;
  emailError: string;
  passwordError: string;
}

export default function PlantAdminForm() {
  const [formState, setFormState] = useState<FormState>({
    operatorId: '',
    accessToken: '',
    emailError: '',
    passwordError: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'operatorId' && { emailError: '' }),
      ...(field === 'accessToken' && { passwordError: '' }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const errors: Partial<FormState> = {};

    if (!formState.operatorId) {
      errors.emailError = 'Email is required';
      hasError = true;
    } else if (!validateEmail(formState.operatorId)) {
      errors.emailError = 'Invalid email address';
      hasError = true;
    }

    if (!formState.accessToken) {
      errors.passwordError = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      setFormState((prev) => ({ ...prev, ...errors }));
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl p-4 sm:p-6 md:p-8 lg:p-10 bg-linear-to-br from-slate-900/90 to-slate-800/90 rounded-3xl shadow-xl border border-slate-700/50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>

      <div className="flex items-center gap-3 mb-6 sm:mb-8 md:mb-10">
        <div className="p-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
          <Factory size={22} />
        </div>
        <div>
          <h3 className="text-lg sm:text-base md:text-lg font-bold text-white leading-none">
            Admin Control
          </h3>
          <p className="text-[10px] sm:text-[9px] md:text-[10px] text-blue-300 uppercase tracking-widest font-bold mt-1">
            Authorized Person Only
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5 md:space-y-6"
      >
        <WaterInputField
          dark
          label="Email"
          icon={ShieldCheck}
          type="text"
          placeholder="abc@email.com"
          value={formState.operatorId}
          onChange={(e) => handleChange('operatorId', e.target.value)}
          error={formState.emailError}
        />
        <WaterInputField
          dark
          label="Password"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter the Password"
          value={formState.accessToken}
          onChange={(e) => handleChange('accessToken', e.target.value)}
          togglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
          iconToggle={{ show: <EyeOff size={18} />, hide: <Eye size={18} /> }}
          error={formState.passwordError}
        />
        <div className="p-3 sm:p-4 md:p-4 bg-slate-700/40 border border-slate-600/40 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-300 text-xs mb-1">
            <CloudRain size={14} /> <span>System Status</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-[9px] md:text-[10px] text-slate-400 pl-6">
              Filtration Units
            </span>
            <span className="text-[10px] sm:text-[9px] md:text-[10px] font-bold text-green-400">
              Online
            </span>
          </div>
        </div>
        ={' '}
        <AppButton
          label="Login"
          loading={loading}
          className="w-full bg-sky-400 hover:bg-sky-500 text-white shadow-md hover:shadow-lg transition-all"
        />
      </form>
    </div>
  );
}
