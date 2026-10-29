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
  const withAnyHome = withBasseleal || withBethel;

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
    if (!name.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: name.trim(),
      attendance: response,
      guestCount: response === "accept" ? parseInt(guestCount, 10) : 0,
      note: note.trim() || undefined,
    };

    try {
      let endpoint = "/api/rsvp";
      let method = "POST";
      let reqBody: Record<string, unknown> = payload;

      if (hasToken && token) {
        endpoint = `/api/public/invitations/${encodeURIComponent(token)}/rsvp`;
        method = "PUT";
        const partySize = Math.max(1, parseInt(guestCount, 10) || 1);
        reqBody = {
          attendanceStatus: response === "accept" ? "ATTENDING" : "NOT_ATTENDING",
          churchAttendance: response === "accept",
          homeAttendance: response === "accept" && withAnyHome,
          attendeeCount: response === "accept" ? partySize : 0,
          wish: note.trim() || undefined,
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
      className="reveal-seq amharic-section scroll-mt-24 relative overflow-hidden bg-[#FFFDF5] text-center"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/card bg main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 mix-blend-multiply"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5] via-transparent to-[#FFFDF5]/90 pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        {/* Section Eyebrow & Title */}
        <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.24em] font-semibold text-xs mb-2">
          {isAmharic ? "መገኘትዎን ያረጋግጡ" : "Kindly Respond"}
        </p>

        <h2 className={`text-4xl sm:text-5xl md:text-6xl text-[#1E140E] ${isAmharic ? "font-jegna-title" : "font-editorial-serif"}`}>
          RSVP
        </h2>

        <p className={`mt-3 text-sm sm:text-base text-[#5A4638] max-w-md mx-auto ${isAmharic ? "font-balderasu" : "font-sans font-light"}`}>
          {isAmharic
            ? "በደስታችን ላይ አብረውን እንዲሆኑ በአክብሮት ተጋብዘዋል። እባክዎ እስከ ህዳር 20 ድረስ መገኘትዎን ያረጋግጡ።"
            : "We would be honored by your presence. Please let us know if you can join our celebration."}
        </p>

        {submittedData ? (
          /* Confirmation State */
          <div className="mt-8 p-8 rounded-3xl bg-white/95 border border-[#E7DDCB] shadow-[0_20px_50px_-20px_rgba(43,24,16,0.3)] backdrop-blur-sm animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8C6A3B]/10 flex items-center justify-center text-[#8C6A3B]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h3 className={`text-2xl font-bold text-[#1E140E] ${isAmharic ? "font-jegna-title" : "font-editorial-serif"}`}>
              {isAmharic ? "እናመሰግናለን!" : "Thank You!"}
            </h3>

            <p className={`mt-2 text-sm text-[#5A4638] ${isAmharic ? "font-balderasu" : "font-sans"}`}>
              {submittedData.response === "accept"
                ? isAmharic
                  ? `ውድ ${submittedData.name}፣ መገኘትዎን ስላረጋገጡ ከልብ እናመሰግናለን። በሠርጉ ቀን በደስታ እንጠብቅዎታለን!`
                  : `Dear ${submittedData.name}, your attendance is confirmed. We cannot wait to celebrate with you!`
                : isAmharic
                  ? `ውድ ${submittedData.name}፣ መልስዎን ስላሳወቁን እናመሰግናለን። በጸሎትና በሃሳብ አብረውን እንዳሉ እናውቃለን።`
                  : `Dear ${submittedData.name}, thank you for letting us know. You will be missed dearly!`
              }
            </p>

            <button
              type="button"
              onClick={() => setSubmittedData(null)}
              className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#8C6A3B]/30 text-xs font-semibold uppercase tracking-wider text-[#1E140E] hover:bg-[#8C6A3B]/10 transition-colors"
            >
              {isAmharic ? "ምላሽን አስተካክል" : "Update Response"}
            </button>
          </div>
        ) : (
          /* Interactive RSVP Form */
          <form
            onSubmit={handleSubmit}
            className="mt-8 p-6 sm:p-8 rounded-3xl bg-white/95 border border-[#E7DDCB] shadow-[0_20px_50px_-20px_rgba(43,24,16,0.3)] backdrop-blur-sm text-left space-y-5"
          >
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Attendance Choice Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6A3B] mb-2">
                {isAmharic ? "መገኘትዎን ይምረጡ" : "Will you be attending?"}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResponse("accept")}
                  className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    response === "accept"
                      ? "border-[#8C6A3B] bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                      : "border-[#E1D9CF] bg-[#FAF8F5] text-[#5A4638] hover:border-[#8C6A3B]/50"
                  }`}
                >
                  {isAmharic ? "በደስታ እገኛለሁ ✓" : "Joyfully Accept ✓"}
                </button>

                <button
                  type="button"
                  onClick={() => setResponse("decline")}
                  className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    response === "decline"
                      ? "border-[#8C6A3B] bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                      : "border-[#E1D9CF] bg-[#FAF8F5] text-[#5A4638] hover:border-[#8C6A3B]/50"
                  }`}
                >
                  {isAmharic ? "መገኘት አልችልም" : "Regretfully Decline"}
                </button>
              </div>
            </div>

            {/* Guest Name Input */}
            <div>
              <label htmlFor="rsvp-name" className="block text-xs font-bold uppercase tracking-wider text-[#8C6A3B] mb-1.5">
                {isAmharic ? "ሙሉ ስም *" : "Full Name *"}
              </label>
              <input
                id="rsvp-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAmharic ? "ስምዎትን ያስገቡ" : "Your full name"}
                className="w-full px-4 py-3 rounded-xl border border-[#E1D9CF] bg-[#FAF8F5] text-sm text-[#1E140E] placeholder:text-[#A8988B] focus:border-[#8C6A3B] focus:outline-none focus:ring-1 focus:ring-[#8C6A3B] transition"
              />
            </div>

            {/* Guest Count (only if attending) */}
            {response === "accept" && (
              <div>
                <label htmlFor="rsvp-guests" className="block text-xs font-bold uppercase tracking-wider text-[#8C6A3B] mb-1.5">
                  {isAmharic ? "የተጋባዦች ብዛት" : "Number of Guests"}
                </label>
                <select
                  id="rsvp-guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E1D9CF] bg-[#FAF8F5] text-sm text-[#1E140E] focus:border-[#8C6A3B] focus:outline-none focus:ring-1 focus:ring-[#8C6A3B] transition"
                >
                  <option value="1">{isAmharic ? "1 ሰው" : "1 Person"}</option>
                  <option value="2">{isAmharic ? "2 ሰዎች" : "2 People"}</option>
                  <option value="3">{isAmharic ? "3 ሰዎች" : "3 People"}</option>
                  <option value="4">{isAmharic ? "4 ሰዎች" : "4 People"}</option>
                </select>
              </div>
            )}

            {/* Note / Well-Wish Message */}
            <div>
              <label htmlFor="rsvp-note" className="block text-xs font-bold uppercase tracking-wider text-[#8C6A3B] mb-1.5">
                {isAmharic ? "የመልካም ምኞት መልእክት (አማራጭ)" : "A Note for the Couple (Optional)"}
              </label>
              <textarea
                id="rsvp-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isAmharic ? "ለሙሽሮች መልካም ምኞትዎን ይጻፉ..." : "Share your blessings or congratulations..."}
                className="w-full px-4 py-3 rounded-xl border border-[#E1D9CF] bg-[#FAF8F5] text-sm text-[#1E140E] placeholder:text-[#A8988B] focus:border-[#8C6A3B] focus:outline-none focus:ring-1 focus:ring-[#8C6A3B] transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#2B1810] text-[#FAF6F0] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#8C6A3B] transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting
                ? isAmharic ? "በመላክ ላይ..." : "Submitting..."
                : isAmharic ? "ምላሽን ላክ" : "Send RSVP"
              }
            </button>
          </form>
        )}
      </div>

      {/* Directions — customized for personalized invitation links & homes */}
      <div id="directions" className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20 scroll-mt-24">
        <div className="mx-auto rounded-3xl border border-[#E7DDCB] bg-white/90 p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(43,24,16,0.25)] backdrop-blur-sm">
          {/* Section Header */}
          <div className="text-center">
            <p className="eyebrow text-[#8C6A3B] uppercase tracking-[0.24em] font-bold text-xs mb-1.5">
              {isAmharic ? "አቅጣጫዎችና ቦታዎች" : "Getting There"}
            </p>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl text-[#2B1810] ${isAmharic ? "font-jegna-title" : "font-editorial-serif"}`}>
              {isAmharic ? "የቦታው አቅጣጫዎችና ካርታ" : "Event Locations & Directions"}
            </h3>
            <p className={`mt-2 text-xs sm:text-sm text-[#6A5D54] max-w-lg mx-auto ${isAmharic ? "font-balderasu" : "font-sans font-light"}`}>
              {isAmharic
                ? isChurchOnly
                  ? "ወደ ቤተክርስቲያን የሚወስደውን ትክክለኛ አቅጣጫ በካርታ ይመልከቱ ወይም አድራሻውን ይቅዱ።"
                  : "ወደ ቤተክርስቲያን እና ወደ ቤቶቹ የሚወስዱትን ትክክለኛ አቅጣጫዎች በካርታ ይመልከቱ ወይም አድራሻውን ይቅዱ።"
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
                    <span className="whitespace-nowrap truncate max-w-[90px]">{isAmharic ? "ሀልዎት አማኑኤል" : "Church"}</span>
                  </div>
                  <span className={`font-benaiah text-[11px] font-semibold mt-0.5 tracking-wider ${
                    activeVenueTab === "church" ? "text-[#E6C687]" : "text-[#8C6A3B]"
                  }`}>
                    (9:00)
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
                      <span className="whitespace-nowrap truncate max-w-[95px]">{isAmharic ? "የባስልኤል ቤት" : "Basseleal's"}</span>
                    </div>
                    <span className={`font-benaiah text-[11px] font-semibold mt-0.5 tracking-wider ${
                      activeVenueTab === "basseleal" ? "text-[#E6C687]" : "text-[#8C6A3B]"
                    }`}>
                      (4:30)
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
                      <span className="whitespace-nowrap truncate max-w-[95px]">{isAmharic ? "የቤቴል ቤት" : "Bethel's"}</span>
                    </div>
                    <span className={`font-benaiah text-[11px] font-semibold mt-0.5 tracking-wider ${
                      activeVenueTab === "bethel" ? "text-[#E6C687]" : "text-[#8C6A3B]"
                    }`}>
                      (4:30)
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
                        {isAmharic ? "ከጠዋቱ 9:00 ሰዓት" : "9:00 Local Time"}
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
                  <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ አቅጣጫ ክፈት" : "Open in Maps"}</span>
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
                      <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "አድራሻ ቅዳ" : "Copy"}</span>
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
                          {isAmharic ? "ከቀኑ 4:30 ሰዓት" : "4:30 PM (Reception)"}
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
                    <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ አቅጣጫ ክፈት" : "Open in Maps"}</span>
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
                        <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "አድራሻ ቅዳ" : "Copy"}</span>
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
                          {isAmharic ? "ከቀኑ 4:30 ሰዓት" : "4:30 PM (Reception)"}
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
                    <span className={isAmharic ? "font-benaiah text-sm" : ""}>{isAmharic ? "በካርታ አቅጣጫ ክፈት" : "Open in Maps"}</span>
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
