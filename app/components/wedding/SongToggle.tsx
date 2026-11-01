"use client";

import { useEffect, useRef, useState } from "react";

const SONG_SRC = "/song/Samuel-Zergaw-Kingdom-Sound-Worship-Night-2025-Yastawekebegn.m4a";

export function SongToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const userPausedRef = useRef(false);

  // Attempt to play music automatically the moment the website loads
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    const playSong = async () => {
      if (userPausedRef.current) return;
      try {
        audio.volume = 0.55;
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay policy may restrict initial unmuted playback until interaction
      }
    };

    // 1. Immediately attempt playback on mount
    void playSong();

    // 2. Attempt immediately as soon as the window and all assets are fully loaded
    if (document.readyState === "complete") {
      void playSong();
    } else {
      const handleWindowLoad = () => void playSong();
      window.addEventListener("load", handleWindowLoad, { once: true });
      document.addEventListener("readystatechange", handleWindowLoad, { once: true });
    }

    // 3. Fallback interaction listeners: first touch, click, pointerdown, or scroll starts song immediately
    const startOnInteraction = () => {
      if (!userPausedRef.current) {
        void playSong();
      }
      cleanupInteractionListeners();
    };

    const interactionEvents: (keyof WindowEventMap)[] = [
      "pointerdown",
      "touchstart",
      "mousedown",
      "keydown",
      "click",
      "scroll",
      "wheel",
    ];

    const cleanupInteractionListeners = () => {
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, startOnInteraction);
      });
    };

    interactionEvents.forEach((event) => {
      window.addEventListener(event, startOnInteraction, { once: true, passive: true });
    });

    // 4. Custom event for explicit triggers (from IntroLoader or intro video events)
    const handleExplicitPlay = () => {
      userPausedRef.current = false;
      void playSong();
    };

    window.addEventListener("play-wedding-song", handleExplicitPlay);

    // 5. Handle pause events: if external media (like a video) causes audio pause, auto-resume
    const handlePause = () => {
      if (userPausedRef.current) {
        setPlaying(false);
      } else {
        // Interrupted by video playback or browser media session switch: resume immediately!
        setTimeout(() => {
          if (!userPausedRef.current && audio.paused) {
            void audio.play().catch(() => {});
          }
        }, 60);
      }
    };

    audio.addEventListener("pause", handlePause);

    return () => {
      cleanupInteractionListeners();
      window.removeEventListener("play-wedding-song", handleExplicitPlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        userPausedRef.current = false;
        audio.volume = 0.55;
        await audio.play();
        setPlaying(true);
      } else {
        userPausedRef.current = true;
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setFailed(true);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={SONG_SRC}
        loop
        preload="auto"
        autoPlay
        onPlay={() => setPlaying(true)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
        title={failed ? "Music unavailable" : playing ? "Pause music" : "Play music"}
        className="fixed bottom-4 left-4 z-[100] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[#2f1d16]/80 text-[#fff8e8] shadow-lg backdrop-blur-sm transition hover:bg-[#2f1d16] focus:outline-none focus:ring-2 focus:ring-white/80 sm:bottom-6 sm:left-6"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18 6a8.5 8.5 0 0 1 0 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="m16 9 5 5M21 9l-5 5" />
          </svg>
        )}
      </button>
    </>
  );
}
