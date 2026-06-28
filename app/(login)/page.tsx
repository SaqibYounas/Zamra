'use client';

import PlantAdminForm from './components/AdminLogin';
import { Droplets } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Transition } from '@headlessui/react';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 sm:px-6 md:px-10 py-10 relative font-sans">
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="flex items-center p-3 sm:p-4 md:p-6">
          <Link href="/">
            <Image
              className="rounded-2xl"
              src="/Logo.jpg"
              alt="Zamra Logo"
              width={100}
              height={80}
            />
          </Link>
        </div>
      </header>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center justify-items-center md:justify-items-stretch min-h-[80vh] relative z-10">
        <div className="space-y-4 text-center md:text-left w-full max-w-md md:max-w-none">
          <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 sm:px-5 py-2 rounded-full border border-sky-400 bg-sky-50 text-sky-600 text-xs sm:text-sm font-semibold shadow-sm">
            <Droplets size={16} /> Pure Water, Pure Life
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-sky-400 leading-tight">
              Zamra Water
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-zinc-800 leading-relaxed mt-3">
              Keep track of your water plant, manage deliveries, and stay on top
              of everything easily.
            </p>
          </div>
        </div>

        <Transition
          appear
          show
          as="div"
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          className="w-full flex justify-center md:justify-end"
        >
          <PlantAdminForm />
        </Transition>
      </div>
    </div>
  );
}
