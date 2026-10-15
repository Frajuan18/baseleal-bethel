"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full z-40 bg-[#FAF8F5]">
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-serif italic text-2xl sm:text-[26px] text-[#1C2822] tracking-tight hover:opacity-85 transition-opacity"
        >
          Amelia Ross
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-10 lg:space-x-14">
          <Link
            href="#work"
            className="font-sans text-[11px] tracking-[0.24em] uppercase text-[#6B7169] hover:text-[#1C2822] transition-colors duration-200"
          >
            Work
          </Link>
          <Link
            href="#approach"
            className="font-sans text-[11px] tracking-[0.24em] uppercase text-[#6B7169] hover:text-[#1C2822] transition-colors duration-200"
          >
            Approach
          </Link>
          <Link
            href="#enquiries"
            className="font-sans text-[11px] tracking-[0.24em] uppercase text-[#6B7169] hover:text-[#1C2822] transition-colors duration-200"
          >
            Contact
          </Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <Link
            href="#enquiries"
            className="font-sans text-[11px] tracking-[0.24em] uppercase text-[#1C2822] pb-0.5 border-b border-[#1C2822] hover:border-transparent hover:opacity-75 transition-all duration-200"
          >
            Enquire
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#1C2822] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E2DED5] px-6 pt-4 pb-8 space-y-5 animate-fadeIn">
          <Link
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-sans text-xs tracking-[0.24em] uppercase text-[#6B7169] hover:text-[#1C2822]"
          >
            Work
          </Link>
          <Link
            href="#approach"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-sans text-xs tracking-[0.24em] uppercase text-[#6B7169] hover:text-[#1C2822]"
          >
            Approach
          </Link>
          <Link
            href="#enquiries"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-sans text-xs tracking-[0.24em] uppercase text-[#6B7169] hover:text-[#1C2822]"
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              href="#enquiries"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block font-sans text-xs tracking-[0.24em] uppercase text-[#1C2822] pb-0.5 border-b border-[#1C2822]"
            >
              Enquire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
