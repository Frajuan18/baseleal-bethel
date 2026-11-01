"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type FlowerItem = {
  id: number;
  type: 1 | 2;
  topPct: number;
  leftPct?: number;
  rightPct?: number;
  sizeDesktop: number;
  sizeMobile: number;
  baseRotation: number;
  parallaxSpeed: number;
  rotationSpeed: number;
  floatDuration: string;
  floatDelay: string;
};

const FLOWERS: FlowerItem[] = [
  // 1. Hero upper-left
  {
    id: 1,
    type: 1,
    topPct: 3.5,
    leftPct: 3.5,
    sizeDesktop: 62,
    sizeMobile: 42,
    baseRotation: -16,
    parallaxSpeed: 0.22,
    rotationSpeed: 0.06,
    floatDuration: "7s",
    floatDelay: "0s",
  },
  // 2. Hero upper-right
  {
    id: 2,
    type: 2,
    topPct: 10,
    rightPct: 4,
    sizeDesktop: 70,
    sizeMobile: 46,
    baseRotation: 28,
    parallaxSpeed: -0.18,
    rotationSpeed: -0.05,
    floatDuration: "8.5s",
    floatDelay: "1.2s",
  },
  // 3. Hero bottom / Invitation entrance
  {
    id: 3,
    type: 1,
    topPct: 18,
    leftPct: 5,
    sizeDesktop: 54,
    sizeMobile: 36,
    baseRotation: 42,
    parallaxSpeed: 0.25,
    rotationSpeed: 0.07,
    floatDuration: "6.8s",
    floatDelay: "2.4s",
  },
  // 4. Invitation Card top-right margin
  {
    id: 4,
    type: 2,
    topPct: 26,
    rightPct: 3.5,
    sizeDesktop: 68,
    sizeMobile: 44,
    baseRotation: -28,
    parallaxSpeed: -0.20,
    rotationSpeed: -0.05,
    floatDuration: "9s",
    floatDelay: "0.8s",
  },
  // 5. Invitation Card mid-left margin
  {
    id: 5,
    type: 1,
    topPct: 35,
    leftPct: 4,
    sizeDesktop: 74,
    sizeMobile: 48,
    baseRotation: 14,
    parallaxSpeed: 0.22,
    rotationSpeed: 0.05,
    floatDuration: "7.5s",
    floatDelay: "1.8s",
  },
  // 6. Transition to Gallery right margin
  {
    id: 6,
    type: 2,
    topPct: 44,
    rightPct: 4.5,
    sizeDesktop: 60,
    sizeMobile: 38,
    baseRotation: -22,
    parallaxSpeed: -0.22,
    rotationSpeed: 0.06,
    floatDuration: "8s",
    floatDelay: "3s",
  },
  // 7. Gallery Section left margin
  {
    id: 7,
    type: 1,
    topPct: 53,
    leftPct: 3.5,
    sizeDesktop: 64,
    sizeMobile: 42,
    baseRotation: 36,
    parallaxSpeed: 0.26,
    rotationSpeed: -0.06,
    floatDuration: "6.5s",
    floatDelay: "1.5s",
  },
  // 8. Gallery / Calendar transition right margin
  {
    id: 8,
    type: 2,
    topPct: 62,
    rightPct: 4,
    sizeDesktop: 72,
    sizeMobile: 46,
    baseRotation: -14,
    parallaxSpeed: -0.18,
    rotationSpeed: 0.04,
    floatDuration: "8.2s",
    floatDelay: "0.5s",
  },
  // 9. Calendar Section left margin
  {
    id: 9,
    type: 1,
    topPct: 72,
    leftPct: 4,
    sizeDesktop: 56,
    sizeMobile: 38,
    baseRotation: -26,
    parallaxSpeed: 0.20,
    rotationSpeed: 0.05,
    floatDuration: "7.2s",
    floatDelay: "2.1s",
  },
  // 10. Calendar / RSVP transition right margin
  {
    id: 10,
    type: 2,
    topPct: 81,
    rightPct: 4,
    sizeDesktop: 68,
    sizeMobile: 44,
    baseRotation: 22,
    parallaxSpeed: -0.20,
    rotationSpeed: -0.04,
    floatDuration: "9.2s",
    floatDelay: "1.0s",
  },
  // 11. RSVP Section left margin
  {
    id: 11,
    type: 1,
    topPct: 90,
    leftPct: 4.5,
    sizeDesktop: 60,
    sizeMobile: 40,
    baseRotation: -18,
    parallaxSpeed: 0.24,
    rotationSpeed: 0.06,
    floatDuration: "7s",
    floatDelay: "2.8s",
  },
  // 12. Bottom Directions right margin
  {
    id: 12,
    type: 2,
    topPct: 97,
    rightPct: 4.5,
    sizeDesktop: 64,
    sizeMobile: 42,
    baseRotation: 32,
    parallaxSpeed: -0.18,
    rotationSpeed: -0.05,
    floatDuration: "8s",
    floatDelay: "0.2s",
  },
];

export function ScrollFlowers() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flowerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let targetScrollY = window.scrollY;
    let currentScrollY = targetScrollY;
    let lastScrollY = targetScrollY;
    let velocity = 0;
    let rafId: number | null = null;
    let isRunning = false;

    const onScroll = () => {
      targetScrollY = window.scrollY;
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update);
      }
    };

    const update = () => {
      // Lerp current scroll toward target scroll for physical spring feel
      const diff = targetScrollY - currentScrollY;
      currentScrollY += diff * 0.12;

      // Track instantaneous scroll velocity
      velocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const container = containerRef.current;
      const totalHeight = container ? container.offsetHeight : document.documentElement.scrollHeight;
      const viewportMid = currentScrollY + window.innerHeight * 0.5;

      FLOWERS.forEach((item, index) => {
        const el = flowerRefs.current[index];
        if (!el) return;

        const flowerTargetY = (item.topPct / 100) * totalHeight;
        const distFromMid = viewportMid - flowerTargetY;

        // Parallax translation along Y axis
        const yOffset = distFromMid * item.parallaxSpeed;
        // Parallax rotation + dynamic wind tilt based on velocity
        const rotOffset = distFromMid * item.rotationSpeed + Math.max(-18, Math.min(18, velocity * 0.25));

        el.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 0) rotate(${(item.baseRotation + rotOffset).toFixed(1)}deg)`;
      });

      // Keep running while there is motion or diff
      if (Math.abs(diff) > 0.4 || Math.abs(velocity) > 0.2) {
        rafId = requestAnimationFrame(update);
      } else {
        isRunning = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial run to set positions
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
    >
      <style jsx>{`
        @keyframes subtleBreeze {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(3px, -4px, 0);
          }
        }
        .breeze-wrap {
          animation-name: subtleBreeze;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
      {FLOWERS.map((item, index) => {
        const isType1 = item.type === 1;
        const src = isType1 ? "/flower 1-thumb.webp" : "/flower 2-thumb.webp";
        const fallbackSrc = isType1 ? "/flower 1.png" : "/flower 2.png";

        return (
          <div
            key={item.id}
            ref={(node) => {
              flowerRefs.current[index] = node;
            }}
            style={{
              top: `${item.topPct}%`,
              ...(item.leftPct !== undefined ? { left: `${item.leftPct}%` } : {}),
              ...(item.rightPct !== undefined ? { right: `${item.rightPct}%` } : {}),
              willChange: "transform",
              transform: `translate3d(0, 0, 0) rotate(${item.baseRotation}deg)`,
            }}
            className="absolute transition-transform duration-75 ease-out"
          >
            <div
              className="breeze-wrap"
              style={{
                animationDuration: item.floatDuration,
                animationDelay: item.floatDelay,
              }}
            >
              <div
                className="relative aspect-square transition-all duration-300 filter drop-shadow-[0_4px_12px_rgba(43,24,16,0.14)] drop-shadow-[0_1px_3px_rgba(43,24,16,0.08)] opacity-90 hover:opacity-100"
                style={{
                  width: `clamp(${item.sizeMobile}px, 5.5vw, ${item.sizeDesktop}px)`,
                  height: `clamp(${item.sizeMobile}px, 5.5vw, ${item.sizeDesktop}px)`,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 48px, 76px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
