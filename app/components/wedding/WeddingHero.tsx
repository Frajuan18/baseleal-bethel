"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { coupleName, wedding } from "@/config/wedding";

/** Entrance helper — staggered delay, rise distance (px) and duration. */
const rise = (
  delay: string,
  px = "14px",
  duration = "900ms"
): CSSProperties =>
  ({
    animationDelay: delay,
    animationDuration: duration,
    "--hero-rise": px,
  }) as CSSProperties;

/** Simple delayed step (no rise) for clip / scale entrances. */
const step = (delay: string, duration: string): CSSProperties => ({
  animationDelay: delay,
  animationDuration: duration,
});

export function WeddingHero() {
  return (
    <section
      id="top"
      className="relative w-full min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#F5F7FA]"
    >
      {/* Subtle Luminous Surface Sheen — soft light wash on load */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/70 via-transparent to-white/60 hero-sheen"
        aria-hidden
      />

      {/* Top Left Corner Floral Artwork — drawn in first, then a barely-perceptible drift */}
      <div className="hero-drift pointer-events-none absolute top-0 left-0 z-20 w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-[330px] lg:h-[330px] xl:w-[350px] xl:h-[350px] select-none">
        <Image
          src="/top left dark.png"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, (max-width: 1024px) 224px, 350px"
          className="hero-anim hero-wipe-left object-contain object-top-left"
          style={step("0.25s", "2200ms")}
        />
      </div>

      {/* Main Two-Column Editorial Area - On mobile, text occupies the first full viewport, couple photo appears after scroll */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-4 sm:py-8 lg:py-6 w-full max-w-7xl mx-auto min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full my-auto">

          {/* Left Column / Mobile Screen 1: Full-Screen Invitation Copy & Actions */}
          <div className="min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-4rem)] lg:min-h-0 lg:col-span-7 relative z-10 flex flex-col items-center justify-center text-center py-10 lg:py-0 w-full">

            {/* Glassy Div with No Border Radius - Centered text */}
            <div className="hero-anim hero-rise inline-flex items-center justify-center mx-auto px-4 py-1.5 rounded-none backdrop-blur-md shadow-xs select-none border bg-white/75 border-[#D5DCE5] text-[#2B1810]" style={rise("0.4s", "8px", "1100ms")}>
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.26em] text-center">
                A DAY TO REMEMBER
              </span>
            </div>

            {/* Main Headline - Sized grandly to fill the mobile first screen */}
            <h1 className="relative mt-5 sm:mt-6 font-hero-serif text-[clamp(3.9rem,15vw,6.75rem)] leading-[1.08] tracking-[0.01em] font-normal text-center w-full">
              <span className="font-brittany-signature hero-anim hero-rise block whitespace-nowrap text-[#2B1810]" style={rise("0.85s", "12px", "1600ms")}>
                {wedding.couple.first}
              </span>
              <span className="hero-anim hero-rise block my-1 sm:absolute sm:top-[0.3em] sm:right-[4%] sm:my-0 italic font-normal text-[#B18A54]" style={rise("1.25s", "10px", "1600ms")}>
                <span className="gold-breath inline-block">&amp;</span>
              </span>
              <span className="font-brittany-signature hero-anim hero-rise mt-3 sm:mt-5 block whitespace-nowrap text-[#2B1810]" style={rise("1.6s", "12px", "1600ms")}>
                {wedding.couple.second}
              </span>
            </h1>

            {/* Floral Underline for Couple Name — unfolds from the centre */}
            <div className="hero-drift pointer-events-none relative w-full max-w-[480px] sm:max-w-[620px] md:max-w-[740px] lg:max-w-[840px] aspect-[2.7/1] mx-auto -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 -mb-11 sm:-mb-15 md:-mb-18 lg:-mb-21 select-none" style={{ animationDuration: "40s" }}>
              <Image
                src="/flower underline dark.png"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 440px, (max-width: 768px) 560px, 780px"
                className="hero-anim hero-wipe-center object-contain object-center"
                style={step("2.0s", "1600ms")}
              />
            </div>

            {/* Supporting Headline / Subtitle - Centered */}
            <p className="hero-anim hero-rise mt-2 sm:mt-2.5 text-base sm:text-lg lg:text-xl font-editorial-serif italic font-normal text-center mx-auto text-[#8C6A3B]" style={rise("2.4s", "10px", "1200ms")}>
              Two hearts, one beautiful beginning.
            </p>

            {/* Supporting Paragraph - Centered */}
            <p className="hero-anim hero-rise mt-4 sm:mt-5 text-xs sm:text-sm lg:text-base leading-relaxed font-sans font-light max-w-md sm:max-w-lg mx-auto text-center px-2 text-[#5A4F46]" style={rise("2.8s", "10px", "1300ms")}>
              With grateful hearts, we invite you to celebrate the beginning of our forever. Your presence would make our special day even more meaningful.
            </p>

            {/* Primary & Secondary Call to Actions - Centered */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
              <a
                href="#invitation"
                className="hero-anim hero-rise min-h-[48px] px-7 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center justify-center gap-2 transition-all duration-[420ms] shadow-md hover:shadow-xl bg-[#2B1810] text-[#F8F4ED] hover:bg-[#1D1009] focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-white"
                style={rise("3.3s", "8px", "1000ms")}
              >
                <span>You&apos;re Invited</span>
                <span aria-hidden>↓</span>
              </a>

              <a
                href="#date"
                className="hero-anim hero-rise min-h-[48px] px-6 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-medium inline-flex items-center justify-center gap-2 transition-all duration-[420ms] shadow-xs border border-[#D5DCE5] bg-white/75 backdrop-blur-md text-[#2B1810] hover:bg-white hover:border-[#8C6A3B] focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-white"
                style={rise("3.6s", "8px", "1000ms")}
              >
                <span>Discover Our Day</span>
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* Mobile Scroll Indicator to Guide to Photograph */}
            <div className="hero-anim hero-rise lg:hidden mt-8 sm:mt-10 flex flex-col items-center gap-1.5 opacity-80" style={rise("4.2s", "8px", "1000ms")}>
              <span className="text-[10px] tracking-[0.24em] uppercase font-sans font-medium text-[#8C6A3B]">
                Scroll to view portrait
              </span>
              <span className="text-xs text-[#8C6A3B]" aria-hidden>
                ↓
              </span>
            </div>
          </div>

          {/* Right Column / Mobile Screen 2: Hero Couple Photograph */}
          <div className="min-h-[85dvh] sm:min-h-[90dvh] lg:min-h-0 lg:col-span-5 relative flex flex-col justify-center items-center py-12 lg:py-0 w-full">
            {/* Botanical backing — rotated diagonally on mobile so flowers land at top-left & bottom-right corners */}
            <div className="hero-drift pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none" style={{ animationDuration: "40s" }}>
              <div className="relative flex-none rotate-[35deg] lg:rotate-0 lg:translate-x-10 w-[125vw] sm:w-[110vw] md:w-[85vw] lg:w-[820px] max-w-none aspect-[1536/1024]">
                <Image
                  src="/behind image.png"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 640px) 165vw, (max-width: 768px) 130vw, (max-width: 1024px) 100vw, 820px"
                  className="hero-anim hero-wipe-left object-contain"
                  style={step("2.7s", "2400ms")}
                />
              </div>
            </div>

            {/* Entrance wrapper */}
            <div className="hero-anim hero-photo w-full flex justify-center relative z-10" style={step("3.0s", "2200ms")}>
              {/* Camera-Printed Instant Photo Card */}
              <div
                className="relative bg-white p-3 sm:p-4 pb-10 rounded-md border -rotate-1 hover:rotate-0 transition-all duration-[450ms] ease-out shadow-[0_22px_45px_rgba(30,40,55,0.12),0_6px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_28px_54px_rgba(30,40,55,0.17)] border-[#E2E6EC] lg:translate-x-10 w-[60vw] sm:w-[58vw] md:w-[46vw] lg:w-[400px]"
              >
                {/* Photo frame — taller aspect to show full couple head-to-feet */}
                <div className="hero-anim hero-clip-down relative aspect-[2/3] w-full overflow-hidden rounded-[2px] bg-[#F2EDE4] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" style={step("3.6s", "1900ms")}>
                  <Image
                    src="/couple.JPG"
                    alt={`${coupleName} wedding portrait`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-[center_45%]"
                  />
                  {/* Subtle soft gradient reflection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810]/12 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
                </div>

                {/* Camera Print Bottom Chin Caption */}
                <div className="hero-anim hero-fade pt-2.5 sm:pt-3 flex items-center justify-between text-[#7A6452]" style={step("5.3s", "1200ms")}>
                  <span className="font-hero-serif italic text-xs sm:text-sm tracking-wide text-[#382416]">
                    {wedding.couple.first} &amp; {wedding.couple.second}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#9B7C3E]">
                    ✦ Forever
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
