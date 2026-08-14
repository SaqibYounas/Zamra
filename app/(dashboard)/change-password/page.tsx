'use client';

import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, Save, ShieldCheck } from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { Alert } from '@/app/src/components/ui/Alert';
import TextField from '@/app/src/components/ui/TextField';
import Button from '@/app/src/components/ui/Button';
import { changePassword } from '../services/account';

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

const EMPTY_FORM: PasswordForm = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const MIN_LENGTH = 8;

/** Advisory strength read-out — the backend remains the authority. */
function scorePassword(password: string) {
  if (!password) return { score: 0, label: '', tone: 'neutral' as const };

  let score = 0;
  if (password.length >= MIN_LENGTH) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score, label: 'Weak', tone: 'danger' as const };
  if (score === 2) return { score, label: 'Fair', tone: 'warning' as const };
  if (score === 3) return { score, label: 'Good', tone: 'brand' as const };
  return { score, label: 'Strong', tone: 'success' as const };
}

const STRENGTH_BARS = {
  danger: 'bg-danger',
  warning: 'bg-warning',
  brand: 'bg-brand-500',
  success: 'bg-success',
  neutral: 'bg-line',
} as const;

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState<PasswordForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [visible, setVisible] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const strength = useMemo(
    () => scorePassword(formData.newPassword),
    [formData.newPassword]
  );

  const handleChange = (field: keyof PasswordForm, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) =>
      previous[field] ? { ...previous, [field]: '' } : previous
    );
    setFormError('');
  };

  const toggle = (field: keyof typeof visible) =>
    setVisible((previous) => ({ ...previous, [field]: !previous[field] }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.oldPassword.trim())
      errors.oldPassword = 'Your current password is required.';

    if (!formData.newPassword.trim()) {
      errors.newPassword = 'A new password is required.';
    } else if (formData.newPassword.length < MIN_LENGTH) {
      errors.newPassword = `Use at least ${MIN_LENGTH} characters.`;
    } else if (formData.newPassword === formData.oldPassword) {
      errors.newPassword = 'The new password must differ from the current one.';
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setFieldErrors({});
    setFormError('');

    try {
      const response = (await changePassword(
        formData.oldPassword,
        formData.newPassword
      )) as ChangePasswordResponse;

      if (response?.success === false) {
        setFormError(
          response.message || 'The password could not be changed. Try again.'
        );
        return;
      }

      // Only clear the form once the change actually succeeded.
      setFormData(EMPTY_FORM);
    } catch (error) {
      setFormError(
        (error as Error)?.message ||
          'An error occurred while changing the password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer width="form">
      <PageHeader
        eyebrow="Settings"
        title="Change password"
        description="Update the credentials used to sign in to the operations portal."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <Card as="section">
          <CardHeader
            title="Update credentials"
            description="You will stay signed in on this device"
            icon={<KeyRound className="size-4" />}
          />

          <CardBody>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {formError ? <Alert tone="danger">{formError}</Alert> : null}

              <TextField
                name="oldPassword"
                label="Current password"
                type={visible.oldPassword ? 'text' : 'password'}
                icon={KeyRound}
                autoComplete="current-password"
                value={formData.oldPassword}
                onChange={(event) =>
                  handleChange('oldPassword', event.target.value)
                }
                togglePassword={() => toggle('oldPassword')}
                showPassword={visible.oldPassword}
                iconToggle={{
                  show: <EyeOff className="size-4" />,
                  hide: <Eye className="size-4" />,
                }}
                placeholder="Enter current password"
                error={fieldErrors.oldPassword}
                required
              />

              <div>
                <TextField
                  name="newPassword"
                  label="New password"
                  type={visible.newPassword ? 'text' : 'password'}
                  icon={Lock}
                  autoComplete="new-password"
                  value={formData.newPassword}
                  onChange={(event) =>
                    handleChange('newPassword', event.target.value)
                  }
                  togglePassword={() => toggle('newPassword')}
                  showPassword={visible.newPassword}
                  iconToggle={{
                    show: <EyeOff className="size-4" />,
                    hide: <Eye className="size-4" />,
                  }}
                  placeholder={`At least ${MIN_LENGTH} characters`}
                  error={fieldErrors.newPassword}
                  hint={
                    fieldErrors.newPassword
                      ? undefined
                      : 'Mix upper and lower case, a number and a symbol.'
                  }
                  required
                />

                {formData.newPassword ? (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1" aria-hidden>
                      {[1, 2, 3, 4].map((step) => (
                        <span
                          key={step}
                          className={`h-1 flex-1 rounded-full ${
                            step <= strength.score
                              ? STRENGTH_BARS[strength.tone]
                              : STRENGTH_BARS.neutral
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xs font-semibold text-ink-muted">
                      {strength.label}
                    </span>
                  </div>
                ) : null}
              </div>

              <TextField
                name="confirmPassword"
                label="Confirm new password"
                type={visible.confirmPassword ? 'text' : 'password'}
                icon={ShieldCheck}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  handleChange('confirmPassword', event.target.value)
                }
                togglePassword={() => toggle('confirmPassword')}
                showPassword={visible.confirmPassword}
                iconToggle={{
                  show: <EyeOff className="size-4" />,
                  hide: <Eye className="size-4" />,
                }}
                placeholder="Repeat new password"
                error={fieldErrors.confirmPassword}
                required
              />

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  label="Update password"
                  loadingLabel="Updating…"
                  loading={loading}
                  icon={<Save className="size-4" />}
                  className="sm:w-auto"
                  fullWidth
                />
              </div>
            </form>
          </CardBody>
        </Card>

        <Card as="aside" className="h-fit">
          <CardHeader
            title="Keeping access safe"
            icon={<ShieldCheck className="size-4" />}
          />
          <CardBody>
            <ul className="space-y-2.5 text-xs leading-relaxed text-ink-muted">
              <li>Use a password you do not reuse on any other service.</li>
              <li>
                Longer beats complex — a passphrase of {MIN_LENGTH}+ characters
                is stronger than a short scramble.
              </li>
              <li>
                Anyone with these credentials can change prices and issue
                invoices, so avoid sharing the account.
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
