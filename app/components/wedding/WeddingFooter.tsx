"use client";

import { useWeddingLanguage } from "./LanguageContext";

export function WeddingFooter() {
  const { isAmharic } = useWeddingLanguage();

  return (
    <footer
      id="footer"
      lang={isAmharic ? "am" : "en"}
      className="relative w-full border-t border-b border-[#CBB596]/60 bg-transparent py-12 sm:py-16 md:py-20 select-none m-0"
    >
      {/* Top and Bottom secondary hairlines for traditional Bible page double-ruled border look spanning full screen width */}
      <div className="pointer-events-none absolute inset-x-0 top-1 h-px bg-[#B39368]/25" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-1 h-px bg-[#B39368]/25" aria-hidden />

      {/* Full width content attached to screen borders with transparent background */}
      <div className="w-full px-4 sm:px-8 md:px-12 text-center bg-transparent">
        <div className="mx-auto max-w-3xl space-y-2.5 sm:space-y-3.5">
          {/* Scripture Reference Title */}
          <p className={`text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.24em] text-[#8C6A3B] ${isAmharic ? "font-balderasu" : "font-sans"}`}>
            {isAmharic ? "ኦሪት ዘፍጥረት 35:3" : "GENESIS 35:3"}
          </p>

          {/* Holy Scripture Verse */}
          <p
            className={`text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-[#4A3527] italic max-w-2xl mx-auto ${
              isAmharic ? "font-balderasu" : "font-editorial-serif"
            }`}
          >
            {isAmharic
              ? "“ተነሥተን ወደ ቤቴል እንውጣ፤ እዚያም በመከራዬ ጊዜ ለሰማኝ፣ በሄድሁበትም ስፍራ ሁሉ ላልተለየኝ አምላክ መሠዊያ እሠራለሁ።”"
              : "“Then come, let us go up to Bethel, where I will build an altar to God, who answered me in the day of my distress and who has been with me wherever I have gone.”"}
          </p>
        </div>
      </div>
    </footer>
  );
}
