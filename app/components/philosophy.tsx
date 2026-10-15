import Image from "next/image";

export default function Philosophy() {
  return (
    <section id="work" className="relative w-full bg-[#FAF8F5] pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-[#8C887E] font-sans font-medium">
              01 &mdash; Philosophy
            </span>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] leading-[1.3] text-[#1C2822] font-normal max-w-3xl">
              We reject the ordinary. No formula, no repetition &mdash; only
              weddings shaped by{" "}
              <span className="italic font-normal">intention</span>, held in{" "}
              <span className="italic font-normal">stillness</span>, and
              finished with the eye of an editor.
            </h2>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Bridal Gown by Window */}
          <div className="md:col-span-5 flex flex-col">
            <div className="relative w-full aspect-[3/5] overflow-hidden bg-[#EAE6DD]">
              <Image
                src="/images/dress-morning.jpg"
                alt="Bridal gown hanging in morning light at Villa Aurea"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
            <p className="mt-4 text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-[#8C887E] font-sans font-medium">
              The morning of &middot; Villa Aurea
            </p>
          </div>

          {/* Right: The Table Composition */}
          <div className="md:col-span-7 flex flex-col">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EAE6DD]">
              <Image
                src="/images/table-detail.jpg"
                alt="Editorial tablescape with candles, olive foliage and fine ceramics"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-serif italic text-base md:text-lg text-[#1C2822]">
                The Table
              </span>
              <span className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#8C887E] font-sans font-medium">
                Composition &middot; Detail
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
