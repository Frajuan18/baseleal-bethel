import { coupleName, wedding } from "@/config/wedding";
import { useWeddingLanguage } from "./LanguageContext";

export function WeddingFooter() {
  const { isAmharic } = useWeddingLanguage();
  return (
    <footer data-language={isAmharic ? "am" : "en"} className="amharic-section relative bg-transparent text-[#422B20] border-t border-[#DED2C2]/50 overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16 w-full z-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* Grand Signature Wordmark (Soulify-style from reference) */}
        <div className="text-center select-none py-4 sm:py-6 overflow-hidden">
          <span
            className="block font-editorial-serif text-[clamp(2.8rem,11vw,8.5rem)] text-[#422B20]/15 tracking-tight uppercase leading-none font-light"
            style={{
              WebkitTextStroke: "1px rgba(66, 43, 32, 0.35)",
              color: "transparent",
            }}
          >
            {wedding.couple.first} &amp; {wedding.couple.second}
          </span>
        </div>

        {/* Bottom Details & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-[#857365] pt-6 border-t border-[#DED2C2]/40">
          <p>© 2026 {coupleName}. All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            <span>{isAmharic ? "በፍቅር የተሰራ" : "Made with love"}</span>
            <span className="text-[#B18A54]">✦</span>
            <span>Solas Dei Gloria</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
