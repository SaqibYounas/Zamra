'use client';

import { useState } from 'react';
import Button from '../../src/components/button/Button';
import FormInput from '../../src/components/inputFields/FormInput';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setMessage('');
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setMessage('Password updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-2xl rounded-3xl bg-surface p-6 sm:p-8 shadow-xl shadow-[rgba(15,23,42,0.15)]">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-teal-600 uppercase tracking-[0.4em] text-[11px] font-black">
            Account Settings
          </p>
          <h1 className="text-3xl font-black text-slate-900">
            Change Password
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Update your Zamra Water account password. Use a strong password and
            confirm it below.
          </p>
        </div>

        <div className="rounded-3xl border border-surface bg-surface p-6 md:p-8">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <FormInput
              label="Current Password"
              type="password"
              value={oldPassword}
              onChange={(value) => setOldPassword(String(value))}
              placeholder="Enter current password"
            />

            <FormInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(value) => setNewPassword(String(value))}
              placeholder="Enter new password"
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(value) => setConfirmPassword(String(value))}
              placeholder="Repeat new password"
            />

            {error ? (
              <p className="text-sm font-semibold text-rose-600">{error}</p>
            ) : null}
            {message ? (
              <p className="text-sm font-semibold text-emerald-600">
                {message}
              </p>
            ) : null}

            <Button label="Save Password" type="submit" className="mt-2" />
          </form>
        </div>
      </main>
    </div>
  );
}
