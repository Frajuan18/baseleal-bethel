"use client";

import { useEffect, useState } from "react";
import { useWeddingLanguage } from "./LanguageContext";

export function QuickDirectionsPill() {
  const { isAmharic } = useWeddingLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past the hero (250px), but hide if already at the directions section
      const directionsEl = document.getElementById("directions");
      if (!directionsEl) {
        setVisible(window.scrollY > 250);
        return;
      }
      const rect = directionsEl.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.2;
      setVisible(window.scrollY > 250 && !inView);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick Directions Access"
      className="fixed bottom-6 left-6 z-40 animate-fadeIn"
    >
      <a
        href="#directions"
        className="group inline-flex items-center gap-2 rounded-full border border-[#D5C6B5] bg-white/95 px-4 py-2.5 text-xs font-semibold text-[#2B1810] shadow-[0_10px_25px_-5px_rgba(43,24,16,0.18)] backdrop-blur-md transition-all hover:bg-[#2B1810] hover:text-[#FAF6F0] hover:border-[#2B1810] active:scale-95"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FAF5EE] text-[#8C6A3B] transition-colors group-hover:bg-[#8C6A3B] group-hover:text-white">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </span>
        <span className={isAmharic ? "font-benaiah text-xs sm:text-sm tracking-normal font-bold" : "tracking-wider uppercase text-[10px]"}>
          {isAmharic ? "የቦታዎች አቅጣጫ" : "Directions"}
        </span>
      </a>
    </aside>
  );
}
