"use client";

import Image from "next/image";
import { useWeddingLanguage } from "./LanguageContext";

export function WeddingHero() {
  const { isAmharic, toggleLanguage } = useWeddingLanguage();

  return (
    <section id="top" lang={isAmharic ? "am" : "en"} className="relative isolate min-h-[100svh] overflow-hidden bg-[#c6a276] text-[#fff9ed] lg:h-screen">
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label={isAmharic ? "Switch to English" : "Switch to Amharic"}
        aria-pressed={isAmharic}
        className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#2f1d16]/75 px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fff8e8] shadow-lg backdrop-blur-sm transition hover:bg-[#2f1d16] focus:outline-none focus:ring-2 focus:ring-white/80 sm:right-6 sm:top-6"
      >
        <span className={!isAmharic ? "text-[#f4d5a3]" : "text-white/65"}>EN</span>
        <span className="text-white/45">/</span>
        <span className={isAmharic ? "font-balderasu text-sm font-normal normal-case tracking-normal text-[#f4d5a3]" : "text-white/65"}>አማ</span>
      </button>
      <Image src="/hero.png" alt="" fill priority sizes="100vw" className="pointer-events-none -z-20 object-cover opacity-100 hero-anim hero-fade" style={{ animationDelay: "0ms" }} aria-hidden />
      <div className="hero-anim hero-fade absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(151,91,53,.96)_0%,rgba(190,137,88,.72)_46%,rgba(243,228,196,.12)_100%)] lg:bg-[linear-gradient(105deg,rgba(151,91,53,.96)_0%,rgba(175,123,78,.78)_38%,rgba(223,189,143,.25)_72%,rgba(243,228,196,.05)_100%)]" style={{ animationDelay: "180ms" }} />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 lg:h-full lg:grid-cols-[42%_58%]">
        <div className="relative z-10 flex flex-col justify-center px-8 pb-16 pt-20 sm:px-12 lg:px-12 xl:px-16">
          <h1 className={`hero-anim hero-veil mb-6 flex flex-col gap-6 font-normal text-[#fffdf5] [-webkit-text-stroke:0.2px_currentColor] sm:gap-7 lg:gap-10 ${isAmharic ? "font-jegna-title text-[clamp(3.4rem,7vw,6.5rem)] leading-[1.2]" : "font-brittany-signature whitespace-nowrap text-[clamp(4.2rem,7vw,7rem)] leading-[1.12] tracking-normal"}`} style={{ animationDelay: "420ms" }}>
            <span className="block">{isAmharic ? "ባሰላል" : "Baseleal"}</span>
            <span className="block">{isAmharic ? "እና ቤተል" : "& Bethel"}</span>
          </h1>
          <p className={`hero-anim hero-rise text-lg leading-snug text-[#fff6e3] sm:text-xl ${isAmharic ? "font-balderasu" : "font-serif italic"}`} style={{ animationDelay: "820ms" }}>{isAmharic ? "ሁለት ልቦች፣ አንድ ውብ ጅምር።" : "Two hearts, one beautiful beginning."}</p>
          <p className={`hero-anim hero-rise mt-3 max-w-[390px] text-sm leading-[1.8] text-[#fff6e3]/90 sm:text-base ${isAmharic ? "font-balderasu" : "font-sans"}`} style={{ animationDelay: "960ms" }}>{isAmharic ? "በምስጋና የተሞላ ልብ፣ የዘላለም ጉዟችንን ለመጀመር ከእኛ ጋር እንድትደሰቱ በክብር እንጋብዛችኋለን። መገኘታችሁ ይህን ልዩ ቀን የበለጠ ውብ ያደርገዋል።" : "With grateful hearts, we invite you to celebrate the beginning of our forever. Your presence would make our special day even more meaningful."}</p>
          <button className={`hero-anim hero-rise mt-7 w-fit rounded-full bg-[#f4e5c9] px-7 py-4 text-xs text-[#8b6c4d] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80 ${isAmharic ? "font-balderasu font-normal" : "font-sans font-semibold uppercase tracking-[.16em]"}`} style={{ animationDelay: "1120ms" }}>{isAmharic ? "ተጋብዘዋል" : "You're Invited"} <span aria-hidden>↓</span></button>

        </div>

        <div className="relative min-h-[560px] lg:min-h-0">
          <div className="hero-anim hero-unveil absolute bottom-[-12%] left-[-8%] h-[118%] w-[116%] sm:bottom-[-10%] sm:left-[-4%] sm:h-[112%] sm:w-[108%] lg:bottom-[-7%] lg:left-[0%] lg:h-[108%] lg:w-[84%]" style={{ animationDelay: "260ms" }}>
            <Image
              src="/hero main.png"
              alt="Baseleal and Bethel wedding portrait"
              fill
              priority
              sizes="(max-width: 1024px) 88vw, 48vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
