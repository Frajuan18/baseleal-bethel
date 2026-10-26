"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type WeddingLanguage = "en" | "am";

const LanguageContext = createContext<{
  language: WeddingLanguage;
  isAmharic: boolean;
  toggleLanguage: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<WeddingLanguage>("en");
  return (
    <LanguageContext.Provider value={{ language, isAmharic: language === "am", toggleLanguage: () => setLanguage((value) => value === "en" ? "am" : "en") }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useWeddingLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useWeddingLanguage must be used inside LanguageProvider");
  return context;
}
