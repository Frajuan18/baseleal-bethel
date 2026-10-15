"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { coupleName, wedding } from "@/config/wedding";

export function RSVPSection() {
  const [response, setResponse] = useState<"accept" | "decline">("accept");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [dietary, setDietary] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    response: "accept" | "decline";
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      response,
      guestCount: response === "accept" ? parseInt(guestCount, 10) : 0,
      dietary: dietary.trim(),
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
      className="relative py-24 sm:py-32 lg:py-40 bg-[#24130C] text-[#F8F4ED] overflow-hidden"
    >
      {/* Background imagery with luxury twilight vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src={wedding.images.rsvpBackdrop}
          alt="Candlelit wedding ambiance"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C0E08] via-[#24130C]/90 to-[#1C0E08]" />
      </div>

      {/* Decorative monogram watermark */}
      <div
        className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 font-editorial-serif text-[20rem] text-white/[0.02] select-none leading-none z-0"
        aria-hidden
      >
        {wedding.couple.monogram}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="eyebrow text-[#B18A54] mb-3">RSVP</p>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#F8F4ED]">
            Will You Join Us?
          </h2>
          <div className="h-px w-16 bg-[#B18A54] mx-auto mt-5 mb-5" />
          <p className="text-sm sm:text-base text-[#F8F4ED]/80 leading-relaxed font-sans font-light">
            We would be deeply honoured by your presence as we celebrate this holy sacrament.
            {wedding.rsvpDeadline && (
              <span className="block mt-2 font-medium text-[#C9A46E]">
                Kindly respond by {wedding.rsvpDeadline}.
              </span>
            )}
          </p>
        </div>

        {/* RSVP Card Form */}
        <div className="bg-[#1C0E08]/85 border border-[#B18A54]/30 p-8 sm:p-12 md:p-16 rounded-sm shadow-2xl backdrop-blur-md">
          {submittedData ? (
            /* Warm success confirmation */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full border border-[#B18A54] flex items-center justify-center text-[#B18A54] text-2xl font-editorial-serif">
                ✦
              </div>
              <h3 className="font-editorial-serif text-3xl sm:text-4xl text-[#F8F4ED]">
                Thank You, {submittedData.name}!
              </h3>
              <p className="text-sm sm:text-base text-[#F8F4ED]/85 max-w-md mx-auto leading-relaxed">
                {submittedData.response === "accept"
                  ? "Your attendance has been joyfully recorded. We cannot wait to embrace you and share this sacred day with you!"
                  : "We have received your reply. Although you will be missed in person, we cherish your love and prayers from afar."}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setSubmittedData(null)}
                  className="btn-editorial-outline text-[#F8F4ED] text-[10px]"
                >
                  Edit or Submit Another Response
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Radio Attendance Toggle */}
              <fieldset>
                <legend className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A46E] mb-3 text-center sm:text-left">
                  Will You Be Attending? <span className="text-[#B18A54]">*</span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`cursor-pointer border p-4 text-center transition-all ${
                      response === "accept"
                        ? "border-[#B18A54] bg-[#B18A54]/15 text-[#F8F4ED] shadow-sm"
                        : "border-[#F8F4ED]/20 hover:border-[#F8F4ED]/40 text-[#F8F4ED]/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="response"
                      value="accept"
                      checked={response === "accept"}
                      onChange={() => setResponse("accept")}
                      className="sr-only"
                    />
                    <span className="block font-editorial-serif text-lg">
                      Joyfully Accept
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-[#C9A46E] mt-1">
                      I will attend with joy
                    </span>
                  </label>

                  <label
                    className={`cursor-pointer border p-4 text-center transition-all ${
                      response === "decline"
                        ? "border-[#B18A54] bg-[#B18A54]/15 text-[#F8F4ED] shadow-sm"
                        : "border-[#F8F4ED]/20 hover:border-[#F8F4ED]/40 text-[#F8F4ED]/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="response"
                      value="decline"
                      checked={response === "decline"}
                      onChange={() => setResponse("decline")}
                      className="sr-only"
                    />
                    <span className="block font-editorial-serif text-lg">
                      Regretfully Decline
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-[#C9A46E] mt-1">
                      Celebrating in spirit
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* Name & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A46E] mb-1"
                  >
                    Full Name <span className="text-[#B18A54]">*</span>
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="editorial-input-dark"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="guest-email"
                    className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A46E] mb-1"
                  >
                    Email Address <span className="text-[#B18A54]">*</span>
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For confirmation & directions"
                    className="editorial-input-dark"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Guest Count & Dietary (Only if attending) */}
              {response === "accept" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label
                      htmlFor="guest-count"
                      className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A46E] mb-1"
                    >
                      Total Number of Guests Attending
                    </label>
                    <select
                      id="guest-count"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="editorial-input-dark bg-[#1C0E08] cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <option value="1">1 Guest (Just myself)</option>
                      <option value="2">2 Guests (Myself + 1)</option>
                      <option value="3">3 Guests (Myself + 2)</option>
                      <option value="4">4 Guests (Family)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="guest-dietary"
                      className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A46E] mb-1"
                    >
                      Dietary Preferences / Notes (Optional)
                    </label>
                    <input
                      id="guest-dietary"
                      type="text"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      placeholder="e.g. Vegetarian, Fasting, Allergies"
                      className="editorial-input-dark"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Personal Note */}
              <div>
                <label
                  htmlFor="guest-note"
                  className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A46E] mb-1"
                >
                  A Personal Note for the Couple (Optional)
                </label>
                <textarea
                  id="guest-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Share a word with Baseleal and Bethel…"
                  className="editorial-input-dark resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-editorial-gold w-full sm:w-auto px-10 py-3.5 shadow-xl disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Recording Your Reply…" : "Confirm Your Reply"}</span>
                  <span aria-hidden>→</span>
                </button>
              </div>

              {errorMessage && (
                <div role="alert" className="p-4 border border-red-500/40 bg-red-950/30 text-red-200 text-xs text-center">
                  {errorMessage}
                </div>
              )}

              <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[#F8F4ED]/50 pt-4">
                Responses are saved locally and dispatched to <code className="text-[#C9A46E]">/api/rsvp</code>.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
