"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { toEthiopian, wedding } from "@/config/wedding";
import { useWeddingLanguage } from "./LanguageContext";
import { useInvitation } from "./InvitationContext";
import { parseInvitationVenues } from "@/app/lib/venues";

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
  const { invitation, hasToken } = useInvitation();
  const venues = parseInvitationVenues(hasToken ? invitation?.invitationType : undefined);
  const hasChurch = venues.church;
  const hasBasseleal = venues.basseleal;
  const hasBethel = venues.bethel;
  const hasBothHomes = hasBasseleal && hasBethel;
  const hasAnyHome = hasBasseleal || hasBethel;
  const isBoth = hasChurch && hasAnyHome;
  const isHomeOnly = !hasChurch && hasAnyHome;
  const ethiopian = toEthiopian(wedding.date);
  // Structured date lockup data — Amharic uses the Ethiopian calendar date
  const parsedDate = (() => {
    if (wedding.date) {
      const parts = wedding.date.split("-").map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        if (isAmharic && ethiopian) {
          const weekdaysAm = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];
          return {
            weekday: weekdaysAm[dt.getUTCDay()] ?? "",
            month: ethiopian.monthName,
            day: String(ethiopian.day),
            year: String(ethiopian.year),
            time: "ከጠዋቱ 4:00 ሰዓት",
          };
        }
        const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
        return {
          weekday: weekdays[dt.getUTCDay()] ?? "SATURDAY",
          month: months[m - 1] ?? "DEC",
          day: String(d),
          year: String(y),
          time: wedding.time ? `AT ${wedding.time}` : "AT 10 AM",
        };
      }
    }
    return {
      weekday: "SATURDAY",
      month: "DEC",
      day: "26",
      year: "2026",
      time: "AT 10 AM",
    };
  })();

  return (
    <section
      id="invitation"
      data-reveal
      data-language={isAmharic ? "am" : "en"}
      className="reveal-seq amharic-section scroll-mt-24 relative min-h-[110svh] py-16 sm:py-24 md:py-28 lg:min-h-[115vh] lg:py-32 flex flex-col justify-center overflow-hidden bg-[#F3F2EE]"
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
        {/* White botanical artwork frames the card on larger screens without competing with its content. */}
        <div className="pointer-events-none absolute left-[11%] top-1/2 z-0 hidden h-[82%] w-[25%] -translate-y-1/2 opacity-75 md:block lg:left-[13%] lg:w-[23%] botanical-left" aria-hidden>
          <Image
            src="/white flower.png"
            alt=""
            fill
            sizes="25vw"
            className="object-contain object-right"
          />
        </div>
        <div className="pointer-events-none absolute right-[11%] top-1/2 z-0 hidden h-[82%] w-[25%] -translate-y-1/2 opacity-75 md:block lg:right-[13%] lg:w-[23%] botanical-right" aria-hidden>
          <Image
            src="/white flower.png"
            alt=""
            fill
            sizes="25vw"
            className="object-contain object-left scale-x-[-1]"
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          
          {/* The Fine-Art Wedding Invitation Card - Grand, Prominent & Perfectly Proportioned */}
          <div className="relative w-full max-w-[560px] sm:max-w-[620px]">
          <article data-seq="card" style={{ ...seq("0.08s", "900ms"), "--card-rise": "20px" } as CSSProperties} className="relative z-20 bg-white rounded-2xl p-6 sm:p-8 md:p-9 text-left border-0 shadow-[0_25px_60px_-12px_rgba(43,24,16,0.18),0_12px_28px_-8px_rgba(43,24,16,0.1)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <Image src="/card bg.png" alt="" fill sizes="(max-width: 640px) 92vw, 620px" className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-30" aria-hidden />
            
            {/* Fine Tactile Cotton Paper Texture Overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply select-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
              }}
              aria-hidden
            />

            {/* Sculptural Pleated Silk Floral Artwork in Top-Right Corner - Inset gracefully & slender */}
            <div data-seq="draw-down" style={seq("0.2s", "800ms")} className="pointer-events-none absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3 w-[33%] sm:w-[35%] md:w-[36%] max-w-[210px] aspect-[1087/1447] select-none z-10 opacity-95">
              <Image
                src="/card flower.png"
                alt="Artisan pleated silk floral sculpture"
                fill
                priority
                sizes="(max-width: 640px) 160px, 210px"
                className="object-contain object-top-right filter saturate-[0.98] contrast-[1.02]"
              />
            </div>

            {/* Content Layer: Left-Aligned Editorial Stationery Typography */}
            <div className="relative z-20 flex flex-col justify-between h-full text-left">
              
              {/* Main Typography Block */}
              <div className="w-full space-y-3.5 sm:space-y-4">
                
                {/* Couple Header - Title Case */}
                <div className="space-y-1.5 max-w-[68%] sm:max-w-[72%]">
                  {invitation?.guestName && (
                    <div
                      data-seq="fade"
                      style={seq("0.16s", "800ms")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#8C6A3B]/10 border border-[#8C6A3B]/35 px-3 py-1 mb-1 max-w-full shadow-xs"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C6A3B]" aria-hidden />
                      <span className={`${isAmharic ? "font-benaiah text-xs sm:text-sm font-semibold tracking-normal" : "font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-semibold"} text-[#5A3E26] truncate`}>
                        {isAmharic ? `ለተከበሩ ${invitation.guestName}` : `Honored Guest: ${invitation.guestName}`}
                      </span>
                    </div>
                  )}
                  <p data-seq="fade" style={seq("0.22s", "800ms")} className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-[#7C5A32]">
                    {isAmharic ? "የጋብቻ ሥነ-ሥርዓት" : "The Wedding Of"}
                  </p>
                  <h3 className="text-[#1E140E] leading-tight tracking-[-0.01em]">
                    <div className="inline-flex items-baseline gap-2 sm:gap-2.5 flex-nowrap whitespace-nowrap">
                      <span data-seq="rise" style={seq("0.28s", "850ms", "8px")} className={`capitalize font-semibold text-[clamp(1.65rem,3.4vw,2.25rem)] ${isAmharic ? "amharic-title font-jegna-title" : "font-editorial-serif"}`}>
                        {isAmharic ? "ባስልኤል" : wedding.couple.first}
                      </span>
                      <span data-seq="rise" style={seq("0.32s", "850ms", "6px")} className="font-editorial-serif italic font-light text-base sm:text-lg tracking-normal text-[#9A7338]">
                        {isAmharic ? "እና" : "and"}
                      </span>
                      <span data-seq="rise" style={seq("0.36s", "850ms", "8px")} className={`capitalize font-semibold text-[clamp(1.65rem,3.4vw,2.25rem)] ${isAmharic ? "amharic-title font-jegna-title" : "font-editorial-serif"}`}>
                        {isAmharic ? "ቤቴል" : wedding.couple.second}
                      </span>
                    </div>
                  </h3>
                </div>

                {/* 2-Column Vertical Hairline Date Lockup */}
                <div data-seq="rise" style={seq("0.4s", "850ms", "10px")} className="pt-1.5 sm:pt-2 max-w-[68%] sm:max-w-[72%]">
                  <div className="inline-flex items-center text-[#1E140E]">
                    {/* Left: Day of Week */}
                    <div className="pr-4 sm:pr-6 text-left">
                      <span className={`${isAmharic ? "amharic-title" : "font-editorial-serif"} uppercase tracking-[0.18em] text-sm sm:text-base md:text-lg font-medium text-[#2B1810]`}>
                        {parsedDate.weekday}
                      </span>
                    </div>

                    {/* Hairline Separator */}
                    <div className="h-12 sm:h-14 w-px bg-[#2B1810]/40" />

                    {/* Right: Stacked Month, Day Number, Year */}
                    <div className="pl-4 sm:pl-6 text-center flex flex-col items-center justify-center">
                      <span className={`${isAmharic ? "amharic-title" : "font-sans"} uppercase tracking-[0.22em] text-[10px] sm:text-[11px] font-semibold text-[#7C5A32]`}>
                        {parsedDate.month}
                      </span>
                      <span className={`${isAmharic ? "amharic-title" : "font-editorial-serif"} text-2xl sm:text-3xl md:text-[2.2rem] font-semibold leading-none my-0.5 text-[#1E140E]`}>
                        {parsedDate.day}
                      </span>
                      <span className={`${isAmharic ? "amharic-title" : "font-sans"} uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium text-[#7C5A32]`}>
                        {parsedDate.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prominently Positioned Time Indications */}
                <div data-seq="rise" style={seq("0.46s", "850ms", "8px")} className="pt-1">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
                    {/* Church Time Badge */}
                    {hasChurch && (
                      <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-xl border border-[#8C6A3B]/40 bg-[#FAF5EE] px-3.5 py-2 shadow-[0_2px_8px_rgba(43,24,16,0.06)]">
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-bold text-[#7C5A32]">
                            {isAmharic ? "ቤተክርስቲያን" : "Church"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-[#8C6A3B] font-medium tracking-wider mt-0.5">
                            {isAmharic ? "ከሰዓት" : "Ceremony"}
                          </span>
                        </div>
                        <div className="h-7 w-px bg-[#8C6A3B]/40" aria-hidden />
                        <div className="flex items-baseline gap-1">
                          <span className="font-benaiah text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#1E140E] leading-none tracking-tight">
                            {isAmharic ? "9:00" : "3:00"}
                          </span>
                          {isAmharic ? (
                            <span className="font-balderasu text-xs font-semibold text-[#5A3E26]">
                              ሰዓት
                            </span>
                          ) : (
                            <span className="font-sans text-xs font-bold text-[#5A3E26] uppercase ml-0.5">
                              pm
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Basseleal's Home Time Badge */}
                    {hasBasseleal && (
                      <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-xl border border-[#8C6A3B]/40 bg-[#FAF5EE] px-3.5 py-2 shadow-[0_2px_8px_rgba(43,24,16,0.06)]">
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-bold text-[#7C5A32]">
                            {isAmharic ? "ባስልኤል ቤት" : "Basseleal's"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-[#8C6A3B] font-medium tracking-wider mt-0.5">
                            {isAmharic ? "አቀባበል" : "Reception"}
                          </span>
                        </div>
                        <div className="h-7 w-px bg-[#8C6A3B]/40" aria-hidden />
                        <div className="flex items-baseline gap-1">
                          <span className="font-benaiah text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#1E140E] leading-none tracking-tight">
                            {isAmharic ? "4:30" : "10:30"}
                          </span>
                          {isAmharic ? (
                            <span className="font-balderasu text-xs font-semibold text-[#5A3E26]">
                              ሰዓት
                            </span>
                          ) : (
                            <span className="font-sans text-xs font-bold text-[#5A3E26] uppercase ml-0.5">
                              am
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bethel's Home Time Badge */}
                    {hasBethel && (
                      <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-xl border border-[#8C6A3B]/40 bg-[#FAF5EE] px-3.5 py-2 shadow-[0_2px_8px_rgba(43,24,16,0.06)]">
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-bold text-[#7C5A32]">
                            {isAmharic ? "ቤቴል ቤት" : "Bethel's"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-[#8C6A3B] font-medium tracking-wider mt-0.5">
                            {isAmharic ? "አቀባበል" : "Reception"}
                          </span>
                        </div>
                        <div className="h-7 w-px bg-[#8C6A3B]/40" aria-hidden />
                        <div className="flex items-baseline gap-1">
                          <span className="font-benaiah text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#1E140E] leading-none tracking-tight">
                            {isAmharic ? "4:30" : "10:30"}
                          </span>
                          {isAmharic ? (
                            <span className="font-balderasu text-xs font-semibold text-[#5A3E26]">
                              ሰዓት
                            </span>
                          ) : (
                            <span className="font-sans text-xs font-bold text-[#5A3E26] uppercase ml-0.5">
                              am
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Venue & Location Block */}
                <div data-seq="rise" style={seq("0.52s", "850ms", "8px")} className="space-y-1 pt-1">
                  <div className="inline-block rounded-lg bg-[#8C6A3B]/10 border border-[#8C6A3B]/25 px-3 py-1.5 shadow-[0_2px_8px_rgba(43,24,16,0.05)]">
                    <p className="font-editorial-serif text-xs sm:text-[13px] md:text-sm font-bold text-[#1E140E] tracking-wide leading-snug">
                      {hasChurch && (
                        <>
                          <span className={isAmharic ? "font-jegna-title" : ""}>
                            {isAmharic ? "ሀልዎት አማኑኤል ህብረት ቤተክርስቲያን" : "Halwot Emmanuel United Church"}
                          </span>
                          <span className="font-benaiah text-sm sm:text-base md:text-lg font-bold text-[#8C6A3B] mx-1">
                            {isAmharic ? "(9:00 ሰዓት)" : "(3:00 pm)"}
                          </span>
                        </>
                      )}
                      {hasChurch && hasAnyHome && (
                        <span className="text-[#8C6A3B] font-light mx-1">&amp;</span>
                      )}
                      {hasAnyHome && (
                        <>
                          <span className={`ml-1 ${isAmharic ? "font-jegna-title" : ""}`}>
                            {hasBothHomes
                              ? (isAmharic ? "ባስልኤል እና ቤቴል ቤት" : "Basseleal & Bethel's House")
                              : hasBasseleal
                              ? (isAmharic ? "ባስልኤል ቤት" : "Basseleal's House")
                              : (isAmharic ? "ቤቴል ቤት" : "Bethel's House")}
                          </span>
                          <span className="font-benaiah text-sm sm:text-base md:text-lg font-bold text-[#8C6A3B] ml-1">
                            {isAmharic ? "(4:30 ሰዓት)" : "(10:30 am)"}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <p className="font-editorial-serif uppercase tracking-[0.16em] text-[10px] sm:text-[11px] text-[#634838] leading-relaxed pl-0.5">
                    {isAmharic ? "አዲስ አበባ፣ ኢትዮጵያ" : wedding.city}
                  </p>
                </div>

                {/* Invitation statement — takes full horizontal space */}
                <div data-seq="rise" style={seq("0.58s", "850ms", "6px")} className="w-full pt-2 text-[#4A3527]">
                  <p className={`w-full leading-relaxed ${isAmharic ? "font-benaiah text-[13.5px] sm:text-[14.5px]" : "font-editorial-serif text-[13.5px] sm:text-[14.5px] italic"}`}>
                    {hasChurch && hasAnyHome ? (
                      isAmharic
                        ? `ከቤተሰቦቻችን ጋር በመሆን፣ ቃል ኪዳን የምንገባበትንና አብረን አዲሱን ህይወታችንን የምንጀምርበትን የሰርግ ስነ-ስርዓት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን ከቀኑ 9:00 (በኢትዮጵያ አቆጣጠር)፣ በመቀጠልም ${hasBothHomes ? "በባስልኤል እና በቤቴል ቤት" : hasBasseleal ? "በባስልኤል ቤት" : "በቤቴል ቤት"} ከጠዋቱ 4:30 ጀምሮ በሚደረገው ደማቅ ዝግጅት ላይ አብረውን እንዲያከብሩ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።`
                        : `Together with our families, we warmly invite you to join us at Halwot Emmanuel United Church at 3:00 pm and ${hasBothHomes ? "home celebrations" : hasBasseleal ? "Basseleal's home celebration" : "Bethel's home celebration"} at 10:30 am as we exchange our vows and begin our life together.`
                    ) : hasChurch ? (
                      isAmharic
                        ? "ከቤተሰቦቻችን ጋር በመሆን፣ ቃል ኪዳን የምንገባበትን የሰርግ ስነ-ስርዓት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን ከቀኑ 9:00 (በኢትዮጵያ አቆጣጠር) ላይ ተገኝተው አብረውን እንዲያከብሩ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።"
                        : "Together with our families, we warmly invite you to Halwot Emmanuel United Church at 3:00 pm as we exchange our vows."
                    ) : (
                      isAmharic
                        ? `ከቤተሰቦቻችን ጋር በመሆን፣ ${hasBothHomes ? "በባስልኤል እና በቤቴል ቤት" : hasBasseleal ? "በባስልኤል ቤት" : "በቤቴል ቤት"} ከጠዋቱ 4:30 ጀምሮ በሚደረገው የቤት አቀባበል ላይ ተገኝተው ደስታችንን እንዲካፈሉ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።`
                        : `Together with our families, we warmly invite you to join ${hasBothHomes ? "our home celebrations" : hasBasseleal ? "Basseleal's home celebration" : "Bethel's home celebration"} at 10:30 am as we begin our life together.`
                    )}
                  </p>
                </div>

              </div>

              <div data-seq="rise" style={seq("0.64s", "850ms", "6px")} className="mt-6 w-full border-t border-[#8C6A3B]/25 pt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#rsvp"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold bg-[#2B1810] text-[#FAF6F0] hover:bg-[#8C6A3B] transition-all duration-[420ms] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2 focus:ring-offset-[#FAF5EE]"
                >
                  <span className={isAmharic ? "font-benaiah text-xs sm:text-sm tracking-normal font-bold" : ""}>
                    {isAmharic ? "የመገኘትዎን ሁኔታ በበይነ-መረብ ያሳውቁ" : "RSVP Online"}
                  </span>
                  <span aria-hidden>→</span>
                </a>

                <a
                  href="#directions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold border border-[#2B1810]/30 bg-white/70 text-[#2B1810] hover:bg-[#2B1810] hover:text-[#FAF6F0] transition-all duration-[420ms] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#8C6A3B]"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span className={isAmharic ? "font-benaiah text-xs sm:text-sm tracking-normal font-bold" : ""}>
                    {isAmharic ? "የቦታዎች አቅጣጫ" : "Directions"}
                  </span>
                  <span aria-hidden>↓</span>
                </a>
              </div>

            </div>
          </article>
        </div>

        </div>
      </div>
    </section>
  );
}
