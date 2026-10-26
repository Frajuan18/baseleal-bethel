"use client";

import Image from "next/image";
import { useWeddingLanguage } from "./LanguageContext";

export function WeddingHero() {
  const { isAmharic } = useWeddingLanguage();

  const handleScrollToInvite = () => {
    document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" lang={isAmharic ? "am" : "en"} className="relative isolate min-h-[100svh] overflow-hidden bg-[#c6a276] text-[#fff9ed] lg:h-screen">
      <Image src="/hero.png" alt="" fill priority sizes="100vw" className="pointer-events-none -z-20 object-cover opacity-100 hero-anim hero-fade" style={{ animationDelay: "0ms" }} aria-hidden />
      <div className="hero-anim hero-fade absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(151,91,53,.96)_0%,rgba(190,137,88,.72)_46%,rgba(243,228,196,.12)_100%)] lg:bg-[linear-gradient(105deg,rgba(151,91,53,.96)_0%,rgba(175,123,78,.78)_38%,rgba(223,189,143,.25)_72%,rgba(243,228,196,.05)_100%)]" style={{ animationDelay: "180ms" }} />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 lg:h-full lg:grid-cols-[44%_56%] items-end">
        <div className="relative z-10 flex flex-col justify-center px-8 pb-10 pt-16 sm:px-12 sm:pb-14 sm:pt-20 lg:px-12 xl:px-16 lg:h-full">
          <h1 className={`hero-anim hero-veil mb-6 flex flex-col gap-6 font-normal text-[#fffdf5] [-webkit-text-stroke:0.2px_currentColor] sm:gap-7 lg:gap-10 ${isAmharic ? "font-jegna-title text-[clamp(3.4rem,7vw,6.5rem)] leading-[1.2]" : "font-brittany-signature whitespace-nowrap text-[clamp(4.2rem,7vw,7rem)] leading-[1.12] tracking-normal"}`} style={{ animationDelay: "420ms" }}>
            <span className="block">{isAmharic ? "ባሰላል" : "Baseleal"}</span>
            <span className="block">{isAmharic ? "እና ቤተል" : "& Bethel"}</span>
          </h1>
          <p className={`hero-anim hero-rise text-lg leading-snug text-[#fff6e3] sm:text-xl ${isAmharic ? "font-balderasu" : "font-serif italic"}`} style={{ animationDelay: "820ms" }}>{isAmharic ? "ሁለት ልቦች፣ አንድ ውብ ጅምር።" : "Two hearts, one beautiful beginning."}</p>
          <p className={`hero-anim hero-rise mt-3 max-w-[390px] text-sm leading-[1.8] text-[#fff6e3]/90 sm:text-base ${isAmharic ? "font-balderasu" : "font-sans"}`} style={{ animationDelay: "960ms" }}>{isAmharic ? "በምስጋና የተሞላ ልብ፣ የዘላለም ጉዟችንን ለመጀመር ከእኛ ጋር እንድትደሰቱ በክብር እንጋብዛችኋለን። መገኘታችሁ ይህን ልዩ ቀን የበለጠ ውብ ያደርገዋል።" : "With grateful hearts, we invite you to celebrate the beginning of our forever. Your presence would make our special day even more meaningful."}</p>
          <button onClick={handleScrollToInvite} className={`hero-anim hero-rise mt-7 w-fit rounded-full bg-[#f4e5c9] px-7 py-4 text-xs text-[#8b6c4d] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer ${isAmharic ? "font-balderasu font-normal" : "font-sans font-semibold uppercase tracking-[.16em]"}`} style={{ animationDelay: "1120ms" }}>{isAmharic ? "ተጋብዘዋል" : "You're Invited"} <span aria-hidden>↓</span></button>

        </div>

        {/* Couple portrait - cleanly grounded, full hands/knuckles visible with seamless feathering */}
        <div className="relative flex items-end justify-center lg:justify-end min-h-[460px] sm:min-h-[520px] lg:h-full w-full overflow-hidden">
          <div
            className="hero-anim hero-unveil relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] xl:max-w-[620px] h-[480px] sm:h-[550px] lg:h-[93%] xl:h-[96%] flex items-end justify-center select-none"
            style={{
              animationDelay: "260ms",
              maskImage: "linear-gradient(to bottom, black 82%, rgba(0,0,0,0.85) 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 82%, rgba(0,0,0,0.85) 92%, transparent 100%)",
            }}
          >
            <Image
              src="/hero main.png"
              alt="Baseleal and Bethel wedding portrait"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 48vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>

      {/* Seamless transition gradient to eliminate any line or break between sections */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-b from-transparent via-[#c6a276]/20 to-[#c6a276]/45"
        aria-hidden
      />
    </section>
  );
}
