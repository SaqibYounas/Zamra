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
    <div className="w-full max-w-md sm:max-w-lg mx-auto p-5 sm:p-6 md:p-8 bg-linear-to-br from-slate-900/90 to-slate-800/90 rounded-3xl shadow-xl border border-slate-700/50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-20" />

      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
          <Factory size={24} />
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Admin Control
          </h3>

          <p className="text-xs sm:text-sm text-sky-300  tracking-wider font-medium mt-1">
            Authorized Personnel Only
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
          placeholder="Enter your password"
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

        <div className="p-4 bg-slate-700/40 border border-slate-600/40 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-300 text-sm mb-2">
            <CloudRain size={16} />
            <span className="font-medium">System Status</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-400">
              Filtration Units
            </span>

            <span className="text-xs sm:text-sm font-semibold text-green-400">
              Online
            </span>
          </div>
        </div>

        <AppButton
          type="submit"
          label={loading ? 'Logging...' : 'Login'}
          loading={loading}
          className="w-full h-12 text-sm sm:text-base font-semibold btn-primary text-white shadow-md hover:shadow-lg transition-all duration-200"
        />
      </form>
    </div>
  );
}
