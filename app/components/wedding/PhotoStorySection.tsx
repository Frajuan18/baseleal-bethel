import Image from "next/image";
import { wedding } from "@/config/wedding";

const moments = [
  {
    tag: "01 · The Covenant",
    title: "Rooted in Faith & Prayer",
    description:
      "Our union is built on Christ, mutual honour, and daily grace. We look forward to exchanging our vows before God and those we hold most dear.",
    image: wedding.images.galleryFirst,
    alt: "Celebration and joy during a wedding moment",
  },
  {
    tag: "02 · The Fellowship",
    title: "Surrounded by Love",
    description:
      "Every step toward this altar has been enriched by the wisdom of our parents, the prayers of our families, and the steadfast encouragement of lifelong friends.",
    image: wedding.images.gallerySecond,
    alt: "Elegantly styled table setting and intimate celebration atmosphere",
  },
  {
    tag: "03 · The Beginning",
    title: "A Lifelong Journey",
    description:
      "More than just a wedding day, we are celebrating the genesis of a shared home, shared purpose, and a lifetime devoted to blessing others.",
    image: wedding.images.galleryThird,
    alt: "Couple walking together hand-in-hand in natural light",
  },
];

export function PhotoStorySection() {
  return (
    <section id="moments" className="py-20 sm:py-28 lg:py-36 bg-[#F8F4ED]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-20 pb-6 border-b border-[#DED2C2]">
          <div>
            <p className="eyebrow text-[#B18A54] mb-3">Our Journey</p>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#422B20]">
              Moments of Grace &amp; Joy
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm sm:text-base text-[#857365] max-w-md font-sans leading-relaxed">
            A glimpse into the heart, prayers, and aspirations behind this unforgettable celebration.
          </p>
        </div>

        {/* 3-Column Editorial Photography Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {moments.map((item, index) => (
            <article
              key={index}
              className="group flex flex-col justify-between bg-[#EEE5D9]/40 border border-[#DED2C2] p-4 sm:p-5 rounded-sm hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Photo container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-[#2B1810] mb-5">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter saturate-[0.95]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810]/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Tag */}
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B18A54] font-semibold mb-2">
                  {item.tag}
                </p>

                {/* Title */}
                <h3 className="font-editorial-serif text-2xl text-[#422B20] mb-3 leading-snug group-hover:text-[#B18A54] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#857365] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              {/* Bottom decorative rule */}
              <div className="mt-6 pt-4 border-t border-[#DED2C2]/60 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#857365]">
                <span>{wedding.couple.title}</span>
                <span className="text-[#B18A54]">✦</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
