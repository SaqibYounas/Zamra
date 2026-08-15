import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Droplets,
  Gauge,
  LineChart,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import { ThemeToggle } from '@/app/src/components/ui/ThemeToggle';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to the Zamra Water Plant operations portal.',
};

const HIGHLIGHTS = [
  {
    icon: Gauge,
    title: 'Production tracking',
    body: 'Log daily bottling output per size and keep stock counts current.',
  },
  {
    icon: LineChart,
    title: 'Cost and profit clarity',
    body: 'See cost, selling price and margin side by side, day by day.',
  },
  {
    icon: ReceiptText,
    title: 'Invoices in one place',
    body: 'Build customer invoices from live prices and export them as PDF.',
  },
];

export default function Login() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-marine-950 p-10 text-marine-100 lg:flex xl:p-14">
        <div className="marine-grid absolute inset-0 opacity-70" aria-hidden />
        <div
          className="absolute -left-24 top-1/4 size-[26rem] rounded-full bg-brand-500/15 blur-3xl"
          aria-hidden
        />

        <div className="relative flex items-center gap-3">
          <Image
            src="/Logo.jpg"
            alt="Zamra Water"
            width={44}
            height={44}
            className="rounded-field object-cover ring-1 ring-white/15"
            priority
          />
          <div>
            <p className="text-sm font-semibold text-white">Zamra Water</p>
            <p className="text-2xs text-marine-300">Operations Portal</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="badge bg-brand-500/15 text-brand-200 ring-1 ring-brand-400/25">
            <Droplets className="size-3" />
            Pure water, pure life
          </span>

          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white xl:text-[2.75rem]">
            Run the whole plant from one screen.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-marine-300">
            Production, pricing, stock and billing for Zamra Water — measured
            daily, reported monthly.
          </p>

          <ul className="mt-9 space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3.5">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-field bg-white/5 text-brand-300 ring-1 ring-white/10">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-marine-300">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-2xs text-marine-400">
          <ShieldCheck className="size-3.5" />
          Authorised personnel only. All activity is attributed to your account.
        </p>
      </section>

      {/* Form panel */}
      <section className="relative flex flex-col justify-center bg-canvas px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <Image
              src="/Logo.jpg"
              alt="Zamra Water"
              width={40}
              height={40}
              className="rounded-field object-cover lg:hidden"
              priority
            />
            <div className="lg:hidden">
              <p className="text-sm font-semibold text-ink">Zamra Water</p>
              <p className="text-2xs text-ink-muted">Operations Portal</p>
            </div>

            <ThemeToggle className="ml-auto lg:absolute lg:right-8 lg:top-8" />
          </div>

          <AdminLogin />

          <p className="mt-6 text-center text-2xs text-ink-faint">
            Trouble signing in? Contact your plant administrator.
          </p>
        </div>
      </section>
    </div>
  );
}
