"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

type Phase = "idle" | "playing" | "card-amharic" | "card-english" | "revealing" | "done";

/**
 * Full-screen cinematic intro:
 * 1. The envelope video is the first thing seen when the page loads, paused at frame 0.
 * 2. Pressing starts playback.
 * 3. When the envelope opens and finishes, the blurred couple photo background with a white card emerges.
 * 4. Displays prominent "ተጋብዘዋል" + Amharic invitation with large bottom date for 7 seconds.
 * 5. Smoothly cross-fades to prominent "YOU ARE INVITED" + English invitation with large bottom date for 7 seconds.
 * 6. After the full 14-second sequence ends, an elegant clearing animation reveals the hero section.
 */
export function IntroLoader() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  // Keep the page from scrolling while the intro or card is on screen.
  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  // Set the appropriate video source on the DOM video element based on viewport width.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isLarge = window.innerWidth >= 768;
    const target = isLarge ? "/loader large screen.mp4#t=0.001" : "/loader.mp4#t=0.001";
    const filename = isLarge ? "loader%20large%20screen.mp4" : "loader.mp4";
    if (!video.src.includes(filename)) {
      video.src = target;
      video.load();
    }

    const mq = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      if (phase === "idle" && videoRef.current) {
        const desktop = window.innerWidth >= 768;
        const next = desktop ? "/loader large screen.mp4#t=0.001" : "/loader.mp4#t=0.001";
        const nextFile = desktop ? "loader%20large%20screen.mp4" : "loader.mp4";
        if (!videoRef.current.src.includes(nextFile)) {
          videoRef.current.src = next;
          videoRef.current.load();
        }
      }
    };

    mq.addEventListener?.("change", handleResize);
    return () => mq.removeEventListener?.("change", handleResize);
  }, [phase]);

  const reveal = useCallback(() => {
    setPhase("revealing");
    window.setTimeout(() => setPhase("done"), 1100);
  }, []);

  const start = useCallback(async () => {
    const video = videoRef.current;
    if (!video) {
      setPhase("card-amharic");
      return;
    }
    setPhase("playing");
    try {
      video.currentTime = 0;
      video.muted = false;
      await video.play();
    } catch {
      try {
        video.muted = true;
        await video.play();
      } catch {
        setPhase("card-amharic");
      }
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    setPhase("card-amharic");
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("play-wedding-song"));
    }
  }, []);

  // Timed progression: EXACTLY 7s Amharic + 7s English = 14s total -> clearing animation to reveal hero
  useEffect(() => {
    if (phase === "card-amharic") {
      const timer = window.setTimeout(() => {
        setPhase("card-english");
      }, 7000);
      return () => window.clearTimeout(timer);
    }
    if (phase === "card-english") {
      const timer = window.setTimeout(() => {
        reveal();
      }, 7000);
      return () => window.clearTimeout(timer);
    }
  }, [phase, reveal]);

  function handlePress() {
    if (phase === "idle") {
      void start();
    }
    // Do NOT skip or cut short the 14 seconds when clicking on the card
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePress();
    }
  }

  if (phase === "done") return null;

  const isCardVisible =
    phase === "card-amharic" || phase === "card-english" || phase === "revealing";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={
        phase === "idle"
          ? "Start the wedding introduction"
          : isCardVisible
          ? "Wedding invitation card"
          : "Wedding intro video"
      }
      onPointerDown={handlePress}
      onKeyDown={handleKey}
      className={`fixed inset-0 z-[200] select-none bg-black outline-none transition-all duration-1000 ease-in-out ${
        phase === "revealing"
          ? "pointer-events-none opacity-0 scale-105 filter blur-sm"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Video layer: Envelope opening */}
      <video
        ref={videoRef}
        src="/loader.mp4#t=0.001"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isCardVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        playsInline
        muted
        preload="auto"
        onEnded={handleVideoEnded}
      />

      {/* Invitation Card Overlay with Blurred Couple Image Background */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-1000 ease-in-out ${
          isCardVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background: Blurred couple photo fitted matching the hero section */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          <Image
            src="/couple main.JPG"
            alt="Basseleal and Bethel wedding portrait"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="h-full w-full object-cover object-[center_15%] sm:object-[center_14%] md:object-[center_12%] lg:object-[center_10%] xl:object-[center_8%] scale-110 blur-xl filter brightness-[0.82] contrast-[1.05]"
          />
          {/* Subtle warm vignette overlay for depth & readability */}
          <div className="absolute inset-0 bg-[#26150e]/50 backdrop-blur-xs" />
        </div>

        {/* White stationery card with no outside border, deep box shadow, and no corner stars */}
        <div
          className={`relative z-10 flex flex-col items-center justify-center w-full max-w-[560px] px-6 py-8 sm:px-10 sm:py-10 rounded-2xl border-0 bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.55),0_15px_30px_-10px_rgba(0,0,0,0.3)] text-center overflow-hidden transition-all duration-1000 ease-out transform ${
            phase === "revealing"
              ? "opacity-0 scale-[0.96] blur-xs"
              : isCardVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-[0.96] translate-y-2"
          }`}
        >
          {/* Subtle paper noise texture on the card surface */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply select-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardPaperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardPaperNoise)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />

          {/* Unified Grid Container: Guarantees zero layout shift / jumping during language crossfade */}
          <div className="relative z-10 grid grid-cols-1 grid-rows-1 w-full items-center justify-center">
            
            {/* Amharic Slide (7 seconds) */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center text-center transition-opacity duration-700 ease-in-out ${
                phase === "card-amharic" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top: Large prominent "ተጋብዘዋል" */}
              <div className="w-full">
                <p className="font-balderasu text-lg sm:text-xl md:text-2xl font-bold tracking-[0.22em] text-[#8C6A3B] uppercase">
                  ተጋብዘዋል
                </p>
              </div>

              {/* Middle: Couple Names */}
              <div className="mt-4 sm:mt-5 flex flex-col items-center">
                <h2 className="font-jegna-title text-4xl sm:text-5xl md:text-6xl text-[#2B1810] leading-[1.2] tracking-wide text-center">
                  ባስልኤል እና ቤቴል
                </h2>
              </div>

              {/* Verse */}
              <div className="mt-4 sm:mt-5 max-w-[440px] space-y-1.5 text-center">
                <p className="font-balderasu text-[11px] sm:text-xs text-[#8C6A3B] font-semibold tracking-wide">
                  ኦሪት ዘፍጥረት 35:3
                </p>
                <p className="font-balderasu text-xs sm:text-sm leading-relaxed text-[#4A3527]">
                  “ተነሥተን ወደ ቤቴል እንውጣ፤ እዚያም በመከራዬ ጊዜ ለሰማኝ፣ በሄድሁበትም ስፍራ ሁሉ ላልተለየኝ አምላክ መሠዊያ እሠራለሁ።”
                </p>
              </div>

              {/* Bottom: Big, Noticeable Wedding Date */}
              <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#E5DAC8] w-full flex flex-col items-center">
                <p className="font-balderasu text-base sm:text-lg md:text-xl font-bold tracking-[0.14em] text-[#8C6A3B]">
                  ቅዳሜ፣ ታህሳስ 17 ቀን 2019 ዓ.ም
                </p>
              </div>
            </div>

            {/* English Slide (7 seconds) */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center text-center transition-opacity duration-700 ease-in-out ${
                phase === "card-english" || phase === "revealing"
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top: Large prominent "YOU ARE INVITED" */}
              <div className="w-full">
                <p className="font-sans text-base sm:text-lg md:text-xl font-bold tracking-[0.28em] text-[#8C6A3B] uppercase">
                  YOU ARE INVITED
                </p>
              </div>

              {/* Middle: Couple Names */}
              <div className="mt-4 sm:mt-5 flex flex-col items-center">
                <h2 className="font-brittany-signature text-5xl sm:text-6xl md:text-7xl text-[#2B1810] leading-[1.1] text-center">
                  Basseleal & Bethel
                </h2>
              </div>

              {/* Verse */}
              <div className="mt-4 sm:mt-5 max-w-[450px] space-y-1.5 text-center">
                <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#8C6A3B] font-semibold">
                  GENESIS 35:3
                </p>
                <p className="font-editorial-serif italic text-sm sm:text-base leading-relaxed text-[#4A3527]">
                  “Then come, let us go up to Bethel, where I will build an altar to God, who answered me in the day of my distress and who has been with me wherever I have gone.”
                </p>
              </div>

              {/* Bottom: Big, Noticeable Wedding Date */}
              <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#E5DAC8] w-full flex flex-col items-center">
                <p className="font-sans text-sm sm:text-base md:text-lg font-bold tracking-[0.22em] text-[#8C6A3B] uppercase">
                  Saturday, December 26, 2026
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
