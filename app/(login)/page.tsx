import PlantAdminForm from './components/AdminLogin';
import { Droplets } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Transition } from '@headlessui/react';
export default function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center pt-24 p-4 md:p-8 relative overflow-hidden font-sans">
      {' '}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="flex items-center p-4 md:p-6">
          <Link href="/">
            <Image
              className="rounded-4xl"
              src="/Logo.jpg"
              alt="Zamra Logo"
              width={120}
              height={100}
            />
          </Link>
        </div>
      </header>
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-10 items-center relative z-10">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border-2 border-sky-400 bg-sky-50 text-sky-600 text-sm font-semibold shadow-sm rounded-b ">
            <Droplets size={16} /> Pure Water, Pure Life
          </div>
          <div className="max-w-110 mx-auto lg:mx-0">
            <h1 className="text-5xl lg:text-6xl font-black  text-sky-400">
              Zamra Water
            </h1>

            <p className="text-md text-zinc-900 leading-[1.2] mt-2">
              Keep track of your water plant, manage deliveries, and stay on top
              of everything easily.
            </p>
          </div>
        </div>

        <Transition
          appear={true}
          show={true}
          as="div"
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <PlantAdminForm />
        </Transition>
      </div>
    </div>
  );
}
