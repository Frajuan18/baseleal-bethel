import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#FAF8F5] pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline and Description */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            <h1 className="font-serif text-[#1C2822] text-6xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6.25rem] leading-[1.03] tracking-[-0.015em] font-normal">
              Quiet
              <br />
              <span className="italic font-normal">luxury,</span>
              <br />
              composed.
            </h1>

            <p className="mt-8 lg:mt-12 text-[#676B63] text-sm sm:text-base leading-relaxed max-w-md font-light font-sans tracking-normal">
              Bespoke celebrations for the discerning few &mdash; where
              architecture, light and restraint become the language of a single,
              unrepeatable day.
            </p>
          </div>

          {/* Right Column: Featured Architectural Villa Image */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] lg:max-w-none aspect-[4/5] overflow-hidden bg-[#EAE6DD]">
              <Image
                src="/images/hero-villa.jpg"
                alt="Classical European villa entrance with olive tree and arched doors"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
