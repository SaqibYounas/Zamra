'use client';

import { Fragment, type ReactNode } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = 'md',
  dismissable = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  dismissable?: boolean;
}) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        onClose={dismissable ? onClose : () => {}}
        className="relative z-[100]"
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-marine-950/55 backdrop-blur-[2px]"
            aria-hidden
          />
        </TransitionChild>

        <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-panel bg-surface shadow-pop sm:rounded-panel ${SIZES[size]}`}
            >
              <div className="flex items-start gap-3 border-b border-line px-5 py-4">
                {icon ? <div className="shrink-0">{icon}</div> : null}

                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base font-semibold text-ink">
                    {title}
                  </DialogTitle>
                  {description ? (
                    <Description className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {description}
                    </Description>
                  ) : null}
                </div>

                {dismissable ? (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="btn btn-ghost -mr-1.5 -mt-1 size-8 shrink-0 p-0"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>

              {children ? (
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                  {children}
                </div>
              ) : null}

              {footer ? (
                <div className="flex flex-col-reverse gap-2 border-t border-line bg-surface-sunken/60 px-5 py-4 sm:flex-row sm:justify-end">
                  {footer}
                </div>
              ) : null}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
