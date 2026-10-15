import { coupleName, formatWeddingDate, wedding } from "@/config/wedding";

export function WeddingFooter() {
  const formattedDate = formatWeddingDate(wedding.date);

  return (
    <footer className="relative bg-[#F8F4ED] text-[#422B20] border-t border-[#DED2C2] overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* Top Centered Section */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <div className="w-10 h-10 mx-auto rounded-full border border-[#B18A54]/40 flex items-center justify-center text-[#B18A54] text-xs font-editorial-serif italic mb-4">
            {wedding.couple.monogram}
          </div>
          
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#422B20] italic">
            {coupleName}
          </h2>

          <p className="mt-3 text-sm text-[#857365] font-light leading-relaxed">
            With grateful hearts, we look forward to celebrating the sacred beginning of our marriage with you.
          </p>

          {formattedDate && (
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#B18A54] font-semibold">
              {formattedDate} • {wedding.city}
            </p>
          )}

          {/* Navigation Anchor Links */}
          <nav
            className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#857365]"
            aria-label="Footer Navigation"
          >
            <a href="#top" className="hover:text-[#B18A54] transition-colors">
              Top
            </a>
            <a href="#invitation" className="hover:text-[#B18A54] transition-colors">
              Invitation
            </a>
            <a href="#date" className="hover:text-[#B18A54] transition-colors">
              The Date
            </a>
            <a href="#countdown" className="hover:text-[#B18A54] transition-colors">
              Countdown
            </a>
            <a href="#moments" className="hover:text-[#B18A54] transition-colors">
              Moments
            </a>
            <a href="#wishes" className="hover:text-[#B18A54] transition-colors">
              Wishes
            </a>
            <a href="#rsvp" className="hover:text-[#B18A54] transition-colors">
              RSVP
            </a>
          </nav>
        </div>

        {/* Decorative Divider */}
        <div className="h-px w-full bg-[#DED2C2] my-8" />

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
            <span>Made with love</span>
            <span className="text-[#B18A54]">✦</span>
            <span>Solas Dei Gloria</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
