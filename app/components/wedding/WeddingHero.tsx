"use client";

import Image from "next/image";
import { useWeddingLanguage } from "./LanguageContext";
import { useInvitation } from "./InvitationContext";

export function WeddingHero() {
  const { isAmharic } = useWeddingLanguage();
  const { hasToken } = useInvitation();

  return (
    <section
      id="top"
      lang={isAmharic ? "am" : "en"}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#26150e] text-[#fff9ed] lg:h-screen"
    >
      {/* Full-bleed background photo of the couple, focused on faces on PC and mobile */}
      <Image
        src="/couple main.JPG"
        alt="Basseleal and Bethel wedding portrait"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-[center_15%] sm:object-[center_14%] md:object-[center_12%] lg:object-[center_10%] xl:object-[center_8%] hero-anim hero-fade"
        style={{ animationDelay: "0ms" }}
      />

      {/* Subtle top vignette for nav/toggles contrast */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent -z-10"
        aria-hidden
      />

      {/* Rich brown gradient towards the bottom of the hero */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] sm:h-[52%] lg:h-[46%] bg-gradient-to-t from-[#26150e] via-[#4d2d1d]/90 via-40% to-transparent -z-10 hero-anim hero-fade"
        style={{ animationDelay: "150ms" }}
        aria-hidden
      />

      {/* Bottom container where the couple's name, CTA, and scroll indicator sit */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col items-center justify-end pb-4 sm:pb-6 lg:h-full lg:pb-8 px-6 sm:px-12 text-center">
        {/* Lifted Names and CTA button group */}
        <div className="flex flex-col items-center justify-center -translate-y-2 sm:-translate-y-4">
          {/* Couple Names - 3-Line Vertical Lockup (Husband / And / Wife) */}
          <h1
            className="hero-anim hero-veil flex flex-col items-center justify-center text-center font-normal text-[#FFFDF5] [-webkit-text-stroke:0.2px_currentColor]"
            style={{ animationDelay: "360ms" }}
          >
            {/* Top: Husband's Name */}
            <span
              className={`block leading-[1.08] ${
                isAmharic
                  ? "font-jegna-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                  : "font-brittany-signature text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
              }`}
            >
              {isAmharic ? "ባስልኤል" : "Basseleal"}
            </span>

            {/* Middle: 'And' */}
            <span
              className={`block my-0.5 sm:my-1 text-[#F4E5C9]/90 ${
                isAmharic
                  ? "font-jegna-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                  : "font-editorial-serif italic font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              }`}
            >
              {isAmharic ? "እና" : "&"}
            </span>

            {/* Bottom: Wife's Name */}
            <span
              className={`block leading-[1.08] ${
                isAmharic
                  ? "font-jegna-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                  : "font-brittany-signature text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
              }`}
            >
              {isAmharic ? "ዶ/ር ቤቴል" : "Dr. Bethel"}
            </span>
          </h1>

          {/* Invitation CTA Button */}
          <a
            href={hasToken ? "#directions" : "#invitation"}
            className={`hero-anim hero-rise mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-full bg-[#f4e5c9] px-7 py-3.5 text-xs text-[#8b6c4d] shadow-lg transition hover:bg-white hover:text-[#5a3b2a] focus:outline-none focus:ring-2 focus:ring-white/80 ${
              isAmharic ? "font-balderasu font-normal text-sm" : "font-sans font-semibold uppercase tracking-[.16em]"
            }`}
            style={{ animationDelay: "600ms" }}
          >
            {isAmharic ? "ተጋብዘዋል" : "You're Invited"} <span aria-hidden>↓</span>
          </a>
        </div>

        {/* Scroll To See More Indicator */}
        <a
          href="#invitation"
          className="hero-anim hero-rise mt-5 sm:mt-7 flex flex-col items-center gap-1.5 text-[#f4e5c9]/85 hover:text-white transition-colors duration-300 focus:outline-none group cursor-pointer select-none"
          style={{ animationDelay: "750ms" }}
          aria-label={isAmharic ? "የበለጠ ለማየት ወደታች ይውረዱ" : "Scroll to see more"}
        >
          <span
            className={`transition-colors duration-200 group-hover:text-white ${
              isAmharic
                ? "font-balderasu text-xs sm:text-[13px] tracking-wider"
                : "font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em]"
            }`}
          >
            {isAmharic ? "የበለጠ ለማየት ወደታች ይውረዱ" : "Scroll to see more"}
          </span>

          <div className="text-[#E6C687] group-hover:text-white transition-colors duration-200 animate-bounce">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </a>
      </div>
    </section>
  );
}
