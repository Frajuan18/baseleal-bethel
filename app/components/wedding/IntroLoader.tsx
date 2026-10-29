"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

type Phase = "idle" | "playing" | "card-amharic" | "card-english" | "revealing" | "done";

/**
 * Full-screen cinematic intro:
 * 1. The video is the first thing seen when the page loads on all screen sizes, paused at frame 0.
 * 2. Pressing anywhere starts playback with unmuted audio.
 * 3. When the video ends, a #765038 invitation card emerges with a smooth dissolve.
 * 4. Displays "ተጋብዘዋል" + Amharic invitation for 3 seconds.
 * 5. Smoothly cross-fades to "YOU ARE INVITED" + English invitation for 3 seconds.
 * 6. Smoothly dissolves into the hero section.
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
    window.setTimeout(() => setPhase("done"), 700);
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
  }, []);

  // Timed progression: 3s Amharic -> 3s English -> reveal hero
  useEffect(() => {
    if (phase === "card-amharic") {
      const timer = window.setTimeout(() => {
        setPhase("card-english");
      }, 3000);
      return () => window.clearTimeout(timer);
    }
    if (phase === "card-english") {
      const timer = window.setTimeout(() => {
        reveal();
      }, 3000);
      return () => window.clearTimeout(timer);
    }
  }, [phase, reveal]);

  function handlePress() {
    if (phase === "idle") {
      void start();
    } else if (phase === "card-amharic") {
      setPhase("card-english");
    } else if (phase === "card-english") {
      reveal();
    }
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
          ? "Wedding invitation card. Press to continue."
          : "Wedding intro video"
      }
      onPointerDown={handlePress}
      onKeyDown={handleKey}
      className={`fixed inset-0 z-[200] cursor-pointer select-none bg-black outline-none transition-opacity duration-700 ease-out ${
        phase === "revealing" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Video layer - loads frame 0 immediately on mobile and desktop */}
      <video
        ref={videoRef}
        src="/loader.mp4#t=0.001"
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        preload="auto"
        onEnded={handleVideoEnded}
      />

      {/* #765038 Invitation Card Overlay — smoothly dissolves in when video finishes */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-[#765038] p-4 sm:p-6 transition-opacity duration-1000 ease-in-out ${
          isCardVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Subtle cotton stationery texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay select-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        {/* Vertically and horizontally centered stationery card with harmonious, tight level spacing */}
        <div
          className={`relative flex flex-col items-center justify-center w-full max-w-[540px] px-6 py-7 sm:px-10 sm:py-9 rounded-2xl border border-[#F3D77A]/35 bg-[#765038] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),0_0_30px_rgba(243,215,122,0.06)] text-center overflow-hidden transition-all duration-1000 ease-out transform ${
            isCardVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.96] translate-y-2"
          }`}
        >
          {/* Inner hairline border */}
          <div className="pointer-events-none absolute inset-2.5 sm:inset-3 rounded-xl border border-[#F3D77A]/20" aria-hidden />

          {/* Corner gold ornaments */}
          <div className="pointer-events-none absolute top-3.5 left-3.5 text-[#F3D77A]/45 text-[10px]" aria-hidden>✦</div>
          <div className="pointer-events-none absolute top-3.5 right-3.5 text-[#F3D77A]/45 text-[10px]" aria-hidden>✦</div>
          <div className="pointer-events-none absolute bottom-3.5 left-3.5 text-[#F3D77A]/45 text-[10px]" aria-hidden>✦</div>
          <div className="pointer-events-none absolute bottom-3.5 right-3.5 text-[#F3D77A]/45 text-[10px]" aria-hidden>✦</div>

          {/* Unified Grid Container: Guarantees zero layout shift / jumping during language crossfade */}
          <div className="relative z-10 grid grid-cols-1 grid-rows-1 w-full items-center justify-center">
            
            {/* Amharic Slide */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center text-center transition-opacity duration-700 ease-in-out ${
                phase === "card-amharic" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top: "You Are Invited" + Wedding Date */}
              <div className="space-y-1">
                <p className="font-balderasu text-xs sm:text-sm font-semibold tracking-[0.24em] text-[#F3D77A] uppercase">
                  ተጋብዘዋል
                </p>
                <p className="font-balderasu text-xs sm:text-sm text-[#FFFDF5]/90 tracking-wider">
                  ቅዳሜ፣ ታህሳስ 17 ቀን 2019 ዓ.ም
                </p>
              </div>

              {/* Middle: Couple Names + Floral Divider */}
              <div className="mt-5 sm:mt-6 flex flex-col items-center">
                <h2 className="font-jegna-title text-4xl sm:text-5xl text-[#FFFDF5] leading-[1.2] tracking-wide text-center">
                  ባስልኤል እና ቤተል
                </h2>
                <div className="relative mt-2 h-4 sm:h-4.5 w-40 sm:w-48 opacity-85">
                  <Image
                    src="/flower underline light.png"
                    alt=""
                    fill
                    className="object-contain"
                    aria-hidden
                  />
                </div>
              </div>

              {/* Bottom: Bible Verse */}
              <div className="mt-5 sm:mt-6 max-w-[420px] space-y-1 text-center">
                <p className="font-balderasu text-[11px] sm:text-xs text-[#F3D77A] font-semibold tracking-wide">
                  ኦሪት ዘፍጥረት 35:3
                </p>
                <p className="font-balderasu text-xs sm:text-sm leading-relaxed text-[#FAF4ED]/90">
                  “ተነሥተን ወደ ቤቴል እንውጣ፤ እዚያም በመከራዬ ጊዜ ለሰማኝ፣ በሄድሁበትም ስፍራ ሁሉ ላልተለየኝ አምላክ መሠዊያ እሠራለሁ።”
                </p>
              </div>
            </div>

            {/* English Slide */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center text-center transition-opacity duration-700 ease-in-out ${
                phase === "card-english" || phase === "revealing"
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top: "You Are Invited" + Wedding Date */}
              <div className="space-y-1">
                <p className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-[#F3D77A] uppercase">
                  YOU ARE INVITED
                </p>
                <p className="font-sans text-[11px] sm:text-xs tracking-[0.22em] text-[#FFFDF5]/90 uppercase font-light">
                  Saturday, December 26, 2026
                </p>
              </div>

              {/* Middle: Couple Names + Floral Divider */}
              <div className="mt-5 sm:mt-6 flex flex-col items-center">
                <h2 className="font-brittany-signature text-5xl sm:text-6xl text-[#FFFDF5] leading-[1.1] text-center">
                  Basseleal & Bethel
                </h2>
                <div className="relative mt-2 h-4 sm:h-4.5 w-40 sm:w-48 opacity-85">
                  <Image
                    src="/flower underline light.png"
                    alt=""
                    fill
                    className="object-contain"
                    aria-hidden
                  />
                </div>
              </div>

              {/* Bottom: Bible Verse */}
              <div className="mt-5 sm:mt-6 max-w-[440px] space-y-1 text-center">
                <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#F3D77A] font-semibold">
                  GENESIS 35:3
                </p>
                <p className="font-editorial-serif italic text-sm sm:text-base leading-relaxed text-[#FAF4ED]/90">
                  “Then come, let us go up to Bethel, where I will build an altar to God, who answered me in the day of my distress and who has been with me wherever I have gone.”
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
