'use client';

import { AlertTriangle, HelpCircle } from 'lucide-react';
import { Modal } from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  loadingText?: string;
  tone?: 'danger' | 'question';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  loadingText,
  tone = 'danger',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={message}
      dismissable={!loading}
      size="sm"
      icon={
        <span
          className={`flex size-10 items-center justify-center rounded-field ${
            tone === 'danger'
              ? 'bg-danger-soft text-danger'
              : 'bg-brand-50 text-brand-600'
          }`}
        >
          {tone === 'danger' ? (
            <AlertTriangle className="size-5" />
          ) : (
            <HelpCircle className="size-5" />
          )}
        </span>
      }
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            label={cancelText}
            onClick={onCancel}
            disabled={loading}
            className="sm:w-auto"
            fullWidth
          />
          <Button
            type="button"
            variant={tone === 'danger' ? 'danger' : 'primary'}
            label={confirmText}
            loadingLabel={loadingText}
            loading={loading}
            onClick={onConfirm}
            className="sm:w-auto"
            fullWidth
          />
        </>
      }
    />
  );
}
