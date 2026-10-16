"use client";

import Image from "next/image";
import { wedding } from "@/config/wedding";

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
      className="relative py-16 sm:py-20 lg:py-6 xl:py-8 lg:h-[100dvh] lg:max-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[#F5F7FA]"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col items-center justify-center">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6 lg:mb-5">
          <p className="eyebrow mb-1.5 text-[#8C6A3B] text-xs uppercase tracking-[0.26em] font-semibold">
            Our Covenant
          </p>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-[2.6rem] tracking-tight text-[#2B1810]">
            A Day to Hold Close
          </h2>
          <div className="h-px w-14 mx-auto mt-2.5 mb-2.5 bg-[#8C6A3B]/50" />
        </div>

        {/* The Fine-Art Wedding Invitation Card - Grand, Prominent & Perfectly Proportioned */}
        <div className="max-w-[560px] sm:max-w-[600px] md:max-w-[620px] mx-auto w-full">
          <article className="relative z-20 bg-[#FAF5EE] rounded-sm p-6 sm:p-9 md:p-10 lg:p-8 xl:p-10 text-left border border-[#E8DFD3] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28),0_10px_24px_-6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
            
            {/* Fine Tactile Cotton Paper Texture Overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-multiply select-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
              }}
              aria-hidden
            />

            {/* Sculptural Pleated Silk Floral Artwork in Top-Right Corner - Dedicated Quadrant */}
            <div className="pointer-events-none absolute top-0 right-0 w-[38%] sm:w-[40%] md:w-[42%] max-w-[245px] aspect-[1087/1447] select-none overflow-hidden z-10 opacity-95">
              <Image
                src="/card flower.png"
                alt="Artisan pleated silk floral sculpture"
                fill
                priority
                sizes="(max-width: 640px) 180px, 245px"
                className="object-contain object-top-right filter saturate-[0.98] contrast-[1.02]"
              />
            </div>

            {/* Content Layer: Left-Aligned Editorial Stationery Typography */}
            <div className="relative z-20 flex flex-col justify-between h-full text-left">
              
              {/* Main Typography Block - Left Column strictly separated from flower */}
              <div className="max-w-[55%] sm:max-w-[52%] md:max-w-[50%] space-y-4 sm:space-y-4.5 lg:space-y-4 xl:space-y-4.5">
                
                {/* Couple Header - Title Case */}
                <div className="space-y-1.5">
                  <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-[#7C5A32]">
                    The Wedding Of
                  </p>
                  <h3 className="font-editorial-serif text-[clamp(1.75rem,3.8vw,2.35rem)] lg:text-[2.05rem] xl:text-[2.35rem] text-[#1E140E] leading-[1.05] tracking-[-0.01em]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="capitalize">{wedding.couple.first}</span>
                      <span className="font-editorial-serif italic font-light text-[0.8em] tracking-normal text-[#9A7338]">
                        and
                      </span>
                    </div>
                    <span className="block mt-0.5 capitalize">
                      {wedding.couple.second}
                    </span>
                  </h3>
                </div>

                {/* Invitation Request Line */}
                <div className="space-y-1">
                  <p className="font-editorial-serif uppercase tracking-[0.2em] text-[9.5px] sm:text-[10px] text-[#3E2B20]/90 font-medium leading-relaxed">
                    Request The Presence Of Your Company
                  </p>
                  <p className="font-editorial-serif uppercase tracking-[0.2em] text-[9.5px] sm:text-[10px] text-[#3E2B20]/90 font-medium leading-relaxed">
                    For Their Upcoming Wedding
                  </p>
                </div>

                {/* 3-Column Vertical Hairline Date Lockup */}
                <div className="pt-1.5 sm:pt-2">
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
                <div className="space-y-0.5">
                  <p className="font-editorial-serif uppercase tracking-[0.18em] text-[11px] sm:text-xs text-[#22150D] font-medium leading-relaxed">
                    {wedding.venue}
                  </p>
                  <p className="font-editorial-serif uppercase tracking-[0.16em] text-[10px] sm:text-[11px] text-[#634838] leading-relaxed">
                    {wedding.city}
                  </p>
                </div>

                {/* RSVP Online CTA Button */}
                <div className="pt-1">
                  <a
                    href="#rsvp"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold bg-[#2B1810] text-[#FAF6F0] hover:bg-[#8C6A3B] transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2 focus:ring-offset-[#FAF5EE]"
                  >
                    <span>RSVP Online</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>

              </div>

              {/* Scripture Blessing at Bottom */}
              <div className="pt-4 sm:pt-5 opacity-80 max-w-[80%]">
                <p className="font-editorial-serif italic text-xs sm:text-[13px] text-[#553C2D] leading-relaxed">
                  {wedding.scripture.verse}
                </p>
              </div>

            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
