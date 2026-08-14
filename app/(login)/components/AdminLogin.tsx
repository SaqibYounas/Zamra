'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';

import TextField from '../../src/components/ui/TextField';
import Button from '../../src/components/ui/Button';
import { Alert } from '../../src/components/ui/Alert';
import { validateEmail } from '../utils/helpers';
import { loginUser } from '../services/api';

interface FormState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
}

const EMPTY_ERRORS = { emailError: '', passwordError: '' };

export default function AdminLogin() {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    ...EMPTY_ERRORS,
  });

  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormState((previous) => ({
      ...previous,
      [field]: value,
      [field === 'email' ? 'emailError' : 'passwordError']: '',
    }));
    setFormError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = { ...EMPTY_ERRORS };

    if (!formState.email.trim()) {
      errors.emailError = 'Email is required.';
    } else if (!validateEmail(formState.email)) {
      errors.emailError = 'Enter a valid email address.';
    }

    if (!formState.password.trim()) {
      errors.passwordError = 'Password is required.';
    }

    if (errors.emailError || errors.passwordError) {
      setFormState((previous) => ({ ...previous, ...errors }));
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const login = await loginUser(formState.email, formState.password);

      if (login.success) {
        router.push('/dashboard');
        return;
      }

      // Attribute the backend message to a field when it clearly belongs to
      // one; otherwise surface it once, above the form.
      const message = login.message || 'Invalid email or password.';
      const lower = message.toLowerCase();

      setFormState((previous) => ({
        ...previous,
        emailError: lower.includes('email') ? message : '',
        passwordError: lower.includes('password') ? message : '',
      }));

      if (!lower.includes('email') && !lower.includes('password')) {
        setFormError(message);
      }
    } catch (error) {
      setFormError(
        (error as Error)?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-panel p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink">Sign in</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Use your administrator credentials to open the portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError ? <Alert tone="danger">{formError}</Alert> : null}

        <TextField
          name="email"
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="admin@zamrawater.com"
          value={formState.email}
          onChange={(event) => handleChange('email', event.target.value)}
          error={formState.emailError}
          required
        />

        <TextField
          name="password"
          label="Password"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={formState.password}
          onChange={(event) => handleChange('password', event.target.value)}
          togglePassword={() => setShowPassword((current) => !current)}
          showPassword={showPassword}
          iconToggle={{
            show: <EyeOff className="size-4" />,
            hide: <Eye className="size-4" />,
          }}
          error={formState.passwordError}
          required
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          label="Sign in"
          loadingLabel="Signing in…"
          loading={loading}
          icon={<LogIn className="size-4" />}
          className="mt-2"
        />
      </form>
    </div>
  );
}
