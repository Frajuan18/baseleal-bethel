"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function FlipUnitCard({ value, label }: { value: string; label: string }) {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setIsFlipping(true);

      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [value, currentVal]);

  return (
    <div className="flex flex-col items-center">
      {/* White Mechanical Split-Flap Card with 3D Flip Animation */}
      <div className={`split-flap-white-card w-full aspect-[1/1.12] sm:aspect-[1/1.18] flex items-center justify-center p-2 sm:p-4 ${isFlipping ? "animate-card-flip" : ""}`}>
        
        {/* Metal Crease Hinge */}
        <span className="split-flap-white-crease" aria-hidden />

        {/* Small Side Rivet Details */}
        <div className="absolute top-1/2 left-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#94A3B8]/60 z-30 shadow-xs" />
        <div className="absolute top-1/2 right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#94A3B8]/60 z-30 shadow-xs" />

        {/* Large Digits Display */}
        <span className="font-editorial-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1E140E] tabular-nums block select-none">
          {currentVal}
        </span>
      </div>

      {/* Butter Yellow Unit Label */}
      <span className="mt-3.5 text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.24em] text-[#FEE885]">
        {label}
      </span>
    </div>
  );
}

export function FlipCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeUnits | null>(null);
  const [isCelebrationDay, setIsCelebrationDay] = useState(false);

  useEffect(() => {
    // January 3, 2027 Celebration Target
    const targetDateStr = wedding.date || "2027-01-03";
    const timeStr = wedding.time || "10:00";
    const targetTime = new Date(`${targetDateStr}T${timeStr}:00`).getTime();

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

  const units: { key: keyof TimeUnits; label: string }[] = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Minutes" },
    { key: "seconds", label: "Seconds" },
  ];

  return (
    <section
      id="countdown"
      className="py-20 sm:py-28 lg:py-32 bg-[#3D2C22] bg-[radial-gradient(ellipse_at_top,_#4D372B_0%,#39281F_55%,#2A1D16_100%)] text-[#F8F4ED] relative overflow-hidden border-y border-[#5A4032]"
    >
      {/* Decorative Warm Butter Yellow Watermark */}
      <div
        className="pointer-events-none absolute -right-10 -bottom-14 font-editorial-serif text-[18rem] md:text-[24rem] text-[#FEE885]/[0.04] select-none leading-none z-0"
        aria-hidden
      >
        &amp;
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center">
        
        {/* Eyebrow and Heading */}
        <p className="eyebrow text-[#FEE885] mb-2.5 tracking-[0.28em] font-medium">
          Until We Say &ldquo;I Do&rdquo;
        </p>

        <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl text-[#FFFDF7] max-w-2xl mx-auto leading-tight">
          {isCelebrationDay
            ? "Today, With Joyous Hearts, We Celebrate!"
            : "The Journey to Our Wedding Day"}
        </h2>

        <div className="h-px w-16 bg-[#FEE885]/60 mx-auto mt-5 mb-10 sm:mb-14" />

        {/* Screen Reader Accessible Announcement */}
        <div className="sr-only" aria-live="polite">
          {timeLeft
            ? `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until January 3, 2027`
            : "Wedding countdown ticking"}
        </div>

        {/* White Cards Flip Countdown Display */}
        {timeLeft && !isCelebrationDay && (
          <div className="grid grid-cols-4 gap-3 sm:gap-5 md:gap-7 max-w-2xl mx-auto">
            {units.map((unit) => {
              const val = String(timeLeft[unit.key]).padStart(2, "0");
              return <FlipUnitCard key={unit.key} value={val} label={unit.label} />;
            })}
          </div>
        )}

        {isCelebrationDay && (
          /* Celebration Day Banner */
          <div className="bg-[#FEE885]/15 border border-[#FEE885]/40 p-8 sm:p-12 max-w-xl mx-auto rounded-sm backdrop-blur-sm">
            <p className="font-editorial-serif text-3xl sm:text-4xl text-[#FEE885] italic mb-3">
              The day has arrived!
            </p>
            <p className="text-sm text-white/90 leading-relaxed font-light">
              We are so grateful for your presence, prayers, and love as we begin this new covenant chapter as husband and wife.
            </p>
          </div>
        )}

        {/* Editorial Scripture Blessing */}
        <p className="mt-12 text-xs sm:text-sm font-editorial-serif italic text-[#FEE885]/90 max-w-lg mx-auto">
          “Therefore what God has joined together, let no one separate.”
        </p>
      </div>
    </section>
  );
}
