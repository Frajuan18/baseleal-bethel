"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { toEthiopian, wedding } from "@/config/wedding";
import { useWeddingLanguage } from "./LanguageContext";
import { useInvitation } from "./InvitationContext";

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
  const isBoth = !hasToken || ["CHURCH_AND_HOME", "CHURCH_AND_BOTH", "CHURCH_AND_BASSELEAL", "CHURCH_AND_BETHEL"].includes(invitation?.invitationType || "");
  const homeBadgeLabel = invitation?.invitationType === "CHURCH_AND_BASSELEAL"
    ? (isAmharic ? "የባስልኤል ቤት" : "Basseleal's")
    : invitation?.invitationType === "CHURCH_AND_BETHEL"
    ? (isAmharic ? "የቤቴል ቤት" : "Bethel's")
    : (isAmharic ? "ቤት" : "Home");
  const isHomeOnly = hasToken && invitation?.invitationType === "HOME";
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
      className="reveal-seq amharic-section scroll-mt-24 relative h-[100svh] min-h-[100svh] lg:h-screen flex flex-col justify-center overflow-hidden bg-[#F3F2EE]"
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
        <div className="pointer-events-none absolute left-[11%] top-1/2 z-0 hidden h-[82%] w-[25%] -translate-y-1/2 opacity-75 md:block lg:left-[13%] lg:w-[23%]" aria-hidden>
          <Image
            src="/white flower.png"
            alt=""
            fill
            sizes="25vw"
            className="object-contain object-right"
          />
        </div>
        <div className="pointer-events-none absolute right-[11%] top-1/2 z-0 hidden h-[82%] w-[25%] -translate-y-1/2 opacity-75 md:block lg:right-[13%] lg:w-[23%]" aria-hidden>
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
          <div className="relative w-full max-w-[460px] sm:max-w-[500px]">
          <article data-seq="card" style={{ ...seq("0.6s", "1300ms"), "--photo-rise": "14px" } as CSSProperties} className="relative z-20 bg-[#FAF5EE] rounded-sm p-5 sm:p-7 md:p-8 text-left border border-[#E8DFD3] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28),0_10px_24px_-6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
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
              <div className="max-w-[72%] sm:max-w-[68%] space-y-3.5 sm:space-y-4">
                
                {/* Couple Header - Title Case */}
                <div className="space-y-1.5">
                  {invitation?.guestName && (
                    <p data-seq="fade" style={seq("1.8s", "900ms")} className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold text-[#8C6A3B]">
                      {isAmharic ? `ክቡር/ት ${invitation.guestName}` : `Honored Guest: ${invitation.guestName}`}
                    </p>
                  )}
                  <p data-seq="fade" style={seq("2.0s", "900ms")} className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-[#7C5A32]">
                    {isAmharic ? "የጋብቻ ሥነ-ሥርዓት" : "The Wedding Of"}
                  </p>
                  <h3 className="font-editorial-serif text-[clamp(1.75rem,3.8vw,2.35rem)] lg:text-[2.05rem] xl:text-[2.35rem] text-[#1E140E] leading-[1.05] tracking-[-0.01em]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span data-seq="rise" style={seq("2.25s", "1000ms", "10px")} className={`capitalize font-semibold ${isAmharic ? "amharic-title" : ""}`}>{isAmharic ? "ባስልኤል" : wedding.couple.first}</span>
                      <span data-seq="rise" style={seq("2.6s", "1000ms", "8px")} className="font-editorial-serif italic font-light text-[0.8em] tracking-normal text-[#9A7338]">
                        {isAmharic ? "እና" : "and"}
                      </span>
                    </div>
                    <span data-seq="rise" style={seq("2.9s", "1000ms", "10px")} className={`block mt-0.5 capitalize font-semibold ${isAmharic ? "amharic-title" : ""}`}>
                      {isAmharic ? "ቤቴል" : wedding.couple.second}
                    </span>
                  </h3>
                </div>

                {/* 2-Column Vertical Hairline Date Lockup */}
                <div data-seq="rise" style={seq("3.4s", "1000ms", "12px")} className="pt-1.5 sm:pt-2">
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
                <div data-seq="rise" style={seq("3.55s", "1000ms", "10px")} className="pt-1">
                  {isBoth ? (
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
                      {/* Church Time Badge */}
                      <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-xl border border-[#8C6A3B]/40 bg-[#FAF5EE] px-3.5 py-2 shadow-[0_2px_8px_rgba(43,24,16,0.06)]">
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-bold text-[#7C5A32]">
                            {isAmharic ? "ቤተክርስቲያን" : "Church"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-[#8C6A3B] font-medium tracking-wider mt-0.5">
                            {isAmharic ? "የሀገር ውስጥ" : "Local Time"}
                          </span>
                        </div>
                        <div className="h-7 w-px bg-[#8C6A3B]/40" aria-hidden />
                        <div className="flex items-baseline gap-1">
                          <span className="font-benaiah text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#1E140E] leading-none tracking-tight">
                            9:00
                          </span>
                          {isAmharic && (
                            <span className="font-balderasu text-xs font-semibold text-[#5A3E26]">
                              ሰዓት
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Home Time Badge */}
                      <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-xl border border-[#8C6A3B]/40 bg-[#FAF5EE] px-3.5 py-2 shadow-[0_2px_8px_rgba(43,24,16,0.06)]">
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-bold text-[#7C5A32]">
                            {homeBadgeLabel}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-[#8C6A3B] font-medium tracking-wider mt-0.5">
                            {isAmharic ? "አቀባበል" : "Reception"}
                          </span>
                        </div>
                        <div className="h-7 w-px bg-[#8C6A3B]/40" aria-hidden />
                        <div className="flex items-baseline gap-1">
                          <span className="font-benaiah text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#1E140E] leading-none tracking-tight">
                            4:30
                          </span>
                          {isAmharic && (
                            <span className="font-balderasu text-xs font-semibold text-[#5A3E26]">
                              ሰዓት
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : isHomeOnly ? (
                    <div className="inline-flex items-center gap-3 rounded-xl border border-[#8C6A3B]/40 bg-[#FAF5EE] px-4 py-2 shadow-[0_2px_8px_rgba(43,24,16,0.06)]">
                      <div className="flex flex-col text-left leading-tight">
                        <span className="font-sans text-[10px] uppercase tracking-[0.18em] font-bold text-[#7C5A32]">
                          {isAmharic ? "ቤት" : "Home"}
                        </span>
                        <span className="text-[10px] text-[#8C6A3B] font-medium tracking-wider mt-0.5">
                          {isAmharic ? "አቀባበል" : "Reception"}
                        </span>
                      </div>
                      <div className="h-7 w-px bg-[#8C6A3B]/40" aria-hidden />
                      <div className="flex items-baseline gap-1">
                        <span className="font-benaiah text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#1E140E] leading-none tracking-tight">
                          4:30
                        </span>
                        {isAmharic && (
                          <span className="font-balderasu text-xs font-semibold text-[#5A3E26]">
                            ሰዓት
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-3 rounded-xl border border-[#8C6A3B]/40 bg-[#FAF5EE] px-4 py-2 shadow-[0_2px_8px_rgba(43,24,16,0.06)]">
                      <div className="flex flex-col text-left leading-tight">
                        <span className="font-sans text-[10px] uppercase tracking-[0.18em] font-bold text-[#7C5A32]">
                          {isAmharic ? "ቤተክርስቲያን" : "Church"}
                        </span>
                        <span className="text-[10px] text-[#8C6A3B] font-medium tracking-wider mt-0.5">
                          {isAmharic ? "የሀገር ውስጥ" : "Local Time"}
                        </span>
                      </div>
                      <div className="h-7 w-px bg-[#8C6A3B]/40" aria-hidden />
                      <div className="flex items-baseline gap-1">
                        <span className="font-benaiah text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#1E140E] leading-none tracking-tight">
                          9:00
                        </span>
                        {isAmharic && (
                          <span className="font-balderasu text-xs font-semibold text-[#5A3E26]">
                            ሰዓት
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Venue & Location Block */}
                <div data-seq="rise" style={seq("3.65s", "1000ms", "10px")} className="space-y-0.5">
                  <p className="font-editorial-serif uppercase tracking-[0.18em] text-[11px] sm:text-xs text-[#22150D] font-medium leading-relaxed">
                    {isBoth
                      ? (isAmharic ? "ሀልዎት አማኑኤል (9:00) እና ቤት (4:30)" : "Halwot Emmanuel Church (9:00) & Home (4:30)")
                      : isHomeOnly
                      ? (isAmharic ? "የቤት አቀባበል (4:30)" : "Home Reception (4:30)")
                      : (isAmharic ? "ሀልዎት አማኑኤል አጥቢያ ቤተክርስቲያን (9:00)" : "Halwot Emmanuel Church (9:00 Local Time)")}
                  </p>
                  <p className="font-editorial-serif uppercase tracking-[0.16em] text-[10px] sm:text-[11px] text-[#634838] leading-relaxed">
                    {isAmharic ? "አዲስ አበባ፣ ኢትዮጵያ" : wedding.city}
                  </p>
                </div>

                {/* Two-statement invitation */}
                <div data-seq="rise" style={seq("3.95s", "1100ms", "6px")} className="space-y-2 pt-1 text-[#4A3527]">
                  <p className={`leading-relaxed ${isAmharic ? "font-benaiah text-[13px]" : "font-editorial-serif text-[13px] italic"}`}>
                    {isBoth
                      ? (isAmharic
                          ? "ከቤተሰቦቻችን ጋር በመሆን፣ በሀልዎት አማኑኤል አጥቢያ ቤተክርስቲያን (በ 9:00 ሰዓት) እና በቤታችን አቀባበል (በ 4:30 ሰዓት) ላይ ተገኝተው ደስታችንን እንዲካፈሉ በአክብሮት እንጋብዝዎታለን።"
                          : "Together with our families, we warmly invite you to join us at Halwot Emmanuel Church at 9:00 (Local Time) and home celebration at 4:30 as we exchange our vows and begin our life together.")
                      : isHomeOnly
                      ? (isAmharic
                          ? "ከቤተሰቦቻችን ጋር በመሆን፣ በቤታችን አቀባበል (በ 4:30 ሰዓት) ላይ ተገኝተው ደስታችንን እንዲካፈሉ በአክብሮት እንጋብዝዎታለን።"
                          : "Together with our families, we warmly invite you to join our home celebration at 4:30 as we begin our life together.")
                      : (isAmharic
                          ? "ከቤተሰቦቻችን ጋር በመሆን፣ በሀልዎት አማኑኤል አጥቢያ ቤተክርስቲያን (በ 9:00 ሰዓት) ላይ ተገኝተው ደስታችንን እንዲካፈሉ በአክብሮት እንጋብዝዎታለን።"
                          : "Together with our families, we warmly invite you to Halwot Emmanuel Church at 9:00 (Local Time) as we exchange our vows.")}
                  </p>
                  <p className={`leading-relaxed ${isAmharic ? "font-benaiah text-[13px]" : "font-editorial-serif text-[13px] italic"}`}>
                    {isAmharic
                      ? "መገኘትዎ፣ ፍቅርዎ እና በረከትዎ የደስታችን ሙሉ ይሆናል።"
                      : "Your presence, love, and blessings would make our celebration complete."}
                  </p>
                </div>

              </div>

              <div data-seq="rise" style={seq("4.4s", "1100ms", "6px")} className="mt-6 max-w-[82%] border-t border-[#8C6A3B]/25 pt-5 sm:mt-8">
                <a
                  href="#rsvp"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold bg-[#2B1810] text-[#FAF6F0] hover:bg-[#8C6A3B] transition-all duration-[420ms] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2 focus:ring-offset-[#FAF5EE]"
                >
                  <span>{isAmharic ? "በኦንላይን መገኘትዎን ያረጋግጡ (RSVP)" : "RSVP Online"}</span>
                  <span aria-hidden>→</span>
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
