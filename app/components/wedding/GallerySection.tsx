"use client";

import { useRef, useState } from "react";
import { useWeddingLanguage } from "./LanguageContext";
import CircularGallery from "./CircularGallery";

const GALLERY_ITEMS = [
  { image: "/couple 1 new.jpg" },
  { image: "/couple 2 new.jpg" },
  { image: "/couple 3 new.jpg" },
  { image: "/couple 4 new.jpg" },
  { image: "/couple 5 new.jpg" },
  { image: "/couple 6.jpg" },
  { image: "/couple 7.jpg" },
  { image: "/couple 8.jpg" },
];

interface CircularGalleryHandle {
  wake: () => void;
  open: (index: number) => void;
  focus: (index: number) => void;
  prev: () => void;
  next: () => void;
  close: () => void;
}

export function GallerySection() {
  const { isAmharic } = useWeddingLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<CircularGalleryHandle | null>(null);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    galleryRef.current?.focus(index);
  };

  return (
    <section
      id="gallery"
      lang={isAmharic ? "am" : "en"}
      className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#1f120c] py-16 sm:py-20 text-[#FAF4ED]"
    >
      {/* Blurred lighter brown ambient glows in the background */}
      <div
        className="pointer-events-none absolute -top-24 -left-20 h-[480px] w-[480px] rounded-full bg-[#B38863]/30 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[750px] rounded-full bg-gradient-to-tr from-[#9C7250]/35 via-[#C6A47E]/30 to-[#B38863]/25 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-20 h-[520px] w-[520px] rounded-full bg-[#C6A47E]/25 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-8 left-1/4 h-[320px] w-[420px] rounded-full bg-[#A2754E]/25 blur-[100px]"
        aria-hidden
      />

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p
          className={`text-xs uppercase tracking-[0.3em] text-[#E2C66A] ${
            isAmharic ? "font-balderasu tracking-widest" : "font-sans font-medium"
          }`}
        >
          {isAmharic ? "የማይረሱ ትዝታዎችና አፍታዎች" : "Moments & Memories"}
        </p>
        <h2
          className={`mt-2.5 text-3xl sm:text-4xl md:text-5xl text-[#FFFDF5] ${
            isAmharic ? "font-jegna-title" : "font-editorial-serif"
          }`}
        >
          {isAmharic ? "የደስታችን ማህደር (ጋለሪ)" : "Our Celebration Gallery"}
        </h2>
        <p
          className={`mt-3 text-xs sm:text-sm text-[#FAF4ED]/70 ${
            isAmharic ? "font-balderasu" : "font-sans font-light"
          }`}
        >
          {isAmharic
            ? "የ3D ማህደራችንን ለመመልከት ምስሎችን ይጎትቱ፣ ወደ ጎን ያንሸራትቱ፣ ከታች ያሉትን ነጥቦች ይንኩ ወይም ካርዶቹን ይጫኑ።"
            : "Drag, scroll, tap dots below, or click each card to explore our 3D gallery."}
        </p>
      </div>

      {/* 3D Circular Gallery */}
      <div className="relative z-10 mt-10 w-full">
        <div style={{ height: "600px", position: "relative" }} className="w-full overflow-hidden">
          <CircularGallery
            galleryRef={galleryRef}
            items={GALLERY_ITEMS}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.05}
            onItemClick={(item: { text?: string }, index: number) => console.log(item?.text, index)}
            onActiveChange={(index: number) => setActiveIndex(index)}
            itemSize={1}
            itemAspect={0.78}
            gap={0.26}
            wave={1}
            fadeEdges={0.12}
            shadow={0.25}
            scrollSpeed={2}
            autoScroll={0}
            snap
            grayscale={false}
            showTitles={false}
            openOnClick
            intro
          />
        </div>

        {/* Navigation Dots for image tracking with no background */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {GALLERY_ITEMS.map((_, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDotClick(index)}
                aria-label={
                  isAmharic
                    ? `ምስል ${index + 1}`
                    : `Photo ${index + 1}`
                }
                aria-current={isActive ? "true" : undefined}
                className="group relative flex items-center justify-center p-1.5 focus:outline-none"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ease-out ${
                    isActive
                      ? "h-2.5 w-8 bg-gradient-to-r from-[#E2C66A] to-[#F3E2A9] shadow-[0_0_14px_rgba(226,198,106,0.7)]"
                      : "h-2.5 w-2.5 bg-[#FAF4ED]/35 hover:bg-[#FAF4ED]/75 hover:scale-125"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
