import Link from "next/link";

export default function Footer() {
  return (
    <footer id="enquiries" className="relative w-full bg-[#FAF8F5] pt-20 sm:pt-28 lg:pt-36 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Enquiries Section */}
        <div className="text-center mb-28 sm:mb-36 lg:mb-44">
          <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-[#8C887E] font-sans font-medium mb-8">
            03 &mdash; Enquiries
          </span>

          <h2 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6.25rem] text-[#1C2822] font-normal tracking-[-0.015em] mb-6">
            Let us begin.
          </h2>

          <a
            href="mailto:hello@ameliaross.studio"
            className="inline-block font-serif italic text-2xl sm:text-3xl lg:text-[2.2rem] text-[#1C2822] hover:opacity-70 transition-opacity duration-300"
          >
            hello@ameliaross.studio
          </a>
        </div>

        {/* Hairline Divider Line */}
        <div className="border-t border-[#E2DED5] pt-10 sm:pt-12">
          {/* Bottom Attribution Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            {/* Left: Brand Signature */}
            <Link
              href="/"
              className="font-serif italic text-lg sm:text-xl text-[#1C2822] hover:opacity-85 transition-opacity"
            >
              Amelia Ross
            </Link>

            {/* Center: Practice Description */}
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#8C887E] font-sans font-medium">
              Wedding Direction &middot; By Appointment
            </p>

            {/* Right: Copyright */}
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#8C887E] font-sans font-medium">
              &copy; 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
