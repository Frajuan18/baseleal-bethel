"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { wedding } from "@/config/wedding";
import { useWeddingLanguage } from "./LanguageContext";

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
  const { isAmharic } = useWeddingLanguage();
  // Structured date lockup data (matches reference: SATURDAY | SEPT 20 2028 | AT 10 AM)
  const parsedDate = (() => {
    if (wedding.date) {
      const parts = wedding.date.split("-").map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        const weekdays = isAmharic ? ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"] : ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const months = isAmharic ? ["ጃን", "ፌብ", "ማር", "ኤፕሪ", "ሜይ", "ጁን", "ጁላይ", "ኦገስት", "ሴፕቴ", "ኦክቶ", "ኖቬ", "ዲሴ"] : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
        return {
          weekday: weekdays[dt.getUTCDay()] ?? "SATURDAY",
          month: months[m - 1] ?? "SEPT",
          day: String(d),
          year: String(y),
          time: wedding.time ? `${isAmharic ? "በ" : "AT"} ${wedding.time}` : (isAmharic ? "በ10 AM" : "AT 10 AM"),
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
      className={`reveal-seq ${isAmharic ? "amharic-section" : ""} scroll-mt-24 relative h-[100svh] min-h-[100svh] lg:h-screen flex flex-col justify-center overflow-hidden bg-[#F3F2EE]`}
    >
      {/* Invitation artwork background */}
      <div data-seq="bg" className="absolute inset-0 z-0 pointer-events-none select-none block">
        <Image
          src="/main inv.png"
          alt="Invitation section background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="w-full h-full object-cover object-center"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#b38a62]/20 mix-blend-multiply" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-gradient-to-b from-[#c7a378]/55 via-[#dfc29f]/25 to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center">
          
          {/* Section Header with seamless luminous parchment vignette on small screens to prevent flower overlap */}
          {/* The Fine-Art Wedding Invitation Card - Grand, Prominent & Perfectly Proportioned */}
          <div className="w-full max-w-[460px] sm:max-w-[500px]">
          <article data-seq="card" style={{ ...seq("0.6s", "1300ms"), "--photo-rise": "14px" } as CSSProperties} className="relative z-20 min-h-[520px] bg-[#FAF5EE] rounded-sm p-5 sm:min-h-[590px] sm:p-7 md:p-8 text-left border border-[#E8DFD3] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28),0_10px_24px_-6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <Image src="/card bg.png" alt="" fill sizes="(max-width: 640px) 92vw, 500px" className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover" aria-hidden />
            
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
              <div className="max-w-[72%] sm:max-w-[68%] space-y-4 sm:space-y-4.5 lg:space-y-4 xl:space-y-4.5">
                
                {/* Couple Header - Title Case */}
                <div className="space-y-1.5">
                  <p data-seq="fade" style={seq("2.0s", "900ms")} className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-[#7C5A32]">
                    {isAmharic ? "የሰርግ ግብዣ" : "The Wedding Of"}
                  </p>
                  <h3 className="font-editorial-serif text-[clamp(1.75rem,3.8vw,2.35rem)] lg:text-[2.05rem] xl:text-[2.35rem] text-[#1E140E] leading-[1.05] tracking-[-0.01em]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span data-seq="rise" style={seq("2.25s", "1000ms", "10px")} className="capitalize">{wedding.couple.first}</span>
                      <span data-seq="rise" style={seq("2.6s", "1000ms", "8px")} className="font-editorial-serif italic font-light text-[0.8em] tracking-normal text-[#9A7338]">
                        {isAmharic ? "እና" : "and"}
                      </span>
                    </div>
                    <span data-seq="rise" style={seq("2.9s", "1000ms", "10px")} className="block mt-0.5 capitalize">
                      {wedding.couple.second}
                    </span>
                  </h3>
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
                    <span>{isAmharic ? "RSVP በመስመር ላይ" : "RSVP Online"}</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>

              </div>

              <div data-seq="fade" style={seq("4.4s", "1100ms")} className="mt-10 max-w-[82%] border-t border-[#8C6A3B]/25 pt-4 sm:mt-14">
                <p className="font-editorial-serif text-xs italic leading-relaxed text-[#553C2D] opacity-85 sm:text-sm">
                  {isAmharic ? "ፍቅር ታጋሽ ነው፣ ፍቅር ቸር ነው። ፍቅር አይወድቅም።" : wedding.scripture.verse}
                </p>
                <span className="mt-2 block font-sans text-[9px] uppercase tracking-[0.18em] text-[#8C6A3B]">1 Corinthians 13:4–8</span>
              </div>

            </div>
          </article>
        </div>

        </div>
      </div>
    </section>
  );
}
