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
  const [copiedType, setCopiedType] = useState<"church" | "home" | null>(null);
  const [activeVenueTab, setActiveVenueTab] = useState<"church" | "home">("church");

  const copyAddress = async (type: "church" | "home", text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2500);
      }
    } catch {
      // ignore
    }
  };

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
      <div id="directions" className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20 scroll-mt-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E7DDCB] bg-white/90 p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(43,24,16,0.25)] backdrop-blur-sm">
          {/* Section Header */}
          <div className="text-center">
            <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.24em] font-bold text-xs mb-1.5">
              {isAmharic ? "አቅጣጫዎችና ቦታዎች" : "Getting There"}
            </p>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl text-[#2B1810] ${isAmharic ? "font-jegna-title" : "font-editorial-serif"}`}>
              {isAmharic ? "የቦታው አቅጣጫዎችና ካርታ" : "Event Locations & Directions"}
            </h3>
            <p className={`mt-2 text-xs sm:text-sm text-[#6A5D54] max-w-md mx-auto ${isAmharic ? "font-balderasu" : "font-sans font-light"}`}>
              {isAmharic
                ? "ወደ ቤተክርስቲያን እና ወደ ቤታችን የሚወስዱትን ትክክለኛ አቅጣጫዎች በካርታ ይመልከቱ ወይም አድራሻውን ይቅዱ።"
                : "View live map navigation or copy the exact venue addresses for church ceremony and home reception."}
            </p>
          </div>

          {/* Interactive Mobile Tabs (visible if withHome) */}
          {withHome && (
            <div className="mt-6 flex sm:hidden items-center justify-center p-1 rounded-xl bg-[#F4EFE6] border border-[#E5DAC8]">
              <button
                type="button"
                onClick={() => setActiveVenueTab("church")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeVenueTab === "church"
                    ? "bg-[#2B1810] text-[#FAF6F0] shadow-xs"
                    : "text-[#6A5D54] hover:text-[#2B1810]"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 2v4M10 4h4" />
                    <path d="M12 6L4 12v9h16v-9z" />
                    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
                  </svg>
                  <span>{isAmharic ? "ሀልዎት አማኑኤል (9:00)" : "Halwot Emmanuel (9:00)"}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveVenueTab("home")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeVenueTab === "home"
                    ? "bg-[#2B1810] text-[#FAF6F0] shadow-xs"
                    : "text-[#6A5D54] hover:text-[#2B1810]"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>{isAmharic ? "ቤት (4:30)" : "Home (4:30)"}</span>
                </span>
              </button>
            </div>
          )}

          {/* Venue Cards Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Church Card */}
            <div
              className={`flex flex-col justify-between rounded-2xl border border-[#E1D3C2] bg-[#FCFAF6] p-5 sm:p-6 transition-all hover:border-[#8C6A3B]/60 hover:shadow-md ${
                withHome && activeVenueTab !== "church" ? "hidden sm:flex" : "flex"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE5D5] text-[#8C6A3B] shadow-inner">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                        <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z" />
                        <circle cx="12" cy="11" r="2.2" />
                      </svg>
                    </span>
                    <div>
                      <span className="inline-block rounded-full bg-[#8C6A3B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B]">
                        {isAmharic ? "ከጠዋቱ 9:00 ሰዓት" : "9:00 Local Time"}
                      </span>
                      <h4 className={`mt-1 font-semibold text-base sm:text-lg text-[#2B1810] ${isAmharic ? "amharic-title" : "font-editorial-serif"}`}>
                        {isAmharic ? "ሀልዎት አማኑኤል አጥቢያ ቤተክርስቲያን" : "Halwot Emmanuel Church"}
                      </h4>
                    </div>
                  </div>
                </div>


              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-[#EFE5D5]/80">
                <a
                  href={mapsLink(wedding.locations.church.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B1810] px-4 py-2.5 text-xs font-semibold text-[#FAF6F0] hover:bg-[#8C6A3B] transition-colors shadow-xs active:scale-98"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ አቅጣጫ ክፈት" : "Open in Google Maps"}</span>
                </a>

                <button
                  type="button"
                  onClick={() => copyAddress("church", isAmharic ? "ሀልዎት አማኑኤል አጥቢያ ቤተክርስቲያን፣ አዲስ አበባ" : wedding.locations.church.address)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D5C6B5] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2B1810] hover:bg-[#F7F2EB] hover:border-[#8C6A3B] transition-colors active:scale-98"
                >
                  {copiedType === "church" ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className={`text-emerald-700 ${isAmharic ? "font-benaiah text-sm" : ""}`}>{isAmharic ? "ተቀድቷል!" : "Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "አድራሻ ቅዳ" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Home Card (when withHome) */}
            {withHome && (
              <div
                className={`flex flex-col justify-between rounded-2xl border border-[#E1D3C2] bg-[#FCFAF6] p-5 sm:p-6 transition-all hover:border-[#8C6A3B]/60 hover:shadow-md ${
                  activeVenueTab !== "home" ? "hidden sm:flex" : "flex"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE5D5] text-[#8C6A3B] shadow-inner">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                          <path d="M3 11 12 4l9 7" />
                          <path d="M5 10v10h14V10M9 20v-6h6v6" />
                        </svg>
                      </span>
                      <div>
                        <span className="inline-block rounded-full bg-[#8C6A3B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B]">
                          {isAmharic ? "ከቀኑ 4:30 ሰዓት" : "4:30 PM"}
                        </span>
                        <h4 className={`mt-1 font-semibold text-base sm:text-lg text-[#2B1810] ${isAmharic ? "amharic-title" : "font-editorial-serif"}`}>
                          {isAmharic ? "የቤት አቀባበልና ደስታ" : "Home Reception"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-[#EFE5D5]/80">
                  <a
                    href={mapsLink(wedding.locations.home.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B1810] px-4 py-2.5 text-xs font-semibold text-[#FAF6F0] hover:bg-[#8C6A3B] transition-colors shadow-xs active:scale-98"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ አቅጣጫ ክፈት" : "Open in Google Maps"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyAddress("home", isAmharic ? "የሙሽሮች ቤት አቀባበል ቦታ፣ አዲስ አበባ" : wedding.locations.home.address)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D5C6B5] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2B1810] hover:bg-[#F7F2EB] hover:border-[#8C6A3B] transition-colors active:scale-98"
                  >
                    {copiedType === "home" ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                        <span className={`text-emerald-700 ${isAmharic ? "font-benaiah text-sm" : ""}`}>{isAmharic ? "ተቀድቷል!" : "Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "አድራሻ ቅዳ" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Helpful Rideshare / Transport Note */}
          <div className="mt-6 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] p-3 sm:p-3.5 flex items-center gap-2.5 text-left">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8C6A3B]/15 text-[#8C6A3B]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3.3C2 11.4 2 11.7 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </span>
            <p className={`text-[11px] sm:text-xs text-[#6A5D54] leading-relaxed ${isAmharic ? "font-benaiah text-xs sm:text-sm" : ""}`}>

              {isAmharic
                ? "ጠቃሚ ምክር፦ ለ RIDE፣ Feres ወይም ታክሲ ለመጠቀም «አድራሻ ቅዳ» የሚለውን ይጫኑና በቀላሉ ይለጥፉት።"
                : "Helpful tip: Tap \"Copy\" to easily paste the exact address into RIDE, Feres, or navigation apps."}
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
