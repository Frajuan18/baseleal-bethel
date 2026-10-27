"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useWeddingLanguage } from "./LanguageContext";
import { useInvitation } from "./InvitationContext";
import { wedding } from "@/config/wedding";

function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function RSVPSection() {
  const { isAmharic } = useWeddingLanguage();
  const { invitation, hasToken, token } = useInvitation();
  const withHome = !hasToken || invitation?.invitationType === "CHURCH_AND_HOME";
  const [response, setResponse] = useState<"accept" | "decline">("accept");
  const [name, setName] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    response: "accept" | "decline";
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: name.trim(),
      response,
      guestCount: response === "accept" ? parseInt(guestCount, 10) : 0,
      note: note.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      // Personalized links record against the invitation; everyone else uses the public endpoint.
      if (token) {
        await fetch(`/api/public/invitations/${encodeURIComponent(token)}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            attendance: response === "accept" ? "ATTENDING" : "NOT_ATTENDING",
            churchAttendance: response === "accept",
            homeAttendance: response === "accept" && withHome,
            attendeeCount: response === "accept" ? parseInt(guestCount, 10) : 0,
            wish: note.trim(),
          }),
        }).catch(() => {
          // Fallback gracefully if server endpoint is running client-only
        });
      } else {
        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {
          // Fallback gracefully if server endpoint is running client-only
        });
      }

      // Save locally to localStorage
      try {
        const stored = localStorage.getItem("bb_wedding_rsvps") || "[]";
        const rsvps = JSON.parse(stored);
        rsvps.push(payload);
        localStorage.setItem("bb_wedding_rsvps", JSON.stringify(rsvps));
      } catch {
        // Ignore local storage error
      }

      setSubmittedData({
        name: name.trim(),
        response,
      });
    } catch {
      setErrorMessage(isAmharic ? "RSVP ማስተናገድ አልተቻለም። እባክዎ ግንኙነትዎን ያረጋግጡ እና እንደገና ይሞክሩ።" : "We could not record your RSVP at this moment. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      data-reveal
      data-language={isAmharic ? "am" : "en"}
      className="reveal-section amharic-section scroll-mt-24 relative min-h-[100svh] lg:min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-0 flex flex-col overflow-hidden bg-[#FAF5EE]"
    >
      {/* Background Image: rsvp bg1.jpg covering both RSVP section and the embedded footer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/rsvp bg1.jpg"
          alt="RSVP Background with delicate floral accents"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Subtle Warm Linen Vignette to keep edges soft and luxurious */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF5EE]/15 via-transparent to-[#FAF5EE]/20 select-none z-1"
        aria-hidden
      />

      {/* Main Upper Content: Heading + Card */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 mb-8 sm:mb-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.26em] font-bold text-xs mb-1.5">
            {isAmharic ? "የደስታችን ተካፋይ ይሁኑ" : "Join Our Celebration"}
          </p>
          <h2 className={`${isAmharic ? "amharic-title text-3xl sm:text-4xl md:text-5xl" : "font-editorial-serif text-2xl sm:text-3xl md:text-4xl"} text-[#2B1810]`}>
            {isAmharic ? "ምኞቶን ያስቀምጡ" : "RSVP & Leave a Wish"}
          </h2>
          <div className="h-px w-14 bg-[#8C6A3B]/40 mx-auto mt-3.5 mb-3.5" />
        </div>

        {/* White stationery card */}
        <div className="relative max-w-lg lg:max-w-xl w-full mx-auto bg-white rounded-lg border border-[#E7DDCB] p-5 sm:p-6 md:p-7 shadow-[0_24px_56px_-22px_rgba(43,24,16,0.22),0_12px_26px_-16px_rgba(43,24,16,0.12)] overflow-hidden">
          
          {/* Embossed hairline inner frame */}
          <div
            className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-[6px] border border-[#D8CBB2]/70 select-none z-0"
            aria-hidden
          />

          {/* Tactile cotton paper grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply select-none z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardPaperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardPaperNoise)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
            aria-hidden
          />

          <div className="relative z-10">
            {submittedData ? (
              /* Warm success confirmation matching stationery tone */
              <div className="py-6 sm:py-8 space-y-4 animate-fadeIn">
                <div className="mb-6">
                  <h3 className="font-editorial-serif text-3xl sm:text-4xl text-[#1E140E] leading-none tracking-[0.04em]">
                    {isAmharic ? "RSVP" : "RSVP"}
                  </h3>
                  <p className="mt-2.5 font-editorial-serif italic text-base sm:text-lg text-[#8C6A3B]">
                    {isAmharic ? "ደርሶናል" : "Received"}
                  </p>
                </div>
                <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#1E140E]">
                  {isAmharic ? `እናመሰግናለን፣ ${submittedData.name}!` : `Thank You, ${submittedData.name}!`}
                </h3>
                <p className="font-editorial-serif italic text-base text-[#5A4F46] leading-relaxed max-w-lg">
                  {submittedData.response === "accept"
                    ? (isAmharic ? "መገኘታችሁና መልዕክታችሁ በደስታ ተመዝግቧል። ከእናንተ ጋር ለመደሰት እንጓጓለን!" : "Your attendance and message have been joyfully recorded. We cannot wait to celebrate with you!")
                    : (isAmharic ? "መልሳችሁ ደርሶናል። በአካል ባትገኙም ፍቅራችሁን፣ ጸሎታችሁን እና መልዕክታችሁን እናከብራለን።" : "We have received your reply. Although you will be missed in person, we cherish your love, prayers, and message.")}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className="px-6 py-2 rounded-full border border-[#2B1810] text-[#1E140E] hover:bg-[#1E140E] hover:text-[#FAF5EE] transition-all duration-300 font-sans text-xs uppercase tracking-[0.16em] font-medium cursor-pointer"
                  >
                    {isAmharic ? "መልሱን ያስተካክሉ" : "Edit Response"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                {/* Wishlist input */}
                <div className="rounded-md transition-transform duration-300 focus-within:-translate-y-0.5">
                  <label
                    htmlFor="guest-secondary"
                    className={`${isAmharic ? "font-benaiah" : "font-sans"} block text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium text-[#2B1810]`}
                  >
                    {isAmharic ? "ለጥንዶቹ ያለዎት ምኞት" : "Your Wish for the Couple"} <span className="text-[#8C6A3B]">*</span>
                  </label>
                  <textarea
                    id="guest-secondary"
                    rows={2}
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={isAmharic ? "ፍቅርዎን፣ ጸሎትዎን ወይም ለጥንዶቹ መልዕክት ያካፍሉ።" : "Share your love, prayer, or a note for the couple."}
                    className="mt-2 w-full resize-none bg-transparent border-0 border-b border-[#1E140E]/25 focus:border-[#8C6A3B] text-[#1E140E] font-editorial-serif text-base sm:text-lg pb-1.5 placeholder:text-[#1E140E]/25 focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Interactive attendance choice */}
                <fieldset>
                  <legend className={`${isAmharic ? "font-benaiah" : "font-sans"} block text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold text-[#2B1810] mb-3.5`}>
                    {isAmharic ? "ከእኛ ጋር ይገኛሉ?" : "Will you be joining us?"}
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                    {/* Accept */}
                    <label
                      className={`group relative flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 cursor-pointer select-none transition-all duration-300 ${
                        response === "accept"
                          ? "border-[#8C6A3B] bg-[#8C6A3B]/[0.06] shadow-[0_16px_32px_-20px_rgba(140,106,59,0.85)]"
                        : "border-[#1E140E]/12 bg-[#FCFAF6] hover:border-[#8C6A3B]/60 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(43,24,16,0.55)] active:scale-[0.99]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="accept"
                        checked={response === "accept"}
                        onChange={() => setResponse("accept")}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-3.5">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            response === "accept"
                              ? "border-[#8C6A3B] bg-[#8C6A3B] text-white"
                              : "border-[#1E140E]/15 bg-[#FAF7F1] text-[#8C6A3B] group-hover:border-[#8C6A3B]/50"
                          }`}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span className="font-editorial-serif text-base sm:text-lg text-[#1E140E] leading-tight">
                            {isAmharic ? "በደስታ እገኛለሁ" : "Joyfully Accept"}
                          </span>
                        </span>
                      </span>
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8C6A3B] text-white transition-all duration-300 ${
                          response === "accept" ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    </label>

                    {/* Decline */}
                    <label
                      className={`group relative flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 cursor-pointer select-none transition-all duration-300 ${
                        response === "decline"
                          ? "border-[#8C6A3B] bg-[#8C6A3B]/[0.06] shadow-[0_16px_32px_-20px_rgba(140,106,59,0.85)]"
                        : "border-[#1E140E]/12 bg-[#FCFAF6] hover:border-[#8C6A3B]/60 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(43,24,16,0.55)] active:scale-[0.99]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="decline"
                        checked={response === "decline"}
                        onChange={() => setResponse("decline")}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-3.5">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            response === "decline"
                              ? "border-[#8C6A3B] bg-[#8C6A3B] text-white"
                              : "border-[#1E140E]/15 bg-[#FAF7F1] text-[#8C6A3B] group-hover:border-[#8C6A3B]/50"
                          }`}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M12 21s-6.5-4.35-9-8.5C1.2 9.1 3 5 7 5c2 0 3.2 1.2 4 2.2C11.8 6.2 13 5 15 5c4 0 5.8 4.1 4 7.5-2.5 4.15-9 8.5-9 8.5Z" />
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span className="font-editorial-serif text-base sm:text-lg text-[#1E140E] leading-tight">
                            {isAmharic ? "መገኘት አልችልም" : "Regretfully Decline"}
                          </span>
                        </span>
                      </span>
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8C6A3B] text-white transition-all duration-300 ${
                          response === "decline" ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    </label>

                  </div>
                </fieldset>

                {/* Guest details */}
                <div>
                  <div className="rounded-md transition-transform duration-300 focus-within:-translate-y-0.5">
                    <label
                      htmlFor="guest-name"
                      className={`${isAmharic ? "font-benaiah" : "font-sans"} block text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium text-[#2B1810]`}
                    >
                      {isAmharic ? "ሙሉ ስም" : "Full Name"}
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAmharic ? "ስምዎ" : "Your name"}
                      className="mt-2 w-full bg-transparent border-0 border-b border-[#1E140E]/25 focus:border-[#8C6A3B] text-[#1E140E] font-editorial-serif text-base sm:text-lg pb-1.5 placeholder:text-[#1E140E]/25 focus:outline-none transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Bottom Bar: Attending Count & Submit Button */}
                <div className="pt-4 sm:pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#1E140E]/10">
                  {response === "accept" && (
                    <div className="flex items-center gap-2 text-xs font-editorial-serif italic text-[#6A5D54] animate-fadeIn">
                      <span className={isAmharic ? "font-benaiah" : ""}>{isAmharic ? "የሚገኙ እንግዶች:" : "Attending party:"}</span>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="bg-transparent border-0 border-b border-[#1E140E]/40 text-[#1E140E] font-editorial-serif text-sm px-1 outline-none cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <option value="1">1 {isAmharic ? "እንግዳ" : "Guest"}</option>
                        <option value="2">2 {isAmharic ? "እንግዶች" : "Guests"}</option>
                        <option value="3">3 {isAmharic ? "እንግዶች" : "Guests"}</option>
                        <option value="4">4 {isAmharic ? "እንግዶች" : "Guests"}</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !note.trim()}
                    className="min-h-[46px] w-full sm:w-auto sm:min-w-[200px] sm:ml-auto px-8 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 bg-[#1E140E] text-[#FAF5EE] hover:bg-[#8C6A3B] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_14px_30px_-14px_rgba(43,24,16,0.6)] hover:shadow-[0_18px_36px_-14px_rgba(140,106,59,0.7)] inline-flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? (isAmharic ? "በመላክ ላይ..." : "Sending...") : (isAmharic ? "መልስ ላክ" : "Submit Reply")}</span>
                    <span aria-hidden>→</span>
                  </button>
                </div>

                {errorMessage && (
                  <div role="alert" className="p-3 border border-red-500/40 bg-red-50 text-red-800 text-xs text-center rounded-md font-sans">
                    {errorMessage}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Directions — customized for personalized invitation links */}
      <div id="directions" className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 pb-12 sm:pb-16 scroll-mt-24">
        <div className="mx-auto max-w-lg lg:max-w-xl rounded-2xl border border-[#E7DDCB] bg-white/85 p-5 sm:p-6 shadow-[0_18px_40px_-24px_rgba(43,24,16,0.35)]">
          <div className="text-center">
            <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.26em] font-bold text-xs mb-1.5">Getting There</p>
            <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#2B1810]">Directions</h3>
          </div>
          <div className={`mt-5 grid gap-3 ${withHome ? "sm:grid-cols-2" : ""}`}>
            <a
              href={mapsLink(wedding.locations.church.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[64px] items-center gap-3 rounded-xl border border-[#E1D3C2] bg-[#FCFAF6] px-4 py-3 transition hover:border-[#8C6A3B] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#8C6A3B]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE5D5] text-[#8C6A3B]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                  <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z" />
                  <circle cx="12" cy="11" r="2.2" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-[#2B1810]">Check address of church</span>
                <span className="mt-0.5 block truncate text-xs text-[#6A5D54]">{wedding.locations.church.address}</span>
              </span>
            </a>

            {withHome && (
              <a
                href={mapsLink(wedding.locations.home.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[64px] items-center gap-3 rounded-xl border border-[#E1D3C2] bg-[#FCFAF6] px-4 py-3 transition hover:border-[#8C6A3B] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#8C6A3B]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE5D5] text-[#8C6A3B]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                    <path d="M3 11 12 4l9 7" />
                    <path d="M5 10v10h14V10M9 20v-6h6v6" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-[#2B1810]">Check address of home</span>
                  <span className="mt-0.5 block truncate text-xs text-[#6A5D54]">{wedding.locations.home.address}</span>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
