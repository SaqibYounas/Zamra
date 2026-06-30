'use client';

import React, { useState } from 'react';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import { changePassword } from '../services/changePassword';

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

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage('');
    setError('');

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
        confirmPassword: 'New password and confirmation logic do not match.',
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
        setError(
          response.message || 'An error occurred while changing the password.'
        );
      } else {
        setMessage(response.message || 'Password updated successfully.');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      const errorObject = err as Error;
      setError(
        errorObject?.message || 'An error occurred while changing the password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:py-8 sm:px-6 lg:px-8 md:ml-16">
      <main className="w-full max-w-md sm:max-w-xl lg:max-w-2xl rounded-2xl bg-gray-50 p-5 sm:p-8 lg:p-10 shadow-lg border border-gray-200/50">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 text-center">
            Change Password
          </h1>
        </div>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <WaterInputField
            name="oldPassword"
            label="Current Password"
            type="password"
            icon={KeyRound}
            value={formData.oldPassword}
            onChange={(e) => handleChange('oldPassword', e.target.value)}
            placeholder="Enter current password"
            error={fieldErrors.oldPassword}
          />

          <WaterInputField
            name="newPassword"
            label="New Password"
            type="password"
            icon={Lock}
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            placeholder="Enter new password"
            error={fieldErrors.newPassword}
          />

          <WaterInputField
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            icon={ShieldCheck}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Repeat new password"
            error={fieldErrors.confirmPassword}
          />

          {error && (
            <p className="text-xs text-center font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-center font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-fadeIn">
              {message}
            </p>
          )}

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
