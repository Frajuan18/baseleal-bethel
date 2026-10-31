"use client";

import { useEffect, useRef, useState } from "react";

const SONG_SRC = "/song/Samuel-Zergaw-Kingdom-Sound-Worship-Night-2025-Yastawekebegn.m4a";

export function SongToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  // Attempt to play music automatically by default
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    const tryAutoplay = async () => {
      try {
        await audio.play();
      } catch {
        // Autoplay policy prevented immediate playback without user interaction
        // Set up one-shot global interaction listeners to start playing immediately on first touch/click
        const startOnInteraction = async () => {
          try {
            audio.volume = 0.55;
            await audio.play();
          } catch {
            // ignore
          } finally {
            window.removeEventListener("pointerdown", startOnInteraction);
            window.removeEventListener("keydown", startOnInteraction);
            window.removeEventListener("touchstart", startOnInteraction);
          }
        };

        window.addEventListener("pointerdown", startOnInteraction, { once: true });
        window.addEventListener("keydown", startOnInteraction, { once: true });
        window.addEventListener("touchstart", startOnInteraction, { once: true });
      }
    };

    void tryAutoplay();

    // Listen to custom event in case another component (like IntroLoader) explicitly signals audio start
    const handleExplicitPlay = () => {
      if (audio.paused) {
        audio.volume = 0.55;
        void audio.play().catch(() => {});
      }
    };

    window.addEventListener("play-wedding-song", handleExplicitPlay);

    return () => {
      window.removeEventListener("play-wedding-song", handleExplicitPlay);
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        audio.volume = 0.55;
        await audio.play();
      } else {
        audio.pause();
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
        onPause={() => setPlaying(false)}
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
