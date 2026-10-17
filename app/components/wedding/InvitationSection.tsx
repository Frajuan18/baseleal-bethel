"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { wedding } from "@/config/wedding";

/** Sequence step — staggered delay, duration and optional rise distance. */
const seq = (
  delay: string,
  duration = "1200ms",
  px?: string
): CSSProperties =>
  ({
    "--seq-delay": delay,
    "--seq-duration": duration,
    ...(px ? { "--hero-rise": px } : {}),
  }) as CSSProperties;

export function InvitationSection() {
  // Structured date lockup data (matches reference: SATURDAY | SEPT 20 2028 | AT 10 AM)
  const parsedDate = (() => {
    if (wedding.date) {
      const parts = wedding.date.split("-").map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
        return {
          weekday: weekdays[dt.getUTCDay()] ?? "SATURDAY",
          month: months[m - 1] ?? "SEPT",
          day: String(d),
          year: String(y),
          time: wedding.time ? `AT ${wedding.time}` : "AT 10 AM",
        };
      }
    }
    return {
      weekday: "SATURDAY",
      month: "SEPT",
      day: "20",
      year: "2028",
      time: "AT 10 AM",
    };
  })();

  return (
    <section
      id="invitation"
      data-reveal
      className="reveal-seq scroll-mt-24 relative py-16 sm:py-20 lg:py-16 xl:py-20 min-h-[100dvh] lg:min-h-[100dvh] lg:aspect-[1672/941] flex flex-col justify-center overflow-hidden bg-[#F3F2EE]"
    >
      {/* Background Image: invit img.png - natural aspect ratio preserved with left-top alignment across all screens */}
      <div data-seq="bg" className="absolute inset-0 z-0 pointer-events-none select-none block">
        <Image
          src="/invit img.png"
          alt="Invitation section background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="w-full h-full object-cover object-[-25px_top] sm:object-[left_top]"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col items-center justify-center">
        {/* Container shifted to the right on tablet & desktop to showcase the floral branch artwork on the left */}
        <div className="w-full flex flex-col items-center justify-center translate-x-2 sm:translate-x-6 md:translate-x-14 lg:translate-x-28 xl:translate-x-40 2xl:translate-x-52 transition-transform duration-300">
          
          {/* Section Header with seamless luminous parchment vignette on small screens to prevent flower overlap */}
          <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6 lg:mb-5 relative z-10 px-3">
            <div
              className="pointer-events-none absolute inset-0 -inset-x-6 -inset-y-2 bg-[#EFEDEB]/90 md:hidden rounded-full blur-md -z-10 shadow-[0_0_28px_18px_#EFEDEB]"
              aria-hidden
            />
            <p data-seq="rise" style={seq("0.6s", "1000ms", "7px")} className="eyebrow mb-1.5 text-[#8C6A3B] text-xs uppercase tracking-[0.26em] font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              Our Covenant
            </p>
            <h2 data-seq="rise" style={seq("0.95s", "1100ms", "8px")} className="font-editorial-serif text-3xl sm:text-4xl md:text-[2.6rem] tracking-tight text-[#2B1810] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              A Day to Hold Close
            </h2>
            <div data-seq="unfold" style={seq("1.35s", "1000ms")} className="h-px w-14 mx-auto mt-2.5 mb-2.5 bg-[#8C6A3B]/50" />
          </div>

          {/* The Fine-Art Wedding Invitation Card - Grand, Prominent & Perfectly Proportioned */}
          <div className="max-w-[560px] sm:max-w-[600px] md:max-w-[620px] mx-auto w-full">
          <article data-seq="card" style={{ ...seq("1.7s", "1700ms"), "--photo-rise": "14px" } as CSSProperties} className="relative z-20 bg-[#FAF5EE] rounded-sm p-6 sm:p-9 md:p-10 lg:p-8 xl:p-10 text-left border border-[#E8DFD3] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28),0_10px_24px_-6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
            
            {/* Fine Tactile Cotton Paper Texture Overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-multiply select-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
              }}
              aria-hidden
            />

            {/* Sculptural Pleated Silk Floral Artwork in Top-Right Corner - Inset gracefully & slender */}
            <div data-seq="draw-down" style={seq("2.6s", "1800ms")} className="pointer-events-none absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3 w-[35%] sm:w-[37%] md:w-[39%] max-w-[230px] aspect-[1087/1447] select-none z-10 opacity-95">
              <Image
                src="/card flower.png"
                alt="Artisan pleated silk floral sculpture"
                fill
                priority
                sizes="(max-width: 640px) 170px, 230px"
                className="object-contain object-top-right filter saturate-[0.98] contrast-[1.02]"
              />
            </div>

            {/* Content Layer: Left-Aligned Editorial Stationery Typography */}
            <div className="relative z-20 flex flex-col justify-between h-full text-left">
              
              {/* Main Typography Block - Left Column strictly separated from flower */}
              <div className="max-w-[55%] sm:max-w-[52%] md:max-w-[50%] space-y-4 sm:space-y-4.5 lg:space-y-4 xl:space-y-4.5">
                
                {/* Couple Header - Title Case */}
                <div className="space-y-1.5">
                  <p data-seq="fade" style={seq("2.0s", "900ms")} className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-[#7C5A32]">
                    The Wedding Of
                  </p>
                  <h3 className="font-editorial-serif text-[clamp(1.75rem,3.8vw,2.35rem)] lg:text-[2.05rem] xl:text-[2.35rem] text-[#1E140E] leading-[1.05] tracking-[-0.01em]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span data-seq="rise" style={seq("2.25s", "1000ms", "10px")} className="capitalize">{wedding.couple.first}</span>
                      <span data-seq="rise" style={seq("2.6s", "1000ms", "8px")} className="font-editorial-serif italic font-light text-[0.8em] tracking-normal text-[#9A7338]">
                        and
                      </span>
                    </div>
                    <span data-seq="rise" style={seq("2.9s", "1000ms", "10px")} className="block mt-0.5 capitalize">
                      {wedding.couple.second}
                    </span>
                  </h3>
                </div>

                {/* Invitation Request Line */}
                <div data-seq="rise" style={seq("3.15s", "1000ms", "10px")} className="space-y-1">
                  <p className="font-editorial-serif uppercase tracking-[0.2em] text-[9.5px] sm:text-[10px] text-[#3E2B20]/90 font-medium leading-relaxed">
                    Request The Presence Of Your Company
                  </p>
                  <p className="font-editorial-serif uppercase tracking-[0.2em] text-[9.5px] sm:text-[10px] text-[#3E2B20]/90 font-medium leading-relaxed">
                    For Their Upcoming Wedding
                  </p>
                </div>

                {/* 3-Column Vertical Hairline Date Lockup */}
                <div data-seq="rise" style={seq("3.4s", "1000ms", "12px")} className="pt-1.5 sm:pt-2">
                  <div className="inline-flex items-center text-[#1E140E]">
                    
                    {/* Left: Day of Week */}
                    <div className="pr-3.5 sm:pr-5 text-left">
                      <span className="font-editorial-serif uppercase tracking-[0.16em] text-sm sm:text-base md:text-lg font-medium text-[#2B1810]">
                        {parsedDate.weekday}
                      </span>
                    </div>

                    {/* Left Hairline Separator */}
                    <div className="h-13 sm:h-16 w-px bg-[#2B1810]/40" />

                    {/* Center: Stacked Month, Day Number, Year */}
                    <div className="px-3.5 sm:px-5 text-center flex flex-col items-center justify-center">
                      <span className="font-sans uppercase tracking-[0.22em] text-[10px] sm:text-[11px] font-semibold text-[#7C5A32]">
                        {parsedDate.month}
                      </span>
                      <span className="font-editorial-serif text-2xl sm:text-3xl md:text-[2.35rem] lg:text-[2.35rem] font-semibold leading-none my-0.5 text-[#1E140E]">
                        {parsedDate.day}
                      </span>
                      <span className="font-sans uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium text-[#7C5A32]">
                        {parsedDate.year}
                      </span>
                    </div>

                    {/* Right Hairline Separator */}
                    <div className="h-13 sm:h-16 w-px bg-[#2B1810]/40" />

                    {/* Right: Time */}
                    <div className="pl-3.5 sm:pl-5 text-left">
                      <span className="font-editorial-serif uppercase tracking-[0.16em] text-sm sm:text-base md:text-lg font-medium text-[#2B1810]">
                        {parsedDate.time}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Venue & Location Block */}
                <div data-seq="rise" style={seq("3.65s", "1000ms", "10px")} className="space-y-0.5">
                  <p className="font-editorial-serif uppercase tracking-[0.18em] text-[11px] sm:text-xs text-[#22150D] font-medium leading-relaxed">
                    {wedding.venue}
                  </p>
                  <p className="font-editorial-serif uppercase tracking-[0.16em] text-[10px] sm:text-[11px] text-[#634838] leading-relaxed">
                    {wedding.city}
                  </p>
                </div>

                {/* RSVP Online CTA Button */}
                <div data-seq="rise" style={seq("3.95s", "1000ms", "6px")} className="pt-1">
                  <a
                    href="#rsvp"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold bg-[#2B1810] text-[#FAF6F0] hover:bg-[#8C6A3B] transition-all duration-[420ms] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2 focus:ring-offset-[#FAF5EE]"
                  >
                    <span>RSVP Online</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>

              </div>

              {/* Scripture Blessing at Bottom */}
              <div data-seq="fade" style={seq("4.7s", "1300ms")} className="pt-4 sm:pt-5 max-w-[80%]">
                <p className="font-editorial-serif italic text-xs sm:text-[13px] text-[#553C2D] leading-relaxed opacity-80">
                  {wedding.scripture.verse}
                </p>
              </div>

            </div>
          </article>
        </div>

        </div>
      </div>
    </section>
  );
}
