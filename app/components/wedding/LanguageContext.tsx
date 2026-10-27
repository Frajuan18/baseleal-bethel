"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type WeddingLanguage = "en" | "am";

const LanguageContext = createContext<{
  language: WeddingLanguage;
  isAmharic: boolean;
  toggleLanguage: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<WeddingLanguage>("am");
  const toggleLanguage = () => {
    setLanguage((value) => value === "en" ? "am" : "en");
    window.requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((section) => section.classList.add("is-visible"));
    });
  };

  return (
    <LanguageContext.Provider value={{ language, isAmharic: language === "am", toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useWeddingLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useWeddingLanguage must be used inside LanguageProvider");
  return context;
}
