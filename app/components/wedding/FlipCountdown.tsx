"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { wedding } from "@/config/wedding";

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function FlipUnitCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState(value);
  const [flipKey, setFlipKey] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setIsFlipping(true);
      setFlipKey((k) => k + 1);

      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 580);

      return () => clearTimeout(timer);
    }
  }, [value, currentVal]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Authentic Fliqlo Split-Flap Clock Card in Textured Brown Beige */}
      <div className="fliqlo-card-container relative w-full aspect-[1/1.12] sm:aspect-[1/1.16] rounded-xl sm:rounded-2xl bg-[#3A281E] shadow-[0_22px_45px_-8px_rgba(43,24,16,0.38),0_8px_18px_rgba(43,24,16,0.22),inset_0_1px_1px_rgba(254,232,133,0.18)] border border-[#5A4032] select-none">
        
        {/* 1. TOP STATIC HALF (Shows new incoming value in butter yellow, upper half) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#422F24] to-[#36251C] rounded-t-xl sm:rounded-t-2xl z-10">
          {/* Tactile Embossed Paper Grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-overlay select-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoiseTop'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 -0.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoiseTop)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
          {/* Artisanal Fiber Dots */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply select-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='16' r='1.2' fill='%231B1008'/%3E%3Ccircle cx='56' cy='28' r='0.8' fill='%2325170C'/%3E%3Ccircle cx='82' cy='14' r='1.1' fill='%231F130A'/%3E%3Ccircle cx='28' cy='64' r='1.3' fill='%23190E07'/%3E%3Ccircle cx='72' cy='78' r='0.9' fill='%2322150B'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
          <div className="absolute top-0 left-0 right-0 h-[200%] flex items-center justify-center">
            <span className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FFF8D6] drop-shadow-[0_2px_8px_rgba(254,232,133,0.22)] tabular-nums select-none leading-none">
              {currentVal}
            </span>
          </div>
        </div>

        {/* 2. BOTTOM STATIC HALF (Shows old value until the flap slaps down, lower half) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#36251C] to-[#2B1B13] rounded-b-xl sm:rounded-b-2xl z-10">
          {/* Tactile Embossed Paper Grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-overlay select-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoiseBot'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 -0.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoiseBot)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
          {/* Artisanal Fiber Dots */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply select-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='16' r='1.2' fill='%231B1008'/%3E%3Ccircle cx='56' cy='28' r='0.8' fill='%2325170C'/%3E%3Ccircle cx='82' cy='14' r='1.1' fill='%231F130A'/%3E%3Ccircle cx='28' cy='64' r='1.3' fill='%23190E07'/%3E%3Ccircle cx='72' cy='78' r='0.9' fill='%2322150B'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
          <div className="absolute -top-[100%] left-0 right-0 h-[200%] flex items-center justify-center">
            <span className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FFF8D6] drop-shadow-[0_2px_8px_rgba(254,232,133,0.22)] tabular-nums select-none leading-none">
              {isFlipping ? prevVal : currentVal}
            </span>
          </div>
        </div>

        {/* 3. PHYSICAL 3D FLIPPING FLAP (180° rotation in textured brown beige) */}
        {isFlipping && (
          <div
            key={flipKey}
            className="fliqlo-flap absolute top-0 left-0 right-0 h-1/2 z-30"
          >
            {/* FRONT FACE (Top half of old value, folds down in 3D) */}
            <div className="fliqlo-backface-hidden absolute inset-0 overflow-hidden bg-gradient-to-b from-[#422F24] to-[#36251C] rounded-t-xl sm:rounded-t-2xl">
              {/* Flap Texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-overlay select-none z-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFlapFront'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 -0.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFlapFront)'/%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              <div className="absolute top-0 left-0 right-0 h-[200%] flex items-center justify-center">
                <span className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FFF8D6] drop-shadow-[0_2px_8px_rgba(254,232,133,0.22)] tabular-nums select-none leading-none">
                  {prevVal}
                </span>
              </div>
              {/* Dynamic 3D shadow as it tilts down */}
              <div className="fliqlo-shadow-front-anim absolute inset-0 bg-[#160E08] pointer-events-none" />
            </div>

            {/* BACK FACE (Bottom half of new value, rotated 180°, lands flat) */}
            <div className="fliqlo-backface-hidden fliqlo-flap-back absolute inset-0 overflow-hidden bg-gradient-to-b from-[#36251C] to-[#2B1B13] rounded-b-xl sm:rounded-b-2xl">
              {/* Flap Texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-overlay select-none z-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFlapBack'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 -0.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFlapBack)'/%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              <div className="absolute -top-[100%] left-0 right-0 h-[200%] flex items-center justify-center">
                <span className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FFF8D6] drop-shadow-[0_2px_8px_rgba(254,232,133,0.22)] tabular-nums select-none leading-none">
                  {currentVal}
                </span>
              </div>
              {/* Dynamic 3D shadow as it lands flat */}
              <div className="fliqlo-shadow-back-anim absolute inset-0 bg-[#160E08] pointer-events-none" />
            </div>
          </div>
        )}

        {/* Delicate 1px Center Split Hairline (Clean split across the board) */}
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px bg-[#180E07]/90 z-40 pointer-events-none"
          aria-hidden
        />
      </div>

      {/* Elegant Brown Beige Unit Label Underneath */}
      <span className="mt-3.5 sm:mt-4 text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#4A3528]">
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
      data-reveal
      className="reveal-section scroll-mt-24 py-20 sm:py-28 lg:py-32 relative overflow-hidden border-y border-[#EAE3D9] bg-[#FAF8F5]"
    >
      {/* Background Image: countdown bg.png */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/countdown bg.png"
          alt="Countdown background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Decorative Warm Brown Beige Watermark */}
      <div
        className="pointer-events-none absolute -right-10 -bottom-14 font-editorial-serif text-[18rem] md:text-[24rem] text-[#3D2C22]/[0.035] select-none leading-none z-0"
        aria-hidden
      >
        &amp;
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center">
        
        {/* Eyebrow and Heading in Brown Beige */}
        <p className="eyebrow text-[#8C6A3B] mb-2.5 tracking-[0.28em] font-semibold">
          Until We Say &ldquo;I Do&rdquo;
        </p>

        <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl text-[#2B1810] max-w-2xl mx-auto leading-tight">
          {isCelebrationDay
            ? "Today, With Joyous Hearts, We Celebrate!"
            : "The Journey to Our Wedding Day"}
        </h2>

        <div className="h-px w-16 bg-[#8C6A3B]/40 mx-auto mt-5 mb-10 sm:mb-14" />

        {/* Screen Reader Accessible Announcement */}
        <div className="sr-only" aria-live="polite">
          {timeLeft
            ? `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until January 3, 2027`
            : "Wedding countdown ticking"}
        </div>

        {/* Textured Brown Beige Cards Flip Countdown Display with Butter Yellow Digits */}
        {timeLeft && !isCelebrationDay && (
          <div className="grid grid-cols-4 gap-3 sm:gap-5 md:gap-7 max-w-3xl mx-auto">
            {units.map((unit) => {
              const val = String(timeLeft[unit.key]).padStart(2, "0");
              return (
                <FlipUnitCard
                  key={unit.key}
                  value={val}
                  label={unit.label}
                />
              );
            })}
          </div>
        )}

        {isCelebrationDay && (
          /* Celebration Day Banner */
          <div className="bg-[#FAF6EE] border border-[#8C6A3B]/40 p-8 sm:p-12 max-w-xl mx-auto rounded-sm shadow-sm">
            <p className="font-editorial-serif text-3xl sm:text-4xl text-[#8C6A3B] italic mb-3">
              The day has arrived!
            </p>
            <p className="text-sm text-[#4A3B32] leading-relaxed font-light">
              We are so grateful for your presence, prayers, and love as we begin this new covenant chapter as husband and wife.
            </p>
          </div>
        )}

        {/* Editorial Scripture Blessing in Warm Brown Beige */}
        <p className="mt-12 text-xs sm:text-sm font-editorial-serif italic text-[#7A5A35] max-w-lg mx-auto">
          “Therefore what God has joined together, let no one separate.”
        </p>
      </div>
    </section>
  );
}
