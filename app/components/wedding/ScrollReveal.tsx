"use client";

import { useEffect } from "react";

/**
 * Adds gentle upward-fade reveals to sections marked with `data-reveal`.
 * The hidden state is only applied once JS adds `.js-reveal` to <html>, so
 * content stays fully visible when scripting is unavailable.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) return;

    root.classList.add("js-reveal");

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (targets.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
