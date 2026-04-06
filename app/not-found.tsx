'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/40">
        <div className="text-center">
          <p className="text-teal-600 text-sm font-black uppercase tracking-[0.4em] mb-4">
            Page Not Found
          </p>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-5">
            404
          </h1>
          <p className="text-slate-500 text-base sm:text-lg leading-8 max-w-2xl mx-auto">
            The page you are looking for cannot be found. It may have been moved
            or removed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mt-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              What you can do
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>- Check the URL for mistakes</li>
              <li>- Go back to the dashboard</li>
              <li>- Refresh the page and try again</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              Need help?
            </h2>
            <p className="text-sm text-slate-600 leading-7">
              If the issue continues, contact the admin or return to the app
              home for the latest navigation.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-teal-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
