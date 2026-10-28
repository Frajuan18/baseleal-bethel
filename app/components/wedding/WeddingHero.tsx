"use client";

import Image from "next/image";
import { useWeddingLanguage } from "./LanguageContext";
import { useInvitation } from "./InvitationContext";

export function WeddingHero() {
  const { isAmharic } = useWeddingLanguage();
  const { hasToken } = useInvitation();

  return (
    <section id="top" lang={isAmharic ? "am" : "en"} className="relative isolate min-h-[100svh] overflow-hidden bg-[#c6a276] text-[#fff9ed] lg:h-screen">
      <Image src="/hero.png" alt="" fill priority sizes="100vw" className="pointer-events-none -z-20 object-cover opacity-100 hero-anim hero-fade" style={{ animationDelay: "0ms" }} aria-hidden />
      <div className="hero-anim hero-fade absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(151,91,53,.96)_0%,rgba(190,137,88,.72)_46%,rgba(243,228,196,.12)_100%)] lg:bg-[linear-gradient(105deg,rgba(151,91,53,.96)_0%,rgba(175,123,78,.78)_38%,rgba(223,189,143,.25)_72%,rgba(243,228,196,.05)_100%)]" style={{ animationDelay: "180ms" }} />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 lg:h-full lg:grid-cols-[42%_58%]">
        <div className="relative z-10 flex flex-col justify-center px-8 pb-16 pt-20 sm:px-12 lg:px-12 xl:px-16">
          <h1 className={`hero-anim hero-veil mb-16 sm:mb-16 lg:mb-12 flex flex-col gap-6 font-normal text-[#fffdf5] [-webkit-text-stroke:0.2px_currentColor] sm:gap-7 lg:gap-10 ${isAmharic ? "font-jegna-title text-[clamp(5rem,12vw,7rem)] leading-[1.2] lg:text-[clamp(3.4rem,7vw,6.5rem)]" : "font-brittany-signature whitespace-nowrap text-[clamp(5.7rem,14vw,8rem)] leading-[1.12] tracking-normal lg:text-[clamp(4.2rem,7vw,7rem)]"}`} style={{ animationDelay: "420ms" }}>
            <span className="block">{isAmharic ? "ባስልኤል" : "Basseleal"}</span>
            <span className="block">{isAmharic ? "እና ቤተል" : "& Bethel"}</span>
          </h1>
          <div className="hero-anim hero-rise mt-4 max-w-[460px]" style={{ animationDelay: "960ms" }}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff6e3]/75 ${isAmharic ? "font-balderasu tracking-normal" : "font-sans"}`}>
              {isAmharic ? "ኦሪት ዘፍጥረት 35:3" : "Genesis 35:3"}
            </p>
            <p className={`mt-2 text-base leading-[1.75] text-[#fff6e3] sm:text-lg ${isAmharic ? "font-balderasu" : "font-serif italic"}`}>
              {isAmharic
                ? "3 ተነሥተን ወደ ቤቴል እንውጣ፤ እዚያም በመከራዬ ጊዜ ለሰማኝ፣ በሄድሁበትም ስፍራ ሁሉ ላልተለየኝ አምላክ (ኤል) መሠዊያ እሠራለሁ።”"
                : "3 Then come, let us go up to Bethel, where I will build an altar to God, who answered me in the day of my distress and who has been with me wherever I have gone.”"}
            </p>
          </div>
          <a href={hasToken ? "#directions" : "#invitation"} className={`hero-anim hero-rise mt-7 inline-flex w-fit rounded-full bg-[#f4e5c9] px-7 py-4 text-xs text-[#8b6c4d] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80 ${isAmharic ? "font-balderasu font-normal" : "font-sans font-semibold uppercase tracking-[.16em]"}`} style={{ animationDelay: "1120ms" }}>{isAmharic ? "ተጋብዘዋል" : "You're Invited"} <span aria-hidden>↓</span></a>

        </div>

        <div className="relative min-h-[560px] lg:min-h-0">
          <div className="hero-anim hero-unveil absolute bottom-[-12%] left-[-8%] h-[118%] w-[116%] sm:bottom-[-10%] sm:left-[-4%] sm:h-[112%] sm:w-[108%] lg:bottom-[-7%] lg:left-[0%] lg:h-[108%] lg:w-[84%]" style={{ animationDelay: "260ms" }}>
            <Image
              src="/hero main.png"
              alt="Basseleal and Bethel wedding portrait"
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
