"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { wedding } from "@/config/wedding";
import { WeddingFooter } from "./WeddingFooter";

export function RSVPSection() {
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
      // Attempt to post to /api/rsvp endpoint
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Fallback gracefully if server endpoint is running client-only
      });

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
      setErrorMessage("We could not record your RSVP at this moment. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      data-reveal
      className="reveal-section scroll-mt-24 relative pt-32 sm:pt-40 md:pt-48 lg:pt-56 pb-0 flex flex-col overflow-hidden bg-[#FAF5EE]"
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
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 mb-16 sm:mb-24">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.26em] font-bold text-xs mb-1.5">
            Join Our Celebration
          </p>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl text-[#2B1810]">
            RSVP &amp; Leave a Wish
          </h2>
          <div className="h-px w-14 bg-[#8C6A3B]/40 mx-auto mt-3.5 mb-3.5" />
        </div>

        {/* White stationery card */}
        <div className="relative max-w-2xl lg:max-w-3xl w-full mx-auto bg-white rounded-lg border border-[#E7DDCB] p-8 sm:p-11 md:p-14 shadow-[0_30px_70px_-22px_rgba(43,24,16,0.22),0_14px_32px_-16px_rgba(43,24,16,0.12),0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden">
          
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
                    RSVP
                  </h3>
                  <p className="mt-2.5 font-editorial-serif italic text-base sm:text-lg text-[#8C6A3B]">
                    Received
                  </p>
                </div>
                <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#1E140E]">
                  Thank You, {submittedData.name}!
                </h3>
                <p className="font-editorial-serif italic text-base text-[#5A4F46] leading-relaxed max-w-lg">
                  {submittedData.response === "accept"
                    ? "Your attendance and message have been joyfully recorded. We cannot wait to celebrate with you!"
                    : "We have received your reply. Although you will be missed in person, we cherish your love, prayers, and message."}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className="px-6 py-2 rounded-full border border-[#2B1810] text-[#1E140E] hover:bg-[#1E140E] hover:text-[#FAF5EE] transition-all duration-300 font-sans text-xs uppercase tracking-[0.16em] font-medium cursor-pointer"
                  >
                    Edit Response
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-9">

                {/* Header: RSVP with reply-by note */}
                <div className="pb-6 sm:pb-7 border-b border-[#1E140E]/10">
                  <h3 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E140E] leading-none tracking-[0.04em]">
                    Make a Wish for the Couple
                  </h3>
                  <p className="mt-2.5 font-editorial-serif italic text-base sm:text-lg text-[#8C6A3B]">
                    Share your wish, then kindly reply by {wedding.rsvpDeadline || "4th October"}.
                  </p>
                </div>

                {/* Wishlist input */}
                <div>
                  <label
                    htmlFor="guest-secondary"
                    className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.24em] font-medium text-[#2B1810]"
                  >
                    Your Wish for the Couple <span className="text-[#8C6A3B]">*</span>
                  </label>
                  <textarea
                    id="guest-secondary"
                    rows={3}
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Share your love, prayer, or a note for the couple."
                    className="mt-2 w-full resize-none bg-transparent border-0 border-b border-[#1E140E]/25 focus:border-[#8C6A3B] text-[#1E140E] font-editorial-serif text-base sm:text-lg pb-1.5 placeholder:text-[#1E140E]/25 focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Interactive attendance choice */}
                <fieldset>
                  <legend className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.24em] font-semibold text-[#2B1810] mb-3.5">
                    Will you be joining us?
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                    {/* Accept */}
                    <label
                      className={`group relative flex items-center justify-between gap-3 rounded-xl border px-4 py-4 cursor-pointer select-none transition-all duration-300 ${
                        response === "accept"
                          ? "border-[#8C6A3B] bg-[#8C6A3B]/[0.06] shadow-[0_16px_32px_-20px_rgba(140,106,59,0.85)]"
                          : "border-[#1E140E]/12 bg-[#FCFAF6] hover:border-[#8C6A3B]/60 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(43,24,16,0.55)]"
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
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            response === "accept"
                              ? "border-[#8C6A3B] bg-[#8C6A3B] text-white"
                              : "border-[#1E140E]/15 bg-[#FAF7F1] text-[#8C6A3B] group-hover:border-[#8C6A3B]/50"
                          }`}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span className="font-editorial-serif text-base sm:text-lg text-[#1E140E] leading-tight">
                            Joyfully Accept
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8A7A6B]">
                            Count me in
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
                      className={`group relative flex items-center justify-between gap-3 rounded-xl border px-4 py-4 cursor-pointer select-none transition-all duration-300 ${
                        response === "decline"
                          ? "border-[#8C6A3B] bg-[#8C6A3B]/[0.06] shadow-[0_16px_32px_-20px_rgba(140,106,59,0.85)]"
                          : "border-[#1E140E]/12 bg-[#FCFAF6] hover:border-[#8C6A3B]/60 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(43,24,16,0.55)]"
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
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            response === "decline"
                              ? "border-[#8C6A3B] bg-[#8C6A3B] text-white"
                              : "border-[#1E140E]/15 bg-[#FAF7F1] text-[#8C6A3B] group-hover:border-[#8C6A3B]/50"
                          }`}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M12 21s-6.5-4.35-9-8.5C1.2 9.1 3 5 7 5c2 0 3.2 1.2 4 2.2C11.8 6.2 13 5 15 5c4 0 5.8 4.1 4 7.5-2.5 4.15-9 8.5-9 8.5Z" />
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span className="font-editorial-serif text-base sm:text-lg text-[#1E140E] leading-tight">
                            Regretfully Decline
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8A7A6B]">
                            Sending love
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
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.24em] font-medium text-[#2B1810]"
                    >
                      Full Name
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-2 w-full bg-transparent border-0 border-b border-[#1E140E]/25 focus:border-[#8C6A3B] text-[#1E140E] font-editorial-serif text-base sm:text-lg pb-1.5 placeholder:text-[#1E140E]/25 focus:outline-none transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Bottom Bar: Attending Count & Submit Button */}
                <div className="pt-6 sm:pt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#1E140E]/10">
                  {response === "accept" && (
                    <div className="flex items-center gap-2 text-xs font-editorial-serif italic text-[#6A5D54] animate-fadeIn">
                      <span>Attending party:</span>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="bg-transparent border-0 border-b border-[#1E140E]/40 text-[#1E140E] font-editorial-serif text-sm px-1 outline-none cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !note.trim()}
                    className="min-h-[46px] w-full sm:w-auto sm:min-w-[200px] sm:ml-auto px-8 py-3 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 bg-[#1E140E] text-[#FAF5EE] hover:bg-[#8C6A3B] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_14px_30px_-14px_rgba(43,24,16,0.6)] hover:shadow-[0_18px_36px_-14px_rgba(140,106,59,0.7)] inline-flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Sending..." : "Submit Reply"}</span>
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

      {/* Wedding Footer included at the bottom of the section */}
      <div className="relative z-10 w-full mt-auto">
        <WeddingFooter />
      </div>

    </section>
  );
}
