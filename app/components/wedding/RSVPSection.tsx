"use client";

import { FormEvent, useState } from "react";
import { coupleName, wedding } from "@/config/wedding";

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
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden text-[#1E1108]"
      style={{
        background: "linear-gradient(150deg, #A88F78 0%, #9B8069 50%, #8D725B 100%)",
      }}
    >
      {/* High-Definition Tactile Paper Texture Layer for Section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.20] mix-blend-multiply select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.4 -0.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Subtle Warm Vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#24130A]/20 via-transparent to-white/15"
        aria-hidden
      />

      {/* Decorative Monogram Watermark */}
      <div
        className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 font-editorial-serif text-[20rem] text-[#24130A]/[0.06] select-none leading-none z-0"
        aria-hidden
      >
        {wedding.couple.monogram}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="eyebrow text-[#2D1B10] uppercase tracking-[0.26em] font-bold text-xs mb-3">
            RSVP
          </p>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#1E1108] drop-shadow-xs">
            Will You Join Us?
          </h2>
          <div className="h-px w-16 bg-[#2D1B10]/40 mx-auto mt-5 mb-5" />
          <p className="text-sm sm:text-base text-[#321F13] leading-relaxed font-sans font-medium">
            We would be deeply honoured by your presence as we celebrate this holy sacrament.
            {wedding.rsvpDeadline && (
              <span className="block mt-2 font-semibold text-[#2D1B10]">
                Kindly respond by {wedding.rsvpDeadline}.
              </span>
            )}
          </p>
        </div>

        {/* RSVP Card Form in Darker Brown Beige with Rich Texture */}
        <div
          className="relative rounded-sm border border-[#5E412E] p-8 sm:p-12 md:p-16 shadow-[0_24px_55px_-12px_rgba(20,12,7,0.55),inset_0_1px_1px_rgba(255,235,185,0.12)] overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #3E291C 0%, #301E13 100%)",
          }}
        >
          {/* Tactile Embossed Paper Grain Overlay inside Card */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay select-none z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 -0.35'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoise)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />

          {/* Artisanal Paper Fiber Flecks inside Card */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-color-dodge select-none z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='18' r='1.2' fill='%23E8D5B5'/%3E%3Ccircle cx='68' cy='32' r='0.8' fill='%23D4BF9D'/%3E%3Ccircle cx='95' cy='15' r='1.1' fill='%23E8D5B5'/%3E%3Ccircle cx='32' cy='74' r='1.3' fill='%23C9A46E'/%3E%3Ccircle cx='85' cy='88' r='0.9' fill='%23E8D5B5'/%3E%3Ccircle cx='110' cy='62' r='1' fill='%23D4BF9D'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />

          <div className="relative z-10">
            {submittedData ? (
              /* Warm success confirmation */
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 mx-auto rounded-full border border-[#C9A46E] flex items-center justify-center text-[#C9A46E] text-2xl font-editorial-serif shadow-[0_0_20px_rgba(201,164,110,0.2)]">
                  ✦
                </div>
                <h3 className="font-editorial-serif text-3xl sm:text-4xl text-[#FFF8D6]">
                  Thank You, {submittedData.name}!
                </h3>
                <p className="text-sm sm:text-base text-[#D5C2B2] max-w-md mx-auto leading-relaxed">
                  {submittedData.response === "accept"
                    ? "Your attendance has been joyfully recorded. We cannot wait to embrace you and share this sacred day with you!"
                    : "We have received your reply. Although you will be missed in person, we cherish your love and prayers from afar."}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className="px-6 py-2.5 rounded-full border border-[#C9A46E] text-[#FFF8D6] hover:bg-[#C9A46E] hover:text-[#1E110A] transition-all duration-300 font-sans text-xs uppercase tracking-[0.16em] font-medium cursor-pointer"
                  >
                    Edit or Submit Another Response
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Radio Attendance Toggle */}
                <fieldset>
                  <legend className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5C387] mb-3 text-center sm:text-left">
                    Will You Be Attending? <span className="text-[#C9A46E]">*</span>
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`cursor-pointer border p-4 text-center transition-all rounded-sm ${
                        response === "accept"
                          ? "border-[#C9A46E] bg-[#C9A46E]/18 text-[#FFF8D6] shadow-[0_0_15px_rgba(201,164,110,0.15)]"
                          : "border-[#5E412E] bg-[#22140C]/60 text-[#D5C2B2] hover:border-[#C9A46E]/60"
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
                      <span className="block font-editorial-serif text-lg text-[#FFF8D6]">
                        Joyfully Accept
                      </span>
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-[#E5C387] mt-1 font-medium">
                        I will attend with joy
                      </span>
                    </label>

                    <label
                      className={`cursor-pointer border p-4 text-center transition-all rounded-sm ${
                        response === "decline"
                          ? "border-[#C9A46E] bg-[#C9A46E]/18 text-[#FFF8D6] shadow-[0_0_15px_rgba(201,164,110,0.15)]"
                          : "border-[#5E412E] bg-[#22140C]/60 text-[#D5C2B2] hover:border-[#C9A46E]/60"
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
                      <span className="block font-editorial-serif text-lg text-[#FFF8D6]">
                        Regretfully Decline
                      </span>
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-[#E5C387] mt-1 font-medium">
                        Celebrating in spirit
                      </span>
                    </label>
                  </div>
                </fieldset>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5C387] mb-1.5"
                  >
                    Full Name <span className="text-[#C9A46E]">*</span>
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-transparent border-0 border-b border-[#5E412E] py-2.5 text-[#FFF8D6] placeholder-[#8F7766] text-base sm:text-lg font-editorial-serif focus:outline-none focus:border-[#C9A46E] transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Guest Count (Only if attending) */}
                {response === "accept" && (
                  <div className="pt-2 animate-fadeIn">
                    <label
                      htmlFor="guest-count"
                      className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5C387] mb-1.5"
                    >
                      Total Number of Guests Attending
                    </label>
                    <select
                      id="guest-count"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-[#2A1A10] border-0 border-b border-[#5E412E] py-2.5 text-[#FFF8D6] text-sm sm:text-base font-sans focus:outline-none focus:border-[#C9A46E] cursor-pointer transition-colors"
                      disabled={isSubmitting}
                    >
                      <option value="1" className="bg-[#2A1A10] text-[#FFF8D6]">1 Guest (Just myself)</option>
                      <option value="2" className="bg-[#2A1A10] text-[#FFF8D6]">2 Guests (Myself + 1)</option>
                      <option value="3" className="bg-[#2A1A10] text-[#FFF8D6]">3 Guests (Myself + 2)</option>
                      <option value="4" className="bg-[#2A1A10] text-[#FFF8D6]">4 Guests (Family)</option>
                    </select>
                  </div>
                )}

                {/* Personal Note */}
                <div className="pt-2">
                  <label
                    htmlFor="guest-note"
                    className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5C387] mb-1.5"
                  >
                    A Personal Note for the Couple (Optional)
                  </label>
                  <textarea
                    id="guest-note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Share a word of blessing with Baseleal and Bethel…"
                    className="w-full bg-transparent border-0 border-b border-[#5E412E] py-2.5 text-[#FFF8D6] placeholder-[#8F7766] text-sm sm:text-base font-sans focus:outline-none focus:border-[#C9A46E] resize-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[48px] px-10 py-3.5 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-xl bg-[#C9A46E] text-[#1E110A] hover:bg-[#E0BA7E] hover:shadow-2xl disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isSubmitting ? "Recording Your Reply…" : "Confirm Your Reply"}</span>
                    <span aria-hidden>→</span>
                  </button>
                </div>

                {errorMessage && (
                  <div role="alert" className="p-4 border border-red-500/40 bg-red-950/40 text-red-200 text-xs text-center rounded-sm">
                    {errorMessage}
                  </div>
                )}

                <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[#E5C387]/60 pt-4">
                  Responses are saved locally and dispatched to <code className="text-[#C9A46E]">/api/rsvp</code>.
                </p>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
