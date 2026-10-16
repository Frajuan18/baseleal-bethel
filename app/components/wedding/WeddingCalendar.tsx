"use client";

import { useState } from "react";
import Image from "next/image";
import { coupleName, wedding } from "@/config/wedding";

function downloadICS(year: number, monthIndex: number, dayNumber: number) {
  const timeString = wedding.time || "10:00";
  const [hours, minutes] = timeString.split(":").map(Number);

  const startDate = new Date(year, monthIndex, dayNumber, hours || 10, minutes || 0);
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // 5-hour celebration

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDateICS = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Baseleal & Bethel//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-${year}-${monthIndex + 1}-${dayNumber}@baseleal-bethel.wedding`,
    `DTSTAMP:${formatDateICS(new Date())}`,
    `DTSTART:${formatDateICS(startDate)}`,
    `DTEND:${formatDateICS(endDate)}`,
    `SUMMARY:${coupleName}'s Wedding Celebration`,
    `DESCRIPTION:Join Baseleal and Bethel as they exchange their wedding vows and celebrate their holy matrimony.`,
    `LOCATION:${wedding.venue}, ${wedding.city}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${wedding.couple.first}-${wedding.couple.second}-wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function WeddingCalendar() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Default to January 3, 2027 or dynamically parse from wedding.date if set
  let year = 2027;
  let monthIndex = 0; // January (0-indexed: 0 = Jan)
  let dayNumber = 3;
  let weekdayName = "Sunday";
  let monthName = "January";

  if (wedding.date) {
    const parts = wedding.date.split("-").map(Number);
    if (parts.length === 3) {
      year = parts[0];
      monthIndex = parts[1] - 1;
      dayNumber = parts[2];
      const parsed = new Date(year, monthIndex, dayNumber);
      weekdayName = parsed.toLocaleDateString("en-US", { weekday: "long" });
      monthName = parsed.toLocaleDateString("en-US", { month: "long" });
    }
  }

  // Calculate days in month and starting day offset
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDayOffset = new Date(year, monthIndex, 1).getDay(); // 0 = Sun
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleAddToCalendar = () => {
    downloadICS(year, monthIndex, dayNumber);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const timeString = wedding.time || "10:00";
    const [hours, minutes] = timeString.split(":").map(Number);
    const startDate = new Date(year, monthIndex, dayNumber, hours || 10, minutes || 0);
    const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    const formatGCal = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const title = encodeURIComponent(`${coupleName}'s Wedding Celebration`);
    const details = encodeURIComponent(
      `Celebrating the holy matrimony of Baseleal & Bethel.\nVenue: ${wedding.venue}\nCity: ${wedding.city}`
    );
    const location = encodeURIComponent(`${wedding.venue}, ${wedding.city}`);
    const dates = `${formatGCal(startDate)}/${formatGCal(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <section
      id="date"
      className="py-20 sm:py-28 lg:py-36 bg-[#FFF8D6] relative overflow-hidden transition-colors duration-500"
    >
      {/* High-Definition Tactile Paper Noise Layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-multiply select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.2 -0.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Authentic Darker Fiber Dots & Speckles Texture (Handmade Flecked Hard Paper) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-multiply select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='18' cy='24' r='1.3' fill='%234A350E'/%3E%3Ccircle cx='76' cy='42' r='0.9' fill='%235A4215'/%3E%3Ccircle cx='124' cy='18' r='1.2' fill='%233D2B09'/%3E%3Ccircle cx='36' cy='92' r='1.4' fill='%234C3710'/%3E%3Ccircle cx='104' cy='82' r='0.8' fill='%23563F14'/%3E%3Ccircle cx='148' cy='112' r='1.3' fill='%23412E0A'/%3E%3Ccircle cx='62' cy='138' r='1' fill='%234B360E'/%3E%3Ccircle cx='128' cy='146' r='1.5' fill='%23382707'/%3E%3Ccircle cx='92' cy='122' r='0.8' fill='%23594116'/%3E%3Ccircle cx='12' cy='140' r='1.2' fill='%2347330D'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="eyebrow text-[#8C6A3B] mb-2.5 font-semibold tracking-[0.28em]">
            Save The Date
          </p>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#2B1810] tracking-tight">
            The Day of Our Vows
          </h2>
          <div className="h-px w-16 bg-[#8C6A3B]/50 mx-auto mt-5 mb-5" />
          <p className="text-sm sm:text-base text-[#38281F] leading-relaxed font-normal">
            Mark your calendar to celebrate with us. We want nothing more than to share this sacred day with those who have shaped our lives.
          </p>
        </div>

        {/* Two-Column Editorial & High-End Interactive Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Celebration Details (Directly on Open Textured Background) */}
          <div className="md:col-span-1 lg:col-span-6 flex flex-col justify-between py-2 sm:py-4 px-1 sm:px-3 lg:pr-8">
            <div>
              {/* Eyebrow */}
              <div className="mb-3">
                <span className="eyebrow text-[#8C6A3B] text-[11px] tracking-[0.28em] font-bold">
                  Celebration Details
                </span>
              </div>

              {/* Weekday */}
              <h3 className="font-editorial-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#1E140E] leading-none mb-2 tracking-tight">
                {weekdayName}
              </h3>
              
              {/* Date */}
              <p className="font-editorial-serif font-medium text-2xl sm:text-3xl lg:text-4xl italic text-[#8C6A3B] mb-6">
                {monthName} {dayNumber}, {year}
              </p>

              {/* Delicate Hairline Divider */}
              <div className="h-0.5 w-16 bg-[#8C6A3B]/50 mb-6" />

              {/* Ceremony & Celebration Time - Pure Flowing Editorial Typography */}
              <div className="space-y-2 mb-8 max-w-lg">
                <p className="font-editorial-serif font-medium text-lg sm:text-xl text-[#1E140E] leading-snug">
                  Ceremony begins promptly at{" "}
                  <span className="font-bold text-[#8C6A3B]">
                    {wedding.timeDisplay || "10:00 AM Local Time"}
                  </span>
                </p>
                <p className="text-sm sm:text-base text-[#3E2F26] font-normal leading-relaxed">
                  Reception and joyful celebration to follow immediately after the ceremony.
                </p>
              </div>

              {/* Location & Venue (Clean Minimal Border-Left Accent, No Card Box) */}
              <div className="border-l-2 border-[#8C6A3B] pl-4 sm:pl-5 py-1.5 my-6">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#1E140E]/10 border border-[#8C6A3B]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#8C6A3B]">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 21c-4-4.5-7-8.5-7-12a7 7 0 1 1 14 0c0 3.5-3 7.5-7 12z" />
                      <circle cx="12" cy="9" r="2.5" fill="#8C6A3B" fillOpacity="0.25" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-sans font-bold uppercase tracking-[0.24em] text-[#8C6A3B]">
                      Location &amp; Venue
                    </p>
                    <h4 className="font-editorial-serif text-lg sm:text-xl text-[#1E140E] font-semibold leading-snug mt-1">
                      {wedding.venue} — {wedding.city}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#3E2F26] mt-1 font-normal leading-relaxed">
                      {wedding.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-[#8C6A3B]/25 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={handleAddToCalendar}
                className="min-h-[46px] px-7 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl bg-[#1E140E] text-[#FAF6F0] hover:bg-[#8C6A3B] group focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2"
                aria-label="Download Apple or Outlook iCal invitation"
              >
                <span>{downloadSuccess ? "Invitation Downloaded ✓" : "Add to Calendar"}</span>
                <span className="group-hover:translate-y-0.5 transition-transform" aria-hidden>
                  ↓
                </span>
              </button>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] px-6 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-medium inline-flex items-center justify-center gap-1.5 transition-all duration-300 bg-[#FAF5EE] border border-[#DED2C2] text-[#1E140E] hover:bg-[#FAF8F5] shadow-xs hover:shadow-sm"
              >
                <span>Google Calendar</span>
                <span aria-hidden>↗</span>
              </a>

              {wedding.directionsUrl && (
                <a
                  href={wedding.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-sans uppercase tracking-[0.18em] text-[#1E140E] underline underline-offset-4 hover:text-[#8C6A3B] transition-colors ml-auto py-2"
                >
                  Get Directions ↗
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Calendar Grid in Warm Ivory Linen */}
          <div className="md:col-span-1 lg:col-span-6 flex flex-col justify-between">
            <div className="h-full bg-[#FAF5EE] border border-[#DED2C2] p-6 sm:p-10 shadow-[0_16px_40px_-10px_rgba(43,24,16,0.07)] rounded-md flex flex-col justify-between relative overflow-hidden">
              
              {/* Botanical Corner Flower Illustration at Bottom Right */}
              <div
                className="pointer-events-none absolute -bottom-3 -right-3 w-52 sm:w-64 md:w-72 lg:w-80 select-none z-10 opacity-80 sm:opacity-90 mix-blend-multiply"
                aria-hidden
              >
                <Image
                  src="/calendar flower.png"
                  alt=""
                  width={1024}
                  height={1536}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>

              <div className="relative z-20">
                {/* Calendar Month & Year Bar */}
                <div className="flex items-center justify-between pb-5 border-b border-[#E5DDD2]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-editorial-serif text-3xl sm:text-4xl text-[#1E140E] leading-tight">
                        {monthName}
                      </span>
                      <span className="font-editorial-serif italic text-2xl text-[#8C6A3B]">
                        {year}
                      </span>
                    </div>
                    <span className="block text-[10px] uppercase tracking-[0.25em] text-[#857365] mt-1 font-medium">
                      Wedding Celebration Month
                    </span>
                  </div>

                  {/* Monogram Seal Badge */}
                  <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/50 bg-[#F8F4ED] shadow-xs flex items-center justify-center text-[#8C6A3B] text-sm font-editorial-serif italic tracking-wider">
                    {wedding.couple.monogram}
                  </div>
                </div>

                {/* Weekday Labels (Sun Mon Tue Wed Thu Fri Sat) */}
                <div className="grid grid-cols-7 gap-1 mt-6 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <span
                      key={day}
                      className="text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-[#857365] py-2"
                    >
                      {day}
                    </span>
                  ))}
                </div>

                {/* Day Cells Grid */}
                <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 mt-3 text-center text-xs sm:text-sm">
                  {/* Empty offset days for start of month */}
                  {Array.from({ length: startDayOffset }).map((_, i) => (
                    <span key={`blank-${i}`} className="py-2.5 opacity-0 select-none">
                      0
                    </span>
                  ))}

                  {/* Day numbers */}
                  {days.map((d) => {
                    const isWeddingDay = d === dayNumber;
                    return (
                      <div
                        key={d}
                        className="py-1 flex items-center justify-center relative"
                      >
                        <span
                          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-300 relative ${
                            isWeddingDay
                              ? "bg-[#F3ECE1] text-[#1E140E] font-bold shadow-[0_3px_12px_rgba(180,140,20,0.22)] border-2 border-[#D4AF37] ring-4 ring-[#FAF5EE] scale-110 overflow-hidden"
                              : "text-[#422B20] hover:bg-[#EFE7DC] hover:scale-105"
                          }`}
                          title={isWeddingDay ? `${coupleName}'s Wedding Day!` : undefined}
                        >
                          {isWeddingDay && (
                            <span
                              className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply select-none"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='dotNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23dotNoise)'/%3E%3C/svg%3E")`,
                              }}
                              aria-hidden
                            />
                          )}
                          <span className="relative z-10">{d}</span>
                          {isWeddingDay && (
                            <span
                              className="absolute -top-1 -right-1 text-[10px] text-[#8C6A3B] select-none z-10"
                              aria-hidden
                            >
                              ✦
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
