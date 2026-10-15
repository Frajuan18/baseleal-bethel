import Image from "next/image";
import { coupleName, formatFullWeddingDate, wedding } from "@/config/wedding";

export function InvitationSection() {
  const formattedDate = formatFullWeddingDate(wedding.date);

  return (
    <section id="invitation" className="relative py-20 sm:py-28 lg:py-36 bg-[#F8F4ED]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="eyebrow text-[#B18A54] mb-3">Our Covenant</p>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#422B20] tracking-tight">
            A Day to Hold Close
          </h2>
          <div className="h-px w-16 bg-[#B18A54] mx-auto mt-6 mb-6" />
          <p className="text-sm sm:text-base text-[#857365] leading-relaxed font-sans">
            We invite you to share in the prayers, vows, and unforgettable moments as we join our lives together in the presence of God and our cherished loved ones.
          </p>
        </div>

        {/* Editorial Layout: Left Narrative & Right Luxury Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Intimate Narrative & Detail Photo */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#EEE5D9] shadow-md border border-[#DED2C2]">
              <Image
                src={wedding.images.invitationCard}
                alt="Fine art wedding details and rings"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover object-center filter saturate-[0.9] hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810]/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-[#F8F4ED]">
                <p className="eyebrow text-[#C9A46E] text-[10px]">
                  Faith &amp; Devotion
                </p>
                <p className="font-editorial-serif text-xl italic mt-1">
                  “Two are better than one, because they have a good return for their labor.”
                </p>
              </div>
            </div>

            <div className="border-l-2 border-[#B18A54] pl-5 space-y-2">
              <h3 className="font-editorial-serif text-2xl text-[#422B20]">
                A Celebration of Grace
              </h3>
              <p className="text-sm text-[#857365] leading-relaxed">
                From our first conversation to this sacred milestone, we have experienced God&apos;s guidance at every step. Having you stand beside us as we exchange vows will be our greatest honour.
              </p>
            </div>
          </div>

          {/* Right Column: Centered Luxury Invitation Card */}
          <div className="lg:col-span-7">
            <article className="relative bg-[#EEE5D9]/70 border border-[#DED2C2] p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(66,43,32,0.06)] rounded-sm text-center">
              
              {/* Corner Ornamental Accents */}
              <span className="absolute top-4 left-4 text-[#B18A54] text-sm select-none" aria-hidden>✦</span>
              <span className="absolute top-4 right-4 text-[#B18A54] text-sm select-none" aria-hidden>✦</span>
              <span className="absolute bottom-4 left-4 text-[#B18A54] text-sm select-none" aria-hidden>✦</span>
              <span className="absolute bottom-4 right-4 text-[#B18A54] text-sm select-none" aria-hidden>✦</span>

              {/* Inner Decorative Inset Border */}
              <div className="border border-[#DED2C2]/80 p-6 sm:p-10 md:p-12">
                
                {/* Monogram Badge */}
                <div className="w-12 h-12 mx-auto rounded-full border border-[#B18A54]/50 flex items-center justify-center text-[#B18A54] font-editorial-serif text-lg italic mb-6">
                  {wedding.couple.monogram}
                </div>

                <p className="eyebrow text-[#857365]">
                  You Are Cordially Invited
                </p>

                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#857365]/80 font-medium">
                  To celebrate the marriage of
                </p>

                <h3 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#422B20] my-5 leading-[0.95] tracking-tight">
                  {wedding.couple.first}
                  <span className="block text-3xl sm:text-4xl text-[#B18A54] italic font-light my-1">
                    &amp;
                  </span>
                  {wedding.couple.second}
                </h3>

                <p className="max-w-md mx-auto text-sm leading-relaxed text-[#857365] mt-6 mb-8 font-light">
                  {wedding.invitationNote.message}
                </p>

                <div className="h-px w-20 bg-[#B18A54]/40 mx-auto mb-8" />

                {/* Event Key Facts Grid */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-[#DED2C2] text-left sm:text-center">
                  <div>
                    <dt className="eyebrow text-[#B18A54] mb-1.5">Date</dt>
                    <dd className="font-editorial-serif text-lg text-[#422B20] leading-snug">
                      {formattedDate}
                    </dd>
                  </div>

                  <div>
                    <dt className="eyebrow text-[#B18A54] mb-1.5">Time</dt>
                    <dd className="font-editorial-serif text-lg text-[#422B20] leading-snug">
                      {wedding.time ? `${wedding.time} Local Time` : wedding.timeDisplay}
                    </dd>
                  </div>

                  <div>
                    <dt className="eyebrow text-[#B18A54] mb-1.5">Place</dt>
                    <dd className="font-editorial-serif text-lg text-[#422B20] leading-snug">
                      {wedding.venue}
                      <span className="block text-xs font-sans text-[#857365] mt-0.5">
                        {wedding.city}
                      </span>
                    </dd>
                  </div>
                </dl>

                {/* Bible Verse Scripture Blessing */}
                <div className="mt-8 pt-2">
                  <blockquote className="font-editorial-serif text-base sm:text-lg italic text-[#422B20]/90 max-w-lg mx-auto">
                    {wedding.scripture.verse}
                  </blockquote>
                  <cite className="block mt-2 text-[10px] uppercase tracking-[0.2em] text-[#B18A54] not-italic font-medium">
                    {wedding.scripture.reference}
                  </cite>
                </div>

                <div className="mt-10">
                  <a href="#rsvp" className="btn-editorial">
                    <span>Respond to Invitation</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>

              </div>
            </article>
          </div>

        </div>
      </div>
    </section>
  );
}
