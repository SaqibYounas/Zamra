import Link from 'next/link';
import { Compass, Droplets, LayoutDashboard } from 'lucide-react';
import { NAV_SECTIONS } from './src/lib/navigation';

/** Server component — nothing here is interactive beyond links. */
export default function NotFoundPage() {
  const suggestions = NAV_SECTIONS.flatMap((section) => section.items).slice(
    0,
    4
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-ink-muted">
          <Droplets className="size-4 text-brand-600" />
          <span className="text-2xs font-semibold uppercase tracking-[0.14em]">
            Zamra Water
          </span>
        </div>

        <div className="surface-panel p-6 sm:p-8">
          <div className="text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Compass className="size-6" />
            </span>

            <p className="mt-4 text-2xs font-semibold uppercase tracking-[0.14em] text-brand-600">
              Error 404
            </p>

            <h1 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">
              We could not find that page
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
              The link may be out of date or mistyped. Here are the places you
              are most likely looking for.
            </p>
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-card border border-line bg-surface p-3.5 transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="block text-sm font-semibold text-ink">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-center">
            <Link
              href="/dashboard"
              className="btn btn-primary h-11 px-4 text-sm"
            >
              <LayoutDashboard className="size-4" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
