"use client";

import { useState } from "react";
import Image from "next/image";
import { coupleName, wedding } from "@/config/wedding";

export function WeddingHero() {
  // Dark mode is default (Brown Beige with Butter Yellow & White text), toggles to Light mode (Metallic White with moving Butter Yellow ball & Brown Beige text)
  const [isDark, setIsDark] = useState(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="top"
      onMouseMove={handleMouseMove}
      className={`relative w-full min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] transition-colors duration-500 flex flex-col justify-between overflow-hidden border-b ${
        isDark
          ? "bg-[#3D2C22] bg-[radial-gradient(ellipse_at_top,_#4D372B_0%,#39281F_55%,#2A1D16_100%)] border-[#5A4032]"
          : "bg-[#F5F7FA] bg-[radial-gradient(ellipse_at_top,_#FFFFFF_0%,#F3F5F9_45%,#E7EDF3_100%)] border-[#D8DFE8]"
      }`}
    >
      {/* Butter Yellow Ball - Dynamically moves with the cursor */}
      <div
        className={`pointer-events-none absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full blur-3xl will-change-transform transition-all duration-300 ease-out ${
          isDark
            ? "bg-gradient-to-br from-[#FFF8CC] via-[#FEE885] to-[#EAB308] opacity-30"
            : "bg-gradient-to-br from-[#FFF9D2] via-[#FEE885] to-[#FCD34D] opacity-70"
        }`}
        style={
          mousePos
            ? {
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                transform: "translate(-50%, -50%)",
              }
            : {
                left: "35%",
                top: "40%",
                transform: "translate(-50%, -50%)",
              }
        }
        aria-hidden
      />

      {/* Secondary Ambient Accent Orb */}
      <div
        className={`pointer-events-none absolute bottom-1/4 right-1/6 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full blur-3xl animate-butter-ball-secondary will-change-transform transition-opacity duration-500 ${
          isDark
            ? "bg-gradient-to-tr from-[#FFF2B2] via-[#FDE047] to-[#CA8A04] opacity-20"
            : "bg-gradient-to-tr from-[#FFF4B8] via-[#FEE378] to-[#FBCB3A] opacity-45"
        }`}
        aria-hidden
      />

      {/* Light Mode Metallic Specular Highlights */}
      {!isDark && (
        <>
          <div
            className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-white via-[#EEF2F7] to-[#DCE3EC] opacity-75 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-1/3 -right-28 w-[540px] h-[540px] rounded-full bg-gradient-to-bl from-white via-[#EDF1F7] to-[#DFE5EE] opacity-70 blur-3xl"
            aria-hidden
          />
        </>
      )}

      {/* Frosted Glass Layer Diffusing the Background */}
      <div
        className={`pointer-events-none absolute inset-0 backdrop-blur-[50px] transition-colors duration-500 ${
          isDark ? "bg-[#2A1D16]/30" : "bg-white/45"
        }`}
        aria-hidden
      />

      {/* Subtle Luminous Surface Sheen */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? "bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-50"
            : "bg-gradient-to-tr from-white/70 via-transparent to-white/60 opacity-60"
        }`}
        aria-hidden
      />

      {/* Top Left Corner Floral Artwork - Light in Dark Mode, Dark in Light Mode */}
      <div className="pointer-events-none absolute top-0 left-0 z-20 w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-[330px] lg:h-[330px] xl:w-[350px] xl:h-[350px] select-none">
        <Image
          src="/top left light.png"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, (max-width: 1024px) 224px, 350px"
          className={`object-contain object-top-left transition-opacity duration-500 ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        />
        <Image
          src="/top left dark.png"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, (max-width: 1024px) 224px, 350px"
          className={`object-contain object-top-left transition-opacity duration-500 ${
            !isDark ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Theme Toggle Button - Icon only, no name text */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30">
        <button
          type="button"
          onClick={() => setIsDark((prev) => !prev)}
          className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-sm border flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark
              ? "bg-[#2A1D16]/85 backdrop-blur-md border-[#FEE885]/35 text-[#FEE885] hover:bg-[#2A1D16] hover:border-[#FEE885] focus:ring-[#FEE885] focus:ring-offset-[#3D2C22]"
              : "bg-white/85 backdrop-blur-md border-[#D5DCE5] text-[#2B1810] hover:bg-white hover:border-[#8C6A3B] focus:ring-[#8C6A3B] focus:ring-offset-white"
          }`}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            /* Sun Icon in Dark Mode */
            <svg className="w-4 h-4 text-[#FEE885]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          ) : (
            /* Moon Icon in Light Mode */
            <svg className="w-4 h-4 text-[#2B1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Two-Column Editorial Area - On mobile, text occupies the first full viewport, couple photo appears after scroll */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-4 sm:py-8 lg:py-6 w-full max-w-7xl mx-auto min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full my-auto">
          
          {/* Left Column / Mobile Screen 1: Full-Screen Invitation Copy & Actions */}
          <div className="min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-4rem)] lg:min-h-0 lg:col-span-7 flex flex-col items-center justify-center text-center py-10 lg:py-0 w-full">
            
            {/* Glassy Div with No Border Radius - Centered text */}
            <div
              className={`inline-flex items-center justify-center mx-auto px-4 py-1.5 rounded-none backdrop-blur-md shadow-xs select-none transition-colors duration-500 border ${
                isDark
                  ? "bg-[#2A1D16]/65 border-[#FEE885]/35 text-[#FEE885]"
                  : "bg-white/75 border-[#D5DCE5] text-[#2B1810]"
              }`}
            >
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.26em] text-center">
                A DAY TO REMEMBER
              </span>
            </div>

            {/* Main Headline - Sized grandly to fill the mobile first screen */}
            <h1 className="mt-5 sm:mt-6 font-hero-serif text-[clamp(4.25rem,17vw,7.5rem)] leading-[0.88] sm:leading-[0.94] tracking-[-0.035em] font-normal text-center w-full transition-colors duration-500">
              <span className={`block sm:inline whitespace-nowrap transition-colors duration-500 ${isDark ? "text-white" : "text-[#2B1810]"}`}>
                {wedding.couple.first}
              </span>{" "}
              <span className={`block sm:inline my-2 sm:my-0 sm:mx-3 italic font-normal transition-colors duration-500 ${isDark ? "text-[#FEE885]" : "text-[#B18A54]"}`}>
                &amp;
              </span>{" "}
              <span className={`block sm:inline whitespace-nowrap transition-colors duration-500 ${isDark ? "text-white" : "text-[#2B1810]"}`}>
                {wedding.couple.second}
              </span>
            </h1>

            {/* Floral Underline for Couple Name - Underline Light in Dark Mode, Underline Dark in Light Mode */}
            <div className="relative w-full max-w-[480px] sm:max-w-[620px] md:max-w-[740px] lg:max-w-[840px] aspect-[2.7/1] mx-auto -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 -mb-11 sm:-mb-15 md:-mb-18 lg:-mb-21 pointer-events-none select-none">
              <Image
                src="/flower underline light.png"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 440px, (max-width: 768px) 560px, 780px"
                className={`object-contain object-center transition-opacity duration-500 ${
                  isDark ? "opacity-100" : "opacity-0"
                }`}
              />
              <Image
                src="/flower underline dark.png"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 440px, (max-width: 768px) 560px, 780px"
                className={`object-contain object-center transition-opacity duration-500 ${
                  !isDark ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            {/* Supporting Headline / Subtitle - Centered */}
            <p
              className={`mt-2 sm:mt-2.5 text-base sm:text-lg lg:text-xl font-editorial-serif italic font-normal text-center mx-auto transition-colors duration-500 ${
                isDark ? "text-[#FEE885]" : "text-[#8C6A3B]"
              }`}
            >
              Two hearts, one beautiful beginning.
            </p>

            {/* Supporting Paragraph - Centered */}
            <p
              className={`mt-4 sm:mt-5 text-xs sm:text-sm lg:text-base leading-relaxed font-sans font-light max-w-md sm:max-w-lg mx-auto text-center px-2 transition-colors duration-500 ${
                isDark ? "text-white/85" : "text-[#5A4F46]"
              }`}
            >
              With grateful hearts, we invite you to celebrate the beginning of our forever. Your presence would make our special day even more meaningful.
            </p>

            {/* Primary & Secondary Call to Actions - Centered */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
              <a
                href="#invitation"
                className={`min-h-[48px] px-7 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDark
                    ? "bg-[#FEE885] text-[#2B1810] hover:bg-white focus:ring-[#FEE885] focus:ring-offset-[#3D2C22]"
                    : "bg-[#2B1810] text-[#F8F4ED] hover:bg-[#8C6A3B] focus:ring-[#8C6A3B] focus:ring-offset-white"
                }`}
              >
                <span>You&apos;re Invited</span>
                <span aria-hidden>↓</span>
              </a>

              <a
                href="#date"
                className={`min-h-[48px] px-6 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-medium inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDark
                    ? "border border-[#FEE885]/40 bg-[#2A1D16]/50 backdrop-blur-md text-[#FEE885] hover:bg-[#FEE885]/15 hover:border-[#FEE885] focus:ring-[#FEE885] focus:ring-offset-[#3D2C22]"
                    : "border border-[#D5DCE5] bg-white/75 backdrop-blur-md text-[#2B1810] hover:bg-white hover:border-[#8C6A3B] focus:ring-[#8C6A3B] focus:ring-offset-white"
                }`}
              >
                <span>Discover Our Day</span>
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* Mobile Scroll Indicator to Guide to Photograph */}
            <div className="lg:hidden mt-8 sm:mt-10 flex flex-col items-center gap-1.5 opacity-80 animate-bounce">
              <span className={`text-[10px] tracking-[0.24em] uppercase font-sans font-medium ${isDark ? "text-[#FEE885]" : "text-[#8C6A3B]"}`}>
                Scroll to view portrait
              </span>
              <span className={`text-xs ${isDark ? "text-[#FEE885]" : "text-[#8C6A3B]"}`} aria-hidden>
                ↓
              </span>
            </div>
          </div>

          {/* Right Column / Mobile Screen 2: Hero Couple Photograph - Found after scroll on mobile */}
          <div className="min-h-[85dvh] sm:min-h-[90dvh] lg:min-h-0 lg:col-span-5 relative flex flex-col justify-center items-center py-12 lg:py-0 w-full">
            {/* Camera-Printed Instant Photo Card */}
            <div
              className={`relative bg-white p-3 sm:p-4 pb-8 sm:pb-10 rounded-md border transform -rotate-1 hover:rotate-0 transition-all duration-500 ease-out max-w-[320px] sm:max-w-[370px] lg:max-w-[400px] w-full ${
                isDark
                  ? "shadow-[0_25px_50px_rgba(0,0,0,0.38),0_6px_20px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.15)] border-white/90"
                  : "shadow-[0_22px_45px_rgba(30,40,55,0.12),0_6px_16px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.06)] border-[#E2E6EC]"
              }`}
            >
              {/* Photo Inset Frame with subtle darkroom inset border */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-[#F2EDE4] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
                <Image
                  src="/couple.JPG"
                  alt={`${coupleName} wedding portrait`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-[center_20%] transition-transform duration-700 hover:scale-[1.03]"
                />
                {/* Subtle soft gradient reflection */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810]/12 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
              </div>

              {/* Camera Print Bottom Chin Caption */}
              <div className="pt-2.5 sm:pt-3 flex items-center justify-between text-[#7A6452]">
                <span className="font-hero-serif italic text-xs sm:text-sm tracking-wide text-[#382416]">
                  {wedding.couple.first} &amp; {wedding.couple.second}
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#9B7C3E]">
                  ✦ Forever
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Information Strip */}
      <div
        className={`relative z-10 w-full border-t px-5 sm:px-8 lg:px-14 py-3.5 sm:py-4 flex-shrink-0 transition-colors duration-500 ${
          isDark
            ? "border-[#5A4032] bg-[#271A13]/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
            : "border-[#DCE2EA] bg-white/65 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.02)]"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-0 transition-colors duration-500 ${
            isDark ? "lg:divide-x lg:divide-[#5A4032]/70" : "lg:divide-x lg:divide-[#DCE2EA]"
          }`}
        >
          {/* Strip Item 1 */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:px-5 first:lg:pl-0">
            <div
              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs transition-colors duration-500 ${
                isDark
                  ? "bg-[#3B281E] border border-[#FEE885]/30 text-[#FEE885]"
                  : "bg-white/90 border border-[#D5DCE5] text-[#8C6A3B]"
              }`}
            >
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </div>
            <div>
              <p className={`font-sans font-semibold text-xs sm:text-sm transition-colors duration-500 ${isDark ? "text-white" : "text-[#2B1810]"}`}>
                A Beautiful Beginning
              </p>
              <p className={`font-sans text-[10px] sm:text-[11px] transition-colors duration-500 ${isDark ? "text-[#FEE885]/80" : "text-[#6E645A]"}`}>
                A day to remember
              </p>
            </div>
          </div>

          {/* Strip Item 2 */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:px-5">
            <div
              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs transition-colors duration-500 ${
                isDark
                  ? "bg-[#3B281E] border border-[#FEE885]/30 text-[#FEE885]"
                  : "bg-white/90 border border-[#D5DCE5] text-[#8C6A3B]"
              }`}
            >
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <p className={`font-sans font-semibold text-xs sm:text-sm transition-colors duration-500 ${isDark ? "text-white" : "text-[#2B1810]"}`}>
                Together Forever
              </p>
              <p className={`font-sans text-[10px] sm:text-[11px] transition-colors duration-500 ${isDark ? "text-[#FEE885]/80" : "text-[#6E645A]"}`}>
                One love, one journey
              </p>
            </div>
          </div>

          {/* Strip Item 3 */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:px-5">
            <div
              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs transition-colors duration-500 ${
                isDark
                  ? "bg-[#3B281E] border border-[#FEE885]/30 text-[#FEE885]"
                  : "bg-white/90 border border-[#D5DCE5] text-[#8C6A3B]"
              }`}
            >
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div>
              <p className={`font-sans font-semibold text-xs sm:text-sm transition-colors duration-500 ${isDark ? "text-white" : "text-[#2B1810]"}`}>
                Shared With Loved Ones
              </p>
              <p className={`font-sans text-[10px] sm:text-[11px] transition-colors duration-500 ${isDark ? "text-[#FEE885]/80" : "text-[#6E645A]"}`}>
                Celebrating together
              </p>
            </div>
          </div>

          {/* Strip Item 4 */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:px-5 last:lg:pr-0">
            <div
              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs transition-colors duration-500 ${
                isDark
                  ? "bg-[#3B281E] border border-[#FEE885]/30 text-[#FEE885]"
                  : "bg-white/90 border border-[#D5DCE5] text-[#8C6A3B]"
              }`}
            >
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0 3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <div>
              <p className={`font-sans font-semibold text-xs sm:text-sm transition-colors duration-500 ${isDark ? "text-white" : "text-[#2B1810]"}`}>
                A Lifetime Ahead
              </p>
              <p className={`font-sans text-[10px] sm:text-[11px] transition-colors duration-500 ${isDark ? "text-[#FEE885]/80" : "text-[#6E645A]"}`}>
                Our next chapter
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
