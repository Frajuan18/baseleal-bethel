"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";

type Phase = "idle" | "playing" | "revealing" | "done";

/**
 * Full-screen cinematic intro. The loader video sits paused with no on-screen
 * hint; tapping the middle of the screen starts it, and when it ends the screen
 * fades out to reveal the hero.
 */
export function IntroLoader() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  // Keep the page from scrolling while the intro is on screen.
  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  

  const reveal = useCallback(() => {
    setPhase("revealing");
    window.setTimeout(() => setPhase("done"), 700);
  }, []);

  const start = useCallback(async () => {
    const video = videoRef.current;
    if (!video) {
      reveal();
      return;
    }
    setPhase("playing");
    try {
      video.currentTime = 0;
      await video.play();
    } catch {
      // Some mobile/in-app browsers only allow muted programmatic playback.
      try {
        video.muted = true;
        await video.play();
      } catch {
        reveal();
      }
    }
  }, [reveal]);

  function handlePointer(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) {
    if (phase !== "idle") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clientY = "touches" in event ? event.changedTouches[0]?.clientY : event.clientY;
    if (clientY == null) return;
    const ratio = (clientY - rect.top) / rect.height;
    if (ratio < 0.25 || ratio > 0.75) return;
    void start();
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (phase !== "idle") return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void start();
    }
  }

  if (phase === "done") return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Start the wedding introduction"
      onClick={handlePointer}
      onTouchStart={handlePointer}
      onKeyDown={handleKey}
      className={`fixed inset-0 z-[200] cursor-pointer select-none bg-[#140b06] outline-none transition-opacity duration-700 ease-out ${
        phase === "revealing" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/loader.mp4"
        className="h-full w-full object-cover"
        playsInline
        preload="auto"
        onEnded={reveal}
        onError={reveal}
      />
    </div>
  );
}