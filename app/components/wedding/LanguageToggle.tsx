"use client";

import { useWeddingLanguage } from "./LanguageContext";

export function LanguageToggle() {
  const { isAmharic, toggleLanguage } = useWeddingLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={isAmharic ? "Switch to English" : "Switch to Amharic"}
      aria-pressed={isAmharic}
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#2f1d16]/80 px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fff8e8] shadow-lg backdrop-blur-sm transition hover:bg-[#2f1d16] focus:outline-none focus:ring-2 focus:ring-white/80 sm:right-6 sm:top-6"
    >
      <span className={!isAmharic ? "text-[#f4d5a3]" : "text-white/65"}>EN</span>
      <span className="text-white/45">/</span>
      <span className={isAmharic ? "font-balderasu text-sm font-normal normal-case tracking-normal text-[#f4d5a3]" : "text-white/65"}>አማ</span>
    </button>
  );
}
