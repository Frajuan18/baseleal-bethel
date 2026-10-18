"use client";

import { useEffect, useState } from "react";
import { coupleName, wedding } from "@/config/wedding";

const navItems = [
  { label: "Invitation", href: "#invitation" },
  { label: "The Date", href: "#date" },
  { label: "Countdown", href: "#countdown" },
  { label: "Moments", href: "#moments" },
  { label: "RSVP & Wishes", href: "#rsvp" },
];

export function WeddingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#F8F4ED]/95 backdrop-blur-md shadow-sm border-b border-[#DED2C2]/60 py-3 text-[#422B20]"
            : "bg-gradient-to-b from-[#2B1810]/70 via-[#2B1810]/30 to-transparent py-5 text-[#F8F4ED]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Monogram / Logo */}
          <a
            href="#top"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B18A54]"
            aria-label={`${coupleName} - Back to top`}
          >
            <span className="font-editorial-serif text-2xl sm:text-3xl tracking-tight italic font-normal transition-colors group-hover:text-[#B18A54]">
              {wedding.couple.monogram}
            </span>
            <span className="text-[10px] text-[#B18A54] select-none" aria-hidden>
              ✦
            </span>
            <span className="hidden sm:inline-block text-[11px] font-sans uppercase tracking-[0.22em] opacity-80 group-hover:opacity-100 transition-opacity">
              Wedding Celebration
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 text-[11px] font-sans font-medium uppercase tracking-[0.2em]"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 hover:text-[#B18A54] ${
                  isScrolled ? "text-[#422B20]/80" : "text-[#F8F4ED]/90"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Button & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="#rsvp"
              className={`hidden sm:inline-flex items-center justify-center px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-200 border ${
                isScrolled
                  ? "border-[#422B20] text-[#422B20] hover:bg-[#422B20] hover:text-[#F8F4ED]"
                  : "border-[#F8F4ED] text-[#F8F4ED] hover:bg-[#B18A54] hover:border-[#B18A54] hover:text-[#2B1810]"
              }`}
            >
              RSVP
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#B18A54] transition-colors ${
                isScrolled ? "text-[#422B20]" : "text-[#F8F4ED]"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-current transform transition duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transition duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transform transition duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 bg-[#2B1810]/95 backdrop-blur-md flex flex-col justify-between p-6 pt-24 text-[#F8F4ED] md:hidden animate-fadeIn"
        >
          <div className="text-center my-auto space-y-6">
            <div className="font-editorial-serif text-3xl italic text-[#B18A54] mb-4">
              {wedding.couple.title}
            </div>
            <div className="h-px w-12 bg-[#B18A54]/40 mx-auto mb-6" />

            <nav className="flex flex-col space-y-5" aria-label="Mobile Links">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-sans uppercase tracking-[0.25em] text-[#F8F4ED]/90 hover:text-[#B18A54] py-2 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pt-6">
              <a
                href="#rsvp"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block w-full max-w-xs py-3.5 bg-[#B18A54] text-[#2B1810] text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:bg-[#F8F4ED]"
              >
                Respond to Invitation
              </a>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#F8F4ED]/60 uppercase tracking-[0.2em] pb-4">
            A sacred covenant of love
          </div>
        </div>
      )}
    </>
  );
}
