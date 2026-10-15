import Image from "next/image";

export default function Studio() {
  return (
    <section className="relative w-full bg-[#39493A] text-[#F4F1EA] overflow-hidden my-12 lg:my-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Atmospheric Colonnade Photography */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-[#2C3B2D]">
              <Image
                src="/images/bride-colonnade.jpg"
                alt="Bride walking along sunlit classical stone arcade"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Editorial Quote and Philosophy */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pl-6 xl:pl-10">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8EA093] font-sans font-medium mb-6 sm:mb-8 block">
              The Studio
            </span>

            <blockquote className="font-serif italic text-3xl sm:text-4xl lg:text-[2.65rem] text-[#FAF8F5] font-normal leading-[1.22] mb-8">
              &ldquo;I plan fewer weddings, so that each one may be
              extraordinary.&rdquo;
            </blockquote>

            <p className="font-sans text-xs sm:text-sm text-[#B3C0B7] font-light leading-relaxed max-w-lg mb-8 sm:mb-10">
              A limited number of celebrations each year, given undivided
              attention. From intimate ceremonies to grand estates, the pursuit
              is always the same &mdash; a day that feels entirely,
              effortlessly yours.
            </p>

            <div className="text-[11px] uppercase tracking-[0.25em] text-[#8EA093] font-sans font-medium">
              &mdash; Amelia Ross, Founder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
