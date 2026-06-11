/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-[#0a0f0a]">
      <div className="max-w-[1132px] h-[56.57px] mx-auto flex items-center gap-6 md:gap-10 px-4">
        <div className="flex items-center">
          <img src="/logo.png" width={90} height={56.57} alt="logo" />
        </div>

        <nav className="hidden md:flex items-center gap-7 text-white">
          {["Equipment", "How It Works", "Feature", "About", "Contact Us"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] lg:text-base font-semibold hover:text-gray-400 transition"
              >
                {item}
              </a>
            ),
          )}
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-3">
          <button className="text-[11px] lg:text-xs text-gray-300 hover:text-white transition border border-white/20 px-4 py-1.5 rounded">
            Log In
          </button>

          <button className="text-[11px] lg:text-xs bg-green-500 hover:bg-green-400 px-4 py-1.5 rounded text-black font-bold transition">
            Get Started
          </button>
        </div>

        <div className="ml-auto flex md:hidden items-center gap-3">
          <button className="text-[10px] text-gray-300 border border-white/20 px-3 py-1 rounded">
            Log In
          </button>

          <button className="text-[10px] bg-green-500 px-3 py-1 rounded text-black font-bold">
            Sign Up
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M3 12h18M3 18h18"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0a0f0a] px-4 pb-4 flex flex-col gap-4 text-[11px] text-gray-300">
          {["Equipment", "How It Works", "Feature", "About", "Contact Us"].map(
            (item) => (
              <a key={item} href="#" className="hover:text-white transition">
                {item}
              </a>
            ),
          )}
        </div>
      )}
    </header>
  );
}
