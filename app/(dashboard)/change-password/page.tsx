'use client';

import React, { useState } from 'react';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const localErrors: Record<string, string> = {};

    if (!oldPassword)
      localErrors.oldPassword = 'Current password parameter is required.';
    if (!newPassword)
      localErrors.newPassword = 'New password parameter cannot be blank.';
    if (!confirmPassword)
      localErrors.confirmPassword =
        'Please repeat the new password confirmation.';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setError('Please resolve the required fields marked below.');

      const firstFailingFieldKey = Object.keys(localErrors)[0];
      setTimeout(() => {
        const inputElement = document.querySelector(
          `input[name="${firstFailingFieldKey}"]`
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputElement.focus();
        }
      }, 100);
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldErrors({
        confirmPassword: 'New password and confirmation logic do not match.',
      });
      setError('New password and confirmation do not match.');
      return;
    }

    setFieldErrors({});
    setMessage('Password updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:py-10 sm:px-6 lg:px-8 md:ml-16">
      <main className="w-full max-w-2xl rounded-2xl bg-gray-50 p-6 sm:p-10 shadow-lg border border-gray-200/50">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600" />
            <p className="text-teal-600 uppercase tracking-[0.4em] text-[11px] font-black">
              Account Settings
            </p>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Change Password
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Update your Zamra Water account password. Use a strong password and
            confirm it below.
          </p>
        </div>

        <div className="p-4 sm:p-8 ">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <WaterInputField
              name="oldPassword"
              label="Current Password"
              type="password"
              icon={KeyRound}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              error={fieldErrors.oldPassword}
            />

            <WaterInputField
              name="newPassword"
              label="New Password"
              type="password"
              icon={Lock}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              error={fieldErrors.newPassword}
            />

            <WaterInputField
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              icon={ShieldCheck}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              error={fieldErrors.confirmPassword}
            />

            {error && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-fadeIn">
                {error}
              </p>
            )}
            {message && (
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-fadeIn">
                {message}
              </p>
            )}

            <Button
              label="Save Password"
              type="submit"
              className="w-full mt-6"
            />
          </form>
        </div>
      </main>
    </div>
  );
}
