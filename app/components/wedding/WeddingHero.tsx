import Image from "next/image";

export function WeddingHero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-[#c6a276] text-[#fff9ed] lg:h-screen">
      <Image src="/hero.png" alt="" fill priority sizes="100vw" className="pointer-events-none -z-20 object-cover opacity-100" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(151,91,53,.96)_0%,rgba(190,137,88,.72)_46%,rgba(243,228,196,.12)_100%)] lg:bg-[linear-gradient(105deg,rgba(151,91,53,.96)_0%,rgba(175,123,78,.78)_38%,rgba(223,189,143,.25)_72%,rgba(243,228,196,.05)_100%)]" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 lg:h-full lg:grid-cols-[42%_58%]">
        <div className="relative z-10 flex flex-col justify-center px-8 pb-16 pt-20 sm:px-12 lg:px-12 xl:px-16">
          <h1 className="mb-6 flex flex-col gap-6 whitespace-nowrap font-brittany-signature font-normal text-[clamp(4.2rem,7vw,7rem)] leading-[1.12] tracking-normal text-[#fffdf5] [-webkit-text-stroke:0.2px_currentColor] sm:gap-7 lg:gap-10">
            <span className="block">Baseleal</span>
            <span className="block">&amp; Bethel</span>
          </h1>
          <p className="font-serif text-lg italic leading-snug text-[#fff6e3] sm:text-xl">Two hearts, one beautiful beginning.</p>
          <p className="mt-3 max-w-[390px] font-sans text-sm leading-[1.8] text-[#fff6e3]/90 sm:text-base">With grateful hearts, we invite you to celebrate the beginning of our forever. Your presence would make our special day even more meaningful.</p>
          <button className="mt-7 w-fit rounded-full bg-[#f4e5c9] px-7 py-4 font-sans text-xs font-semibold uppercase tracking-[.16em] text-[#8b6c4d] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80">You&apos;re Invited <span aria-hidden>↓</span></button>

        </div>

        <div className="relative min-h-[560px] lg:min-h-0">
          <div className="absolute bottom-[-12%] left-[-8%] h-[118%] w-[116%] sm:bottom-[-10%] sm:left-[-4%] sm:h-[112%] sm:w-[108%] lg:bottom-[-7%] lg:left-[0%] lg:h-[108%] lg:w-[84%]">
            <Image
              src="/hero main.png"
              alt="Baseleal and Bethel wedding portrait"
              fill
              priority
              sizes="(max-width: 1024px) 88vw, 48vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
