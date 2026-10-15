import Image from "next/image";

export default function Approach() {
  return (
    <section id="approach" className="relative w-full bg-[#FAF8F5] pt-12 pb-24 sm:pt-20 sm:pb-32 lg:pt-28 lg:pb-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Upper Subsection: Venue & Architecture Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EAE6DD]">
              <Image
                src="/images/architecture-stair.jpg"
                alt="Architectural spiral staircase with dramatic light and shadow"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] text-[#1C2822] leading-[1.15] font-normal mb-6">
              Every venue tells
              <br />
              its own story.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#676B63] font-light leading-relaxed max-w-sm">
              We read the walls, the light and the hour &mdash; then let the
              celebration answer in kind.
            </p>
          </div>
        </div>

        {/* Lower Subsection: The Approach (02 - METHOD) */}
        <div className="mt-28 sm:mt-36 lg:mt-44">
          <div className="flex items-baseline justify-between mb-10 pb-2">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#1C2822] font-normal">
              The <span className="italic font-normal">approach</span>
            </h2>
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8C887E] font-sans font-medium">
              02 &mdash; Method
            </span>
          </div>

          {/* 3-column Method Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E2DED5] divide-y md:divide-y-0 md:divide-x divide-[#E2DED5]">
            {/* Step I */}
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col bg-[#FAF8F5]">
              <span className="font-serif italic text-[#9B7B4B] text-lg sm:text-xl mb-6">
                I
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-[#1C2822] font-normal mb-3">
                Discovery
              </h4>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-[#676B63] font-light">
                An unhurried conversation to understand the two of you, and the
                feeling the day must hold.
              </p>
            </div>

            {/* Step II */}
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col bg-[#FAF8F5]">
              <span className="font-serif italic text-[#9B7B4B] text-lg sm:text-xl mb-6">
                II
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-[#1C2822] font-normal mb-3">
                Direction
              </h4>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-[#676B63] font-light">
                A singular creative vision &mdash; palette, architecture and
                rhythm &mdash; edited without compromise.
              </p>
            </div>

            {/* Step III */}
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col bg-[#FAF8F5]">
              <span className="font-serif italic text-[#9B7B4B] text-lg sm:text-xl mb-6">
                III
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-[#1C2822] font-normal mb-3">
                Execution
              </h4>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-[#676B63] font-light">
                Every supplier, every minute, every detail conducted quietly, so
                you feel only the joy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
