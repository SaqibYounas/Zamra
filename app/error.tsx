'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-slate-100  flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/40">
        <div className="text-center">
          <p className="text-teal-600 text-sm font-black uppercase tracking-[0.4em] mb-4">
            Server Error
          </p>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-5">
            500
          </h1>
          <p className="text-slate-500 text-base sm:text-lg leading-8 max-w-2xl mx-auto mb-6">
            Something went wrong on the server. Please try again or contact
            support if the problem persists.
          </p>
          <p className="text-sm text-slate-400 mb-8 wrap-break-word">
            {error?.message ?? 'Unexpected error.'}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-teal-700"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-800 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
