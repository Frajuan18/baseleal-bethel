"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { coupleName, wedding } from "@/config/wedding";
import { FlipCountdownDisplay } from "./FlipCountdown";
import { useWeddingLanguage } from "./LanguageContext";

const seq = (delay: string): CSSProperties => ({ "--seq-delay": delay, "--seq-duration": "900ms", "--hero-rise": "10px" }) as CSSProperties;

function downloadICS(year: number, monthIndex: number, dayNumber: number) {
  const [hours, minutes] = (wedding.time || "10:00").split(":").map(Number);
  const startDate = new Date(year, monthIndex, dayNumber, hours || 10, minutes || 0);
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const format = (date: Date) => `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  const content = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Baseleal & Bethel//Wedding Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:wedding-${year}-${monthIndex + 1}-${dayNumber}@baseleal-bethel.wedding`, `DTSTAMP:${format(new Date())}`, `DTSTART:${format(startDate)}`, `DTEND:${format(endDate)}`,
    `SUMMARY:${coupleName}'s Wedding Celebration`, `LOCATION:${wedding.venue}, ${wedding.city}`, "STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = window.URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${wedding.couple.first}-${wedding.couple.second}-wedding.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function WeddingCalendar() {
  const { isAmharic } = useWeddingLanguage();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  let year = 2027;
  let monthIndex = 0;
  let dayNumber = 3;
  if (wedding.date) {
    const parts = wedding.date.split("-").map(Number);
    if (parts.length === 3) [year, monthIndex, dayNumber] = [parts[0], parts[1] - 1, parts[2]];
  }
  const monthName = new Date(year, monthIndex, 1).toLocaleDateString(isAmharic ? "am-ET" : "en-US", { month: "long" });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDayOffset = new Date(year, monthIndex, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${coupleName}'s Wedding Celebration`)}&dates=${year}${String(monthIndex + 1).padStart(2, "0")}${String(dayNumber).padStart(2, "0")}T100000/${year}${String(monthIndex + 1).padStart(2, "0")}${String(dayNumber).padStart(2, "0")}T150000`;

  const handleDownload = () => {
    downloadICS(year, monthIndex, dayNumber);
    setDownloadSuccess(true);
    window.setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <section id="date" data-reveal className={`reveal-seq ${isAmharic ? "amharic-section" : ""} relative overflow-hidden bg-[#FFF8D6] py-16 sm:py-20 lg:py-24`}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='18' cy='24' r='1.3' fill='%234A350E'/%3E%3Ccircle cx='76' cy='42' r='.9' fill='%235A4215'/%3E%3Ccircle cx='124' cy='18' r='1.2' fill='%233D2B09'/%3E%3Ccircle cx='36' cy='92' r='1.4' fill='%234C3710'/%3E%3Ccircle cx='104' cy='82' r='.8' fill='%23563F14'/%3E%3C/svg%3E")` }} aria-hidden />
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-40 w-40 opacity-65 sm:h-56 sm:w-56 lg:h-72 lg:w-72" aria-hidden>
        <Image src="/top left dark.png" alt="" fill sizes="(max-width: 640px) 160px, (max-width: 1024px) 224px, 288px" className="object-contain object-left-top" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[38%] w-[38%] opacity-60 sm:block lg:h-[48%] lg:w-[34%]" aria-hidden>
        <Image src="/brown flower hero.png" alt="" fill sizes="(max-width: 1024px) 38vw, 34vw" className="object-contain object-right-bottom" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1120px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(280px,390px)_minmax(0,1fr)] lg:gap-20 lg:px-12">
        <div data-seq="card" style={seq("0.2s")} className="mx-auto w-full max-w-[390px]">
          <p data-seq="fade" style={seq("0.3s")} className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8C6A3B]">{isAmharic ? "ቀኑን ያስታውሱ" : "Save the date"}</p>
          <h2 data-seq="rise" style={seq("0.4s")} className="font-editorial-serif text-4xl leading-none text-[#1E140E] sm:text-5xl">{monthName} <em className="text-2xl font-normal text-[#8C6A3B] sm:text-3xl">{year}</em></h2>

          <div className="relative mt-6 overflow-hidden rounded-sm border border-[#DED2C2] bg-[#FAF5EE] p-5 shadow-[0_18px_42px_-18px_rgba(43,24,16,.25)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[#E5DDD2] pb-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#857365]">{isAmharic ? "የሰርግ ወር" : "Wedding celebration month"}</span>
              <div className="relative h-12 w-12 shrink-0"><Image src="/b and b.png" alt={`${wedding.couple.monogram} monogram seal`} fill sizes="48px" className="object-contain" /></div>
            </div>
            <div className="mt-4 grid grid-cols-7 text-center font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-[#857365] sm:text-[10px]">
              {(isAmharic ? ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]).map((label) => <span key={label} className="py-2">{label}</span>)}
            </div>
            <div className="relative z-10 mt-2 grid grid-cols-7 gap-y-1 text-center font-sans text-xs text-[#422B20] sm:gap-y-2 sm:text-sm">
              {Array.from({ length: startDayOffset }).map((_, index) => <span key={`blank-${index}`} className="py-2 opacity-0">0</span>)}
              {days.map((day) => <span key={day} className={`mx-auto grid h-7 w-7 place-items-center rounded-full sm:h-8 sm:w-8 ${day === dayNumber ? "border-2 border-[#D4AF37] bg-[#F3ECE1] font-bold shadow-[0_3px_12px_rgba(180,140,20,.22)]" : ""}`}>{day}</span>)}
            </div>
            <Image src="/calendar flower.png" alt="" width={400} height={600} className="pointer-events-none absolute -bottom-14 -right-14 z-0 w-44 opacity-50" aria-hidden />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={handleDownload} className="min-h-10 rounded-full bg-[#1E140E] px-4 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FAF6F0] transition hover:bg-[#8C6A3B] focus:outline-none focus:ring-2 focus:ring-[#8C6A3B]">{downloadSuccess ? (isAmharic ? "ተቀምጧል ✓" : "Downloaded ✓") : (isAmharic ? "ወደ ካሌንደር ጨምር ↓" : "Add to calendar ↓")}</button>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-full border border-[#DED2C2] bg-[#FAF5EE] px-4 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-[#1E140E] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#8C6A3B]">{isAmharic ? "Google ካሌንደር ↗" : "Google Calendar ↗"}</a>
          </div>
        </div>

        <div data-seq="rise" style={seq("0.5s")} className="min-w-0 pt-4 sm:pt-6 lg:pt-0">
          <p className={`${isAmharic ? "font-balderasu" : "font-brittany-signature"} text-[1.75rem] leading-none text-[#8C6A3B] sm:text-3xl`}>{isAmharic ? "እስከ ‘አዎ’ የምንልበት ቀን ቆጠራ" : "Counting down to the moment we say “I do”"}</p>
          <div className="mx-auto mt-8 w-full max-w-none lg:mx-0 lg:max-w-[820px]"><FlipCountdownDisplay /></div>
        </div>
      </div>
    </section>
  );
}
