'use client';

import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  open,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative bg-slate-900 px-6 py-5 text-white">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 14px)',
            }}
          />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-center text-slate-600">{message}</p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition cursor-pointer hover:bg-slate-100"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 py-3 font-semibold text-white transition hover:opacity-90 cursor-pointer"
            >
              {loading ? 'Logging out...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
