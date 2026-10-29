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

      {/* Bottom container where the couple's name and CTA sit */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col items-center justify-end pb-10 sm:pb-14 lg:h-full lg:pb-16 px-6 sm:px-12 text-center">
        {/* Couple Names */}
        <h1
          className={`hero-anim hero-veil flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 font-normal text-[#FFFDF5] [-webkit-text-stroke:0.2px_currentColor] ${
            isAmharic
              ? "font-jegna-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight"
              : "font-brittany-signature text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[1.08]"
          }`}
          style={{ animationDelay: "360ms" }}
        >
          <span className="block">{isAmharic ? "ባስልኤል" : "Basseleal"}</span>
          <span className="block">{isAmharic ? "እና ቤቴል" : "& Bethel"}</span>
        </h1>

        {/* Invitation CTA Button */}
        <a
          href={hasToken ? "#directions" : "#invitation"}
          className={`hero-anim hero-rise mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-full bg-[#f4e5c9] px-7 py-3.5 text-xs text-[#8b6c4d] shadow-lg transition hover:bg-white hover:text-[#5a3b2a] focus:outline-none focus:ring-2 focus:ring-white/80 ${
            isAmharic ? "font-balderasu font-normal text-sm" : "font-sans font-semibold uppercase tracking-[.16em]"
          }`}
          style={{ animationDelay: "600ms" }}
        >
          {isAmharic ? "ተጋብዘዋል" : "You're Invited"} <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
