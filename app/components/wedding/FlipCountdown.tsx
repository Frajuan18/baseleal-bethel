"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function FlipCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeUnits | null>(null);
  const [isCelebrationDay, setIsCelebrationDay] = useState(false);

  useEffect(() => {
    if (!wedding.date) {
      return;
    }

    const timeStr = wedding.time || "14:00";
    const targetTime = new Date(`${wedding.date}T${timeStr}:00`).getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsCelebrationDay(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const hasDateConfigured = Boolean(wedding.date);

  const units: { key: keyof TimeUnits; label: string }[] = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Minutes" },
    { key: "seconds", label: "Seconds" },
  ];

  return (
    <section
      id="countdown"
      className="py-20 sm:py-28 bg-[#2B1810] text-[#F8F4ED] relative overflow-hidden"
    >
      {/* Decorative background watermark */}
      <div
        className="pointer-events-none absolute -right-12 -bottom-16 font-editorial-serif text-[18rem] md:text-[24rem] text-white/[0.03] select-none leading-none z-0"
        aria-hidden
      >
        &amp;
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center">
        
        {/* Eyebrow and heading */}
        <p className="eyebrow text-[#B18A54] mb-3">
          Until We Say &ldquo;I Do&rdquo;
        </p>

        <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl text-[#F8F4ED] max-w-2xl mx-auto leading-tight">
          {!hasDateConfigured
            ? "Every Second Brings Us Closer to Forever"
            : isCelebrationDay
            ? "Today, With Joyous Hearts, We Celebrate!"
            : "The Journey to Our Wedding Day"}
        </h2>

        <div className="h-px w-16 bg-[#B18A54]/60 mx-auto mt-5 mb-8 sm:mb-12" />

        {/* Screen Reader Accessible Announcement (quiet/polite) */}
        <div className="sr-only" aria-live="polite">
          {timeLeft && hasDateConfigured
            ? `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes until the wedding`
            : "Wedding countdown pending date confirmation"}
        </div>

        {/* Flip-Board Countdown Display */}
        {hasDateConfigured && timeLeft && !isCelebrationDay ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-2xl mx-auto">
            {units.map((unit) => {
              const val = String(timeLeft[unit.key]).padStart(2, "0");
              return (
                <div key={unit.key} className="flex flex-col items-center">
                  {/* Split-flap card */}
                  <div className="split-flap-card w-full py-4 sm:py-6 md:py-8 px-1 sm:px-3 text-center">
                    <span className="split-flap-crease" aria-hidden />
                    <span className="font-editorial-serif text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#F8F4ED] tabular-nums block">
                      {val}
                    </span>
                  </div>

                  {/* Unit Label */}
                  <span className="mt-3 text-[9px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C9A46E]">
                    {unit.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : !hasDateConfigured ? (
          /* Editorial Date Placeholder (when date is null) */
          <div className="bg-[#1C0E08]/60 border border-[#B18A54]/30 p-8 sm:p-12 max-w-xl mx-auto rounded-sm backdrop-blur-sm">
            <span className="text-[#B18A54] text-lg mb-2 block">✦</span>
            <p className="font-editorial-serif text-2xl sm:text-3xl italic text-[#F8F4ED] mb-3">
              Our countdown begins soon
            </p>
            <p className="text-xs sm:text-sm text-[#F8F4ED]/75 leading-relaxed font-light font-sans max-w-md mx-auto">
              As soon as the ceremony date and time are officially confirmed, the mechanical countdown will tick down to the very second we stand at the altar.
            </p>
            <div className="mt-6">
              <a href="#rsvp" className="btn-editorial-gold text-[10px]">
                Notify Us of Your Intent to Attend
              </a>
            </div>
          </div>
        ) : (
          /* Celebration day banner */
          <div className="bg-[#B18A54]/20 border border-[#B18A54] p-8 sm:p-12 max-w-xl mx-auto rounded-sm">
            <p className="font-editorial-serif text-3xl sm:text-4xl text-[#F8F4ED] italic mb-3">
              The day has arrived!
            </p>
            <p className="text-sm text-[#F8F4ED]/85 leading-relaxed">
              We are so grateful for your presence, prayers, and love as we begin this new covenant chapter as husband and wife.
            </p>
          </div>
        )}

        {/* Editorial Quote note */}
        <p className="mt-12 text-xs sm:text-sm font-editorial-serif italic text-[#C9A46E]/90 max-w-lg mx-auto">
          “Therefore what God has joined together, let no one separate.”
        </p>
      </div>
    </section>
  );
}
