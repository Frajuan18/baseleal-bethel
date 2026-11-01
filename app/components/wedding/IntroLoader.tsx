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

    // Strictly enforce muted state so video playback never interrupts or hijacks background music
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");

    // Signal song start as soon as website loads
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("play-wedding-song"));
    }

    const isLarge = window.innerWidth >= 768;
    const target = isLarge ? "/loader large screen.mp4#t=0.001" : "/main loader animation.mp4#t=0.001";
    const filename = isLarge ? "loader%20large%20screen.mp4" : "main%20loader%20animation.mp4";
    if (!video.src.includes(filename)) {
      video.src = target;
      video.load();
    }

    const mq = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      if (phase === "idle" && videoRef.current) {
        const desktop = window.innerWidth >= 768;
        const next = desktop ? "/loader large screen.mp4#t=0.001" : "/main loader animation.mp4#t=0.001";
        const nextFile = desktop ? "loader%20large%20screen.mp4" : "main%20loader%20animation.mp4";
        if (!videoRef.current.src.includes(nextFile)) {
          videoRef.current.src = next;
          videoRef.current.load();
        }
      }
    };

    mq.addEventListener?.("change", handleResize);
    return () => mq.removeEventListener?.("change", handleResize);
  }, [phase]);

  // Keep background song running seamlessly during video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const ensureSongPlaying = () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("play-wedding-song"));
      }
    };

    video.addEventListener("play", ensureSongPlaying);
    video.addEventListener("playing", ensureSongPlaying);

    return () => {
      video.removeEventListener("play", ensureSongPlaying);
      video.removeEventListener("playing", ensureSongPlaying);
    };
  }, []);

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

    // Strictly ensure the video has 0 volume and is muted before playing
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute("muted", "");

    try {
      video.currentTime = 0;
      await video.play();
    } catch {
      setPhase("card-amharic");
    }

    // Immediately trigger background music on this user interaction so the song continues uninterrupted
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("play-wedding-song"));
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
        src="/main loader animation.mp4#t=0.001"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isCardVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        playsInline
        muted
        preload="auto"
        onPlay={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("play-wedding-song"));
          }
        }}
        onEnded={handleVideoEnded}
      />

      {/* Tap Guide Overlay on Intro Video (shown during idle phase) */}
      {phase === "idle" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-14 sm:bottom-20 z-20 flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
          <div className="relative pointer-events-auto flex items-center gap-3.5 rounded-full border border-[#E6C687]/80 bg-[#24130B]/90 px-6 py-3.5 text-[#FAF6F0] shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer">
            {/* Glowing Pulse Rings */}
            <span className="absolute -inset-1 rounded-full bg-[#E6C687]/30 animate-pulse pointer-events-none" />
            <span className="absolute -inset-2.5 rounded-full bg-[#E6C687]/15 animate-ping pointer-events-none" />

            {/* Tap Icon */}
            <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E6C687] text-[#24130B] shadow-sm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M14 11V5a2 2 0 0 0-4 0v9" />
                <path d="M10 9a2 2 0 0 0-4 0v4a7 7 0 0 0 14 0v-4a2 2 0 0 0-4 0" />
                <path d="M10 14h4" />
              </svg>
            </div>

            {/* Bilingual Guide Labels */}
            <div className="relative text-left pr-1 select-none">
              <p className="font-balderasu text-sm sm:text-base font-bold tracking-wider text-[#FAF6F0] leading-tight">
                መጋበዣውን ለመክፈት ይጫኑ
              </p>
              <p className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#E6C687] leading-tight mt-0.5">
                Tap to Open Invitation
              </p>
            </div>

            {/* Arrow */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative text-[#E6C687] transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      )}

      {/* Invitation Card Overlay with Blurred Couple Image Background */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center p-2.5 sm:p-6 transition-opacity duration-1000 ease-in-out ${
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

        {/* 3D Flipping Card Container (Flips from Amharic front to English back) */}
        <div
          className={`relative z-10 w-full max-w-[540px] sm:max-w-[620px] md:max-w-[680px] aspect-[1247/1261] max-h-[92vh] sm:max-h-[90vh] transition-all duration-1000 ease-out transform drop-shadow-[0_25px_60px_rgba(0,0,0,0.55)] ${
            phase === "revealing"
              ? "opacity-0 scale-[0.96] blur-xs"
              : isCardVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-[0.96] translate-y-2"
          }`}
          style={{
            perspective: "1600px",
            WebkitPerspective: "1600px",
          }}
        >
          {/* Card Body with 3D Flip */}
          <div
            className="relative w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transform:
                phase === "card-english" || phase === "revealing"
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
              WebkitTransform:
                phase === "card-english" || phase === "revealing"
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
            }}
          >
            {/* FRONT FACE: AMHARIC */}
            <div
              className="absolute inset-0 w-full h-full select-none"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translate3d(0, 0, 1px)",
                WebkitTransform: "translate3d(0, 0, 1px)",
              }}
            >
              {/* Ornate intro card background */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/intro card.png"
                  alt="Wedding invitation stationery card"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 98vw, 680px"
                  className="object-contain pointer-events-none select-none"
                />
              </div>

              {/* Front Content: Amharic (Centred vertically and horizontally clear of floral corner borders) */}
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-4 xs:p-5 sm:p-8 md:p-10 text-center select-none">
                <div className="flex flex-col items-center justify-center w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] md:max-w-[480px] mx-auto">
                  {/* Top: Header */}
                  <p className="font-balderasu text-xs xs:text-[13px] sm:text-base md:text-lg font-bold tracking-[0.22em] text-[#8C6A3B] uppercase">
                    ተጋብዘዋል
                  </p>

                  {/* Middle: Names */}
                  <h2 className="font-jegna-title text-2xl xs:text-[1.7rem] sm:text-4xl md:text-5xl text-[#2B1810] leading-[1.2] tracking-wide text-center mt-2 xs:mt-2.5 sm:mt-4">
                    ባስልኤል እና ዶ/ር ቤቴል
                  </h2>

                  {/* Scripture */}
                  <div className="mt-2 xs:mt-2.5 sm:mt-4 space-y-0.5 sm:space-y-1 text-center">
                    <p className="font-balderasu text-[11px] sm:text-sm text-[#8C6A3B] font-semibold tracking-wider">
                      ኦሪት ዘፍጥረት 35:3
                    </p>
                    <p className="font-balderasu text-[11px] xs:text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#4A3527]">
                      “ተነሥተን ወደ ቤቴል እንውጣ፤ እዚያም በመከራዬ ጊዜ ለሰማኝ፣ በሄድሁበትም ስፍራ ሁሉ ላልተለየኝ አምላክ መሠዊያ እሠራለሁ።”
                    </p>
                  </div>

                  {/* Bottom: Date */}
                  <div className="w-full mt-2.5 xs:mt-3 sm:mt-5 pt-2 xs:pt-2.5 sm:pt-4 border-t border-[#8C6A3B]/25">
                    <p className="font-balderasu text-xs xs:text-[13px] sm:text-base md:text-lg font-bold tracking-[0.14em] sm:tracking-[0.16em] text-[#8C6A3B]">
                      ቅዳሜ፣ ታህሳስ 17 ቀን 2019 ዓ.ም
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK FACE: ENGLISH */}
            <div
              className="absolute inset-0 w-full h-full select-none"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg) translate3d(0, 0, 1px)",
                WebkitTransform: "rotateY(180deg) translate3d(0, 0, 1px)",
              }}
            >
              {/* Ornate intro card background */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/intro card.png"
                  alt="Wedding invitation stationery card back"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 98vw, 680px"
                  className="object-contain pointer-events-none select-none"
                />
              </div>

              {/* Back Content: English (Centred vertically and horizontally clear of floral corner borders) */}
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-4 xs:p-5 sm:p-8 md:p-10 text-center select-none">
                <div className="flex flex-col items-center justify-center w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] md:max-w-[480px] mx-auto">
                  {/* Top: Header */}
                  <p className="font-sans text-[11px] xs:text-xs sm:text-sm md:text-base font-bold tracking-[0.26em] text-[#8C6A3B] uppercase">
                    YOU ARE INVITED
                  </p>

                  {/* Middle: Names */}
                  <h2 className="font-brittany-signature text-[1.75rem] xs:text-3xl sm:text-5xl md:text-6xl text-[#2B1810] leading-[1.15] text-center mt-2 xs:mt-2.5 sm:mt-4">
                    Basseleal &amp; Dr. Bethel
                  </h2>

                  {/* Scripture */}
                  <div className="mt-2 xs:mt-2.5 sm:mt-4 space-y-0.5 sm:space-y-1 text-center">
                    <p className="font-sans text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.22em] text-[#8C6A3B] font-semibold">
                      GENESIS 35:3
                    </p>
                    <p className="font-editorial-serif italic text-[11px] xs:text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#4A3527]">
                      “Then come, let us go up to Bethel, where I will build an altar to God, who answered me in the day of my distress and who has been with me wherever I have gone.”
                    </p>
                  </div>

                  {/* Bottom: Date */}
                  <div className="w-full mt-2.5 xs:mt-3 sm:mt-5 pt-2 xs:pt-2.5 sm:pt-4 border-t border-[#8C6A3B]/25">
                    <p className="font-sans text-[10px] xs:text-[11px] sm:text-sm md:text-base font-bold tracking-[0.18em] sm:tracking-[0.24em] text-[#8C6A3B] uppercase">
                      Saturday, December 26, 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
