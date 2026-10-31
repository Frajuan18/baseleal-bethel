"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { wedding, type VenueLocation } from "@/config/wedding";
import { useWeddingLanguage } from "./LanguageContext";
import { useInvitation } from "./InvitationContext";

type LocationsState = {
  church: VenueLocation;
  basselealHome: VenueLocation;
  bethelHome: VenueLocation;
};

export function RSVPSection() {
  const { isAmharic } = useWeddingLanguage();
  const { invitation, hasToken, token } = useInvitation();

  // Guest invitation permission checks
  const isChurchOnly = hasToken && invitation?.invitationType === "CHURCH_ONLY";
  const withBasseleal = !hasToken || ["CHURCH_AND_HOME", "CHURCH_AND_BOTH", "CHURCH_AND_BASSELEAL"].includes(invitation?.invitationType || "");
  const withBethel = !hasToken || ["CHURCH_AND_HOME", "CHURCH_AND_BOTH", "CHURCH_AND_BETHEL"].includes(invitation?.invitationType || "");

  const [activeLocations, setActiveLocations] = useState<LocationsState>({
    church: wedding.locations.church,
    basselealHome: wedding.locations.basselealHome,
    bethelHome: wedding.locations.bethelHome,
  });

  // Load live admin configured locations from public API
  useEffect(() => {
    fetch("/api/public/locations")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.locations) {
          setActiveLocations(data.locations);
        }
      })
      .catch(() => {
        // use default wedding.locations
      });
  }, []);

  const [response, setResponse] = useState<"accept" | "decline">("accept");
  const [name, setName] = useState("");

  // Auto-prefill guest name from invitation token or personalized link
  useEffect(() => {
    if (invitation?.guestName && !name) {
      setName(invitation.guestName);
    }
  }, [invitation?.guestName, name]);
  const [guestCount, setGuestCount] = useState("1");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    response: "accept" | "decline";
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"church" | "basseleal" | "bethel" | null>(null);
  const [activeVenueTab, setActiveVenueTab] = useState<"church" | "basseleal" | "bethel">("church");

  const copyAddress = async (type: "church" | "basseleal" | "bethel", text: string) => {
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
    if (!name.trim() || !note.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const isAttending = response === "accept";
    const partySize = isAttending ? Math.max(1, parseInt(guestCount, 10) || 1) : 0;
    const trimmedName = name.trim();
    const trimmedNote = note.trim();

    const payload = {
      name: trimmedName,
      fullName: trimmedName,
      response,
      attendance: isAttending ? "ATTENDING" : "NOT_ATTENDING",
      attendanceStatus: isAttending ? "ATTENDING" : "NOT_ATTENDING",
      guestCount: partySize,
      attendeeCount: partySize,
      note: trimmedNote,
      wish: trimmedNote,
    };

    try {
      let endpoint = "/api/rsvp";
      let method = "POST";
      let reqBody: Record<string, unknown> = payload;

      if (hasToken && token) {
        endpoint = `/api/public/invitations/${encodeURIComponent(token)}/rsvp`;
        method = "POST";
        reqBody = {
          ...payload,
          churchAttendance: isAttending,
          homeAttendance: isAttending && (withBasseleal || withBethel),
        };
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      if (!res.ok) {
        throw new Error("Failed to submit RSVP");
      }

      setSubmittedData({
        name: name.trim(),
        response,
      });
    } catch {
      setErrorMessage(
        isAmharic
          ? "ምላሽዎን መላክ አልተቻለም። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ።"
          : "Could not submit your RSVP. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapsLink = (query: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const totalVenuesCount = 1 + (withBasseleal ? 1 : 0) + (withBethel ? 1 : 0);
  const hasMultipleVenues = totalVenuesCount > 1;

  return (
    <section
      id="rsvp"
      data-reveal
      data-language={isAmharic ? "am" : "en"}
      className="reveal-seq amharic-section scroll-mt-24 relative min-h-[100svh] lg:min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-0 flex flex-col overflow-hidden bg-[#FAF5EE]"
    >
      {/* Background Image: rsvp bg1.jpg covering both RSVP section and the embedded directions */}
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

      {/* Main Upper Content: Heading + Stationery Card */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 mb-8 sm:mb-12">
        {/* Section Heading */}
        <div data-seq="fade" className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.26em] font-bold text-xs mb-1.5">
            {isAmharic ? "በደስታችን ይሳተፉ" : "Join Our Celebration"}
          </p>
          <h2 className={`${isAmharic ? "font-jegna-title text-2xl sm:text-3xl md:text-4xl" : "font-editorial-serif text-2xl sm:text-3xl md:text-4xl"} text-[#2B1810]`}>
            {isAmharic ? "መገኘትዎን ያረጋግጡ፣ መልካም ምኞትዎትንም ያስቀምጡ" : "RSVP & Leave a Wish"}
          </h2>
          <div className="h-px w-14 bg-[#8C6A3B]/40 mx-auto mt-3.5 mb-3.5" />
        </div>

        {/* White stationery card */}
        <div data-seq="card" className="relative max-w-lg lg:max-w-xl w-full mx-auto bg-white rounded-lg border border-[#E7DDCB] p-5 sm:p-6 md:p-7 shadow-[0_24px_56px_-22px_rgba(43,24,16,0.22),0_12px_26px_-16px_rgba(43,24,16,0.12)] overflow-hidden">
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
              <div className="py-6 sm:py-8 space-y-4 animate-fadeIn text-center">
                <div className="mb-6">
                  <h3 className={`${isAmharic ? "font-jegna-title" : "font-editorial-serif"} text-3xl sm:text-4xl text-[#1E140E] leading-none tracking-[0.04em]`}>
                    RSVP
                  </h3>
                  <p className={`mt-2.5 ${isAmharic ? "font-balderasu" : "font-editorial-serif italic"} text-base sm:text-lg text-[#8C6A3B]`}>
                    {isAmharic ? "ምላሽዎ ደርሶናል" : "Received"}
                  </p>
                </div>
                <h3 className={`${isAmharic ? "font-jegna-title" : "font-editorial-serif"} text-2xl sm:text-3xl text-[#1E140E]`}>
                  {isAmharic ? `እናመሰግናለን፣ ${submittedData.name}!` : `Thank You, ${submittedData.name}!`}
                </h3>
                <p className={`${isAmharic ? "font-balderasu" : "font-editorial-serif italic"} text-base text-[#5A4F46] leading-relaxed max-w-lg mx-auto`}>
                  {submittedData.response === "accept"
                    ? (isAmharic ? "መገኘታችሁና መልዕክታችሁ በደስታ ተመዝግቧል። ከእናንተ ጋር ለመደሰት እንጓጓለን!" : "Your attendance and message have been joyfully recorded. We cannot wait to celebrate with you!")
                    : (isAmharic ? "መልሳችሁ ደርሶናል። በአካል ባትገኙም ፍቅራችሁን፣ ጸሎታችሁን እና መልዕክታችሁን እናከብራለን።" : "We have received your reply. Although you will be missed in person, we cherish your love, prayers, and message.")}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className={`px-6 py-2 rounded-full border border-[#2B1810] text-[#1E140E] hover:bg-[#1E140E] hover:text-[#FAF5EE] transition-all duration-300 ${isAmharic ? "font-benaiah text-sm" : "font-sans text-xs uppercase tracking-[0.16em]"} font-medium cursor-pointer`}
                  >
                    {isAmharic ? "መልሱን ያስተካክሉ" : "Edit Response"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left">
                {/* Wishlist input */}
                <div className="rounded-md transition-transform duration-300 focus-within:-translate-y-0.5">
                  <label
                    htmlFor="guest-secondary"
                    className={`${isAmharic ? "font-benaiah text-xs sm:text-sm" : "font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium"} block text-[#2B1810]`}
                  >
                    {isAmharic ? "ለሙሽሮቹ ያለዎት መልካም ምኞት" : "Your Wish for the Couple"} <span className="text-[#8C6A3B]">*</span>
                  </label>
                  <textarea
                    id="guest-secondary"
                    rows={2}
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={isAmharic ? "ፍቅርዎን፣ ጸሎትዎን ወይም ለጥንዶቹ መልዕክት ያካፍሉ።" : "Share your love, prayer, or a note for the couple."}
                    className={`mt-2 w-full resize-none bg-transparent border-0 border-b border-[#1E140E]/25 focus:border-[#8C6A3B] text-[#1E140E] ${isAmharic ? "font-balderasu text-base" : "font-editorial-serif text-base sm:text-lg"} pb-1.5 placeholder:text-[#1E140E]/30 focus:outline-none transition-colors`}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Interactive attendance choice */}
                <fieldset>
                  <legend className={`${isAmharic ? "font-benaiah text-xs sm:text-sm" : "font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold"} block text-[#2B1810] mb-3.5`}>
                    {isAmharic ? "በሰርጋችን ላይ ይገኛሉ?" : "Will you be joining us?"}
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
                          <span className={`${isAmharic ? "font-balderasu font-medium text-base sm:text-lg" : "font-editorial-serif text-base sm:text-lg"} text-[#1E140E] leading-tight`}>
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
                          <span className={`${isAmharic ? "font-balderasu font-medium text-base sm:text-lg" : "font-editorial-serif text-base sm:text-lg"} text-[#1E140E] leading-tight`}>
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
                      className={`${isAmharic ? "font-benaiah text-xs sm:text-sm" : "font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium"} block text-[#2B1810]`}
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
                      className={`mt-2 w-full bg-transparent border-0 border-b border-[#1E140E]/25 focus:border-[#8C6A3B] text-[#1E140E] ${isAmharic ? "font-balderasu text-base" : "font-editorial-serif text-base sm:text-lg"} pb-1.5 placeholder:text-[#1E140E]/30 focus:outline-none transition-colors`}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Bottom Bar: Attending Count & Submit Button */}
                <div className="pt-4 sm:pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#1E140E]/10">
                  {response === "accept" && (
                    <div className="flex items-center gap-2 text-xs text-[#6A5D54] animate-fadeIn">
                      <span className={isAmharic ? "font-benaiah text-xs sm:text-sm" : "font-editorial-serif italic"}>{isAmharic ? "አብረው የሚገኙ እንግዶች ብዛት፡" : "Attending party:"}</span>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className={`bg-transparent border-0 border-b border-[#1E140E]/40 text-[#1E140E] ${isAmharic ? "font-benaiah text-sm" : "font-editorial-serif text-sm"} px-1 outline-none cursor-pointer`}
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
                    className={`min-h-[46px] w-full sm:w-auto sm:min-w-[200px] sm:ml-auto px-8 py-3 rounded-full ${isAmharic ? "font-benaiah text-sm" : "font-sans text-xs uppercase tracking-[0.18em]"} font-semibold transition-all duration-300 bg-[#1E140E] text-[#FAF5EE] hover:bg-[#8C6A3B] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_14px_30px_-14px_rgba(43,24,16,0.6)] hover:shadow-[0_18px_36px_-14px_rgba(140,106,59,0.7)] inline-flex items-center justify-center gap-2`}
                  >
                    <span>{isSubmitting ? (isAmharic ? "በመላክ ላይ..." : "Sending...") : (isAmharic ? "መልስዎን ይላኩ" : "Submit Reply")}</span>
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

      {/* Directions — customized for personalized invitation links & homes */}
      <div id="directions" data-reveal className="reveal-seq relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20 scroll-mt-24">
        <div data-seq="card" className="mx-auto rounded-3xl border border-[#E7DDCB] bg-white/90 p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(43,24,16,0.25)] backdrop-blur-sm">
          {/* Section Header */}
          <div className="text-center">
            <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.24em] font-bold text-xs mb-1.5">
              {isAmharic ? "ወደ ዝግጅቱ ቦታዎች ለመድረስ" : "Getting There"}
            </p>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl text-[#2B1810] ${isAmharic ? "font-jegna-title" : "font-editorial-serif"}`}>
              {isAmharic ? "የዝግጅት ቦታዎች እና አቅጣጫዎች" : "Event Locations & Directions"}
            </h3>
            <p className={`mt-2 text-xs sm:text-sm text-[#6A5D54] max-w-lg mx-auto ${isAmharic ? "font-balderasu" : "font-sans font-light"}`}>
              {isAmharic
                ? "የቤተክርስቲያኑን እንዲሁም የቤት ድግሶቹን ትክክለኛ አድራሻዎች በጎግል ካርታ በቀጥታ ይመልከቱ ወይም ኮፒ ያድርጉ።"
                : isChurchOnly
                  ? "View live Google Maps navigation or copy the church ceremony address."
                  : "View live Google Maps navigation or copy the exact venue addresses for church ceremony and home receptions."}
            </p>
          </div>

          {/* Interactive Mobile Tabs (visible when more than 1 venue is available) */}
          {hasMultipleVenues && (
            <div className={`mt-6 flex sm:hidden items-center justify-center p-1 rounded-xl bg-[#F4EFE6] border border-[#E5DAC8] ${totalVenuesCount === 3 ? "gap-1" : ""}`}>
              {/* Church Tab */}
              <button
                type="button"
                onClick={() => setActiveVenueTab("church")}
                className={`flex-1 py-2 px-1.5 rounded-lg transition-all ${
                  activeVenueTab === "church"
                    ? "bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                    : "text-[#6A5D54] hover:text-[#2B1810]"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold">
                    <svg className="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 2v4M10 4h4" />
                      <path d="M12 6L4 12v9h16v-9z" />
                      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
                    </svg>
                    <span className="whitespace-nowrap truncate max-w-[90px]">{isAmharic ? "ቤተክርስቲያን" : "Church"}</span>
                  </div>
                  <span className={`font-benaiah text-[11px] font-semibold mt-0.5 tracking-wider ${
                    activeVenueTab === "church" ? "text-[#E6C687]" : "text-[#8C6A3B]"
                  }`}>
                    {isAmharic ? "(3:00 / 9:00)" : "(9:00)"}
                  </span>
                </div>
              </button>

              {/* Basseleal's House Tab */}
              {withBasseleal && (
                <button
                  type="button"
                  onClick={() => setActiveVenueTab("basseleal")}
                  className={`flex-1 py-2 px-1.5 rounded-lg transition-all ${
                    activeVenueTab === "basseleal"
                      ? "bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                      : "text-[#6A5D54] hover:text-[#2B1810]"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold">
                      <svg className="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="whitespace-nowrap truncate max-w-[95px]">{isAmharic ? "ባስልኤል ቤት" : "Basseleal's"}</span>
                    </div>
                    <span className={`font-benaiah text-[11px] font-semibold mt-0.5 tracking-wider ${
                      activeVenueTab === "basseleal" ? "text-[#E6C687]" : "text-[#8C6A3B]"
                    }`}>
                      {isAmharic ? "(10:30 / 4:30)" : "(4:30)"}
                    </span>
                  </div>
                </button>
              )}

              {/* Bethel's House Tab */}
              {withBethel && (
                <button
                  type="button"
                  onClick={() => setActiveVenueTab("bethel")}
                  className={`flex-1 py-2 px-1.5 rounded-lg transition-all ${
                    activeVenueTab === "bethel"
                      ? "bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                      : "text-[#6A5D54] hover:text-[#2B1810]"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold">
                      <svg className="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="whitespace-nowrap truncate max-w-[95px]">{isAmharic ? "ቤቴል ቤት" : "Bethel's"}</span>
                    </div>
                    <span className={`font-benaiah text-[11px] font-semibold mt-0.5 tracking-wider ${
                      activeVenueTab === "bethel" ? "text-[#E6C687]" : "text-[#8C6A3B]"
                    }`}>
                      {isAmharic ? "(10:30 / 4:30)" : "(4:30)"}
                    </span>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* Venue Cards Grid */}
          <div className={`mt-6 grid gap-4 ${totalVenuesCount === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : totalVenuesCount === 2 ? "sm:grid-cols-2" : "max-w-md mx-auto"}`}>
            {/* 1. Church Card */}
            <div
              className={`flex flex-col justify-between rounded-2xl border border-[#E1D3C2] bg-[#FCFAF6] p-5 sm:p-6 transition-all hover:border-[#8C6A3B]/60 hover:shadow-md ${
                hasMultipleVenues && activeVenueTab !== "church" ? "hidden sm:flex" : "flex"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE5D5] text-[#8C6A3B] shadow-inner">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                        <path d="M12 2v4M10 4h4" />
                        <path d="M12 6L4 12v9h16v-9z" />
                        <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
                      </svg>
                    </span>
                    <div>
                      <span className="inline-block rounded-full bg-[#8C6A3B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B]">
                        {isAmharic ? "ከጠዋቱ 3:00 / 9:00 (Local Time)" : "9:00 Local Time"}
                      </span>
                      <h4 className={`mt-1 font-semibold text-base sm:text-lg text-[#2B1810] ${isAmharic ? "amharic-title" : "font-editorial-serif"}`}>
                        {isAmharic ? activeLocations.church.labelAm : activeLocations.church.label}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#6A5D54] leading-relaxed">
                  {isAmharic ? activeLocations.church.addressAm : activeLocations.church.address}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-[#EFE5D5]/80">
                <a
                  href={mapsLink(activeLocations.church.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B1810] px-3.5 py-2.5 text-xs font-semibold text-[#FAF6F0] hover:bg-[#8C6A3B] transition-colors shadow-xs active:scale-98"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ ይመልከቱ" : "Open in Maps"}</span>
                </a>

                <button
                  type="button"
                  onClick={() => copyAddress("church", isAmharic ? activeLocations.church.addressAm : activeLocations.church.address)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D5C6B5] bg-white px-3 py-2.5 text-xs font-semibold text-[#2B1810] hover:bg-[#F7F2EB] hover:border-[#8C6A3B] transition-colors active:scale-98"
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
                      <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "ኮፒ ያድርጉ" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Basseleal's House Card */}
            {withBasseleal && (
              <div
                className={`flex flex-col justify-between rounded-2xl border border-[#E1D3C2] bg-[#FCFAF6] p-5 sm:p-6 transition-all hover:border-[#8C6A3B]/60 hover:shadow-md ${
                  hasMultipleVenues && activeVenueTab !== "basseleal" ? "hidden sm:flex" : "flex"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE5D5] text-[#8C6A3B] shadow-inner">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </span>
                      <div>
                        <span className="inline-block rounded-full bg-[#8C6A3B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B]">
                          {isAmharic ? "ከቀኑ 10:30 / 4:30 (Local Time)" : "4:30 PM (Reception)"}
                        </span>
                        <h4 className={`mt-1 font-semibold text-base sm:text-lg text-[#2B1810] ${isAmharic ? "amharic-title" : "font-editorial-serif"}`}>
                          {isAmharic ? activeLocations.basselealHome.labelAm : activeLocations.basselealHome.label}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#6A5D54] leading-relaxed">
                    {isAmharic ? activeLocations.basselealHome.addressAm : activeLocations.basselealHome.address}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-[#EFE5D5]/80">
                  <a
                    href={mapsLink(activeLocations.basselealHome.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B1810] px-3.5 py-2.5 text-xs font-semibold text-[#FAF6F0] hover:bg-[#8C6A3B] transition-colors shadow-xs active:scale-98"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ ይመልከቱ" : "Open in Maps"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyAddress("basseleal", isAmharic ? activeLocations.basselealHome.addressAm : activeLocations.basselealHome.address)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D5C6B5] bg-white px-3 py-2.5 text-xs font-semibold text-[#2B1810] hover:bg-[#F7F2EB] hover:border-[#8C6A3B] transition-colors active:scale-98"
                  >
                    {copiedType === "basseleal" ? (
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
                        <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "ኮፒ ያድርጉ" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 3. Bethel's House Card */}
            {withBethel && (
              <div
                className={`flex flex-col justify-between rounded-2xl border border-[#E1D3C2] bg-[#FCFAF6] p-5 sm:p-6 transition-all hover:border-[#8C6A3B]/60 hover:shadow-md ${
                  hasMultipleVenues && activeVenueTab !== "bethel" ? "hidden sm:flex" : "flex"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE5D5] text-[#8C6A3B] shadow-inner">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </span>
                      <div>
                        <span className="inline-block rounded-full bg-[#8C6A3B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B]">
                          {isAmharic ? "ከቀኑ 10:30 / 4:30 (Local Time)" : "4:30 PM (Reception)"}
                        </span>
                        <h4 className={`mt-1 font-semibold text-base sm:text-lg text-[#2B1810] ${isAmharic ? "amharic-title" : "font-editorial-serif"}`}>
                          {isAmharic ? activeLocations.bethelHome.labelAm : activeLocations.bethelHome.label}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#6A5D54] leading-relaxed">
                    {isAmharic ? activeLocations.bethelHome.addressAm : activeLocations.bethelHome.address}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-[#EFE5D5]/80">
                  <a
                    href={mapsLink(activeLocations.bethelHome.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B1810] px-3.5 py-2.5 text-xs font-semibold text-[#FAF6F0] hover:bg-[#8C6A3B] transition-colors shadow-xs active:scale-98"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ ይመልከቱ" : "Open in Maps"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyAddress("bethel", isAmharic ? activeLocations.bethelHome.addressAm : activeLocations.bethelHome.address)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D5C6B5] bg-white px-3 py-2.5 text-xs font-semibold text-[#2B1810] hover:bg-[#F7F2EB] hover:border-[#8C6A3B] transition-colors active:scale-98"
                  >
                    {copiedType === "bethel" ? (
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
                        <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "ኮፒ ያድርጉ" : "Copy"}</span>
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
                ? "ጠቃሚ ማሳሰቢያ፡ ትክክለኛውን አድራሻ በቀላሉ በራይድ (RIDE)፣ ፈረስ (Feres) ወይም በሌሎች የካርታ መተግበሪያዎች ላይ ለመለጠፍ \"ኮፒ\" የሚለውን ይጫኑ።"
                : "Helpful tip: Tap \"Copy\" to easily paste the exact address into RIDE, Feres, or navigation apps."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
