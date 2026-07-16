'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import { changePassword } from '../services/changePassword';
import { showApiToast } from '@/app/src/lib/apiToast';

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState<PasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (field: keyof PasswordForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const submitForm = async () => {
    const localErrors: Record<string, string> = {};

    if (!formData.oldPassword.trim()) {
      localErrors.oldPassword = 'Current password parameter is required.';
    }

    if (!formData.newPassword.trim()) {
      localErrors.newPassword = 'New password parameter cannot be blank.';
    }

    if (!formData.confirmPassword.trim()) {
      localErrors.confirmPassword =
        'Please repeat the new password confirmation.';
    }

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setFieldErrors({
        confirmPassword: 'New password and confirmation do not match.',
      });
      return;
    }

    try {
      setLoading(true);

      const response = (await changePassword(
        formData.oldPassword,
        formData.newPassword
      )) as ChangePasswordResponse;

      if (response && response.success === false) {
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      const errorObject = err as Error;

      showApiToast(
        errorObject?.message ||
          'An error occurred while changing the password.',
        'error'
      );
    } finally {
      setLoading(false);
    }
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
  }, [loading, formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitForm();
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-6 px-4 sm:py-8 sm:px-6 lg:px-8 md:ml-16">
      <main className="w-full max-w-md sm:max-w-xl lg:max-w-2xl rounded-2xl bg-gray-50 p-5 sm:p-8 lg:p-10 ring-1 shadow-lg border border-gray-200/50">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            Change Password
          </h1>
        </div>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <WaterInputField
            name="oldPassword"
            label="Current Password"
            type={showPassword.oldPassword ? 'text' : 'password'}
            icon={KeyRound}
            value={formData.oldPassword}
            onChange={(e) => handleChange('oldPassword', e.target.value)}
            togglePassword={() => togglePassword('oldPassword')}
            showPassword={showPassword.oldPassword}
            iconToggle={{
              show: <EyeOff size={18} />,
              hide: <Eye size={18} />,
            }}
            placeholder="Enter current password"
            error={fieldErrors.oldPassword}
          />

          <WaterInputField
            name="newPassword"
            label="New Password"
            type={showPassword.newPassword ? 'text' : 'password'}
            icon={Lock}
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            togglePassword={() => togglePassword('newPassword')}
            showPassword={showPassword.newPassword}
            iconToggle={{
              show: <EyeOff size={18} />,
              hide: <Eye size={18} />,
            }}
            placeholder="Enter new password"
            error={fieldErrors.newPassword}
          />

          <WaterInputField
            name="confirmPassword"
            label="Confirm New Password"
            type={showPassword.confirmPassword ? 'text' : 'password'}
            icon={ShieldCheck}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            togglePassword={() => togglePassword('confirmPassword')}
            showPassword={showPassword.confirmPassword}
            iconToggle={{
              show: <EyeOff size={18} />,
              hide: <Eye size={18} />,
            }}
            placeholder="Repeat new password"
            error={fieldErrors.confirmPassword}
          />

          <Button
            label={loading ? 'Saving...' : 'Save Password'}
            type="submit"
            className="w-full mt-6"
            disabled={loading}
          />
        </form>
      </main>
    </div>
  );
}
