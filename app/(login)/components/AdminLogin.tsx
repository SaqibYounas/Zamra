'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { validateEmail } from '../utils/helpers';
import { loginUser } from '../services/api';

interface FormState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
}

export default function AdminForm() {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,

      ...(field === 'email' && {
        emailError: '',
      }),

      ...(field === 'password' && {
        passwordError: '',
      }),
    }));
  };

  const submitForm = async () => {
    let hasError = false;

    const errors: Partial<FormState> = {};

    if (!formState.email.trim()) {
      errors.emailError = 'Email is required';

      hasError = true;
    } else if (!validateEmail(formState.email)) {
      errors.emailError = 'Invalid email';

      hasError = true;
    }

    if (!formState.password.trim()) {
      errors.passwordError = 'Password is required';

      hasError = true;
    }

    if (hasError) {
      setFormState((prev) => ({
        ...prev,
        ...errors,
      }));

      return;
    }

    setLoading(true);

    try {
      const login = await loginUser(formState.email, formState.password);

      if (login.success) {
        router.push('/dashboard');
      } else {
        const message = login.message || '';

        setFormState((prev) => ({
          ...prev,
          emailError: message.toLowerCase().includes('email') ? message : '',

          passwordError: message.toLowerCase().includes('password')
            ? message
            : '',
        }));
      }
    } catch (error) {
      const err = error as Error;

      setFormState((prev) => ({
        ...prev,

        passwordError: err.message || 'Invalid email or password',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await submitForm();
  };

  useEffect(() => {
    const handleGlobalEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        e.preventDefault();

        submitForm();
      }
    };

    window.addEventListener('keydown', handleGlobalEnter);

    return () => {
      window.removeEventListener('keydown', handleGlobalEnter);
    };
  }, [loading, formState]);

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-linear-to-br from-slate-900/90 to-slate-800/90 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>

      <div className="flex items-center gap-3 mb-5 sm:mb-7 md:mb-10">
        <div className="p-2 sm:p-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg sm:rounded-xl">
          <Factory size={20} className="sm:w-[22px] sm:h-[22px]" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight">
            Admin Control
          </h3>

          <p className="text-[10px] sm:text-xs md:text-sm text-sky-300 uppercase tracking-widest font-semibold mt-1">
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
          value={formState.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={formState.emailError}
        />

        <WaterInputField
          dark
          label="Password"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter the Password"
          value={formState.password}
          onChange={(e) => handleChange('password', e.target.value)}
          togglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
          iconToggle={{
            show: <EyeOff size={18} />,

            hide: <Eye size={18} />,
          }}
          error={formState.passwordError}
        />

        <div className="p-3 sm:p-4 bg-slate-700/40 border border-slate-600/40 rounded-xl sm:rounded-2xl">
          <div className="flex items-center gap-2 text-blue-300 text-xs sm:text-sm mb-1">
            <CloudRain size={14} />

            <span>System Status</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 pl-5 sm:pl-6">
              Filtration Units
            </span>

            <span className="text-[10px] sm:text-xs font-bold text-green-400">
              Online
            </span>
          </div>
        </div>

        <AppButton
          type="submit"
          label={loading ? 'Logging in...' : 'Login'}
          loading={loading}
          className="w-full text-sm sm:text-base btn-primary text-white shadow-md hover:shadow-lg transition-all"
        />
      </form>
    </div>
  );
}
