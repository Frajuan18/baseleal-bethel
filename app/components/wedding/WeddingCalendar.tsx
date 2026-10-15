"use client";

import { useState } from "react";
import { coupleName, wedding } from "@/config/wedding";

function downloadICS(year: number, monthIndex: number, dayNumber: number) {
  if (!wedding.date) return;

  const timeString = wedding.time || "14:00";
  const [hours, minutes] = timeString.split(":").map(Number);

  const startDate = new Date(year, monthIndex, dayNumber, hours || 14, minutes || 0);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4-hour duration

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

  // Determine date details safely
  const hasDate = Boolean(wedding.date);

  // If date is configured (e.g. "2027-08-14"), calculate exact calendar properties
  let year = 2027;
  let monthIndex = 7; // August (0-indexed)
  let dayNumber = 14;
  let weekdayName = "Saturday";
  let monthName = "August";

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
    if (!wedding.date) return "#";
    const timeString = wedding.time || "14:00";
    const [hours, minutes] = timeString.split(":").map(Number);
    const startDate = new Date(year, monthIndex, dayNumber, hours || 14, minutes || 0);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

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
    <section id="date" className="py-20 sm:py-28 lg:py-32 bg-[#EEE5D9]/60 border-y border-[#DED2C2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <p className="eyebrow text-[#B18A54] mb-3">Save The Date</p>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#422B20]">
            The Day of Our Vows
          </h2>
          <div className="h-px w-16 bg-[#B18A54] mx-auto mt-5 mb-5" />
          <p className="text-sm sm:text-base text-[#857365] leading-relaxed">
            Mark your calendar to celebrate with us. We want nothing more than to share this sacred day with those who have shaped our lives.
          </p>
        </div>

        {/* Two-Column Editorial & Interactive Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Big Editorial Date Card */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="bg-[#F8F4ED] p-8 sm:p-12 border border-[#DED2C2] shadow-sm relative">
              <span className="eyebrow text-[#B18A54] block mb-2">
                Celebration Details
              </span>

              {hasDate ? (
                <>
                  <h3 className="font-editorial-serif text-4xl sm:text-5xl text-[#422B20] leading-none mb-3">
                    {weekdayName}
                  </h3>
                  <p className="font-editorial-serif text-2xl sm:text-3xl italic text-[#B18A54] mb-6">
                    {monthName} {dayNumber}, {year}
                  </p>
                  <p className="text-sm text-[#857365] leading-relaxed mb-6">
                    Ceremony begins promptly at{" "}
                    <strong className="text-[#422B20] font-semibold">
                      {wedding.time ? `${wedding.time} Local Time` : wedding.timeDisplay}
                    </strong>
                    . Reception and celebration to follow immediately after the service.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-editorial-serif text-3xl sm:text-4xl text-[#422B20] leading-tight mb-3">
                    Date Awaiting Formal Announcement
                  </h3>
                  <p className="text-sm text-[#857365] leading-relaxed mb-6">
                    We are currently finalizing the church and reception arrangements. The official date and schedule will appear here and in your formal correspondence.
                  </p>
                </>
              )}

              <div className="border-t border-[#DED2C2] pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#B18A54] text-sm mt-0.5" aria-hidden>✦</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#422B20]">
                      Location &amp; Venue
                    </p>
                    <p className="text-sm text-[#857365] mt-0.5">
                      {wedding.venue} — {wedding.city}
                    </p>
                    <p className="text-xs text-[#857365]/80 mt-0.5">
                      {wedding.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  disabled={!hasDate}
                  className="btn-editorial disabled:opacity-40 disabled:cursor-not-allowed group"
                  aria-label="Download Apple / Outlook iCal invitation"
                >
                  <span>{downloadSuccess ? "Invitation Downloaded ✓" : "Add to Calendar"}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden>
                    ↓
                  </span>
                </button>

                {hasDate && (
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-editorial-outline text-[#422B20] text-[10px]"
                  >
                    Google Calendar ↗
                  </a>
                )}

                {wedding.directionsUrl && (
                  <a
                    href={wedding.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-sans uppercase tracking-[0.18em] text-[#422B20] underline underline-offset-4 hover:text-[#B18A54] transition-colors"
                  >
                    Get Directions ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Calendar Grid Box */}
          <div className="lg:col-span-6">
            <div className="bg-[#F8F4ED] border border-[#DED2C2] p-6 sm:p-10 shadow-sm max-w-md mx-auto lg:max-w-none">
              
              {/* Calendar Month & Year Bar */}
              <div className="flex items-center justify-between pb-5 border-b border-[#DED2C2]">
                <div>
                  <span className="font-editorial-serif text-3xl sm:text-4xl text-[#422B20]">
                    {monthName}
                  </span>
                  <span className="block text-xs uppercase tracking-[0.25em] text-[#857365] mt-0.5">
                    {year}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#B18A54]/40 flex items-center justify-center text-[#B18A54] text-xs font-editorial-serif italic">
                  {wedding.couple.monogram}
                </div>
              </div>

              {/* Weekday Labels (S M T W T F S) */}
              <div className="grid grid-cols-7 gap-1 mt-6 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <span
                    key={day}
                    className="text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[#857365] py-2"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 mt-2 text-center text-xs sm:text-sm">
                {/* Empty offset days for start of month */}
                {Array.from({ length: startDayOffset }).map((_, i) => (
                  <span key={`blank-${i}`} className="py-2.5 opacity-0 select-none">
                    0
                  </span>
                ))}

                {/* Day numbers */}
                {days.map((d) => {
                  const isWeddingDay = hasDate && d === dayNumber;
                  return (
                    <div
                      key={d}
                      className="py-1 flex items-center justify-center"
                    >
                      <span
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all ${
                          isWeddingDay
                            ? "bg-[#B18A54] text-[#F8F4ED] font-bold shadow-md ring-2 ring-[#B18A54]/30 scale-110"
                            : "text-[#422B20] hover:bg-[#EEE5D9]/70"
                        }`}
                        title={isWeddingDay ? `${coupleName}'s Wedding Day!` : undefined}
                      >
                        {d}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend note below calendar */}
              <div className="mt-6 pt-4 border-t border-[#DED2C2] flex items-center justify-between text-[11px] text-[#857365]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#B18A54] inline-block" />
                  <span>
                    {hasDate ? "Wedding Day Celebration" : "Provisional Calendar View"}
                  </span>
                </div>
                <span className="font-editorial-serif italic text-sm text-[#422B20]">
                  {wedding.city}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
