"use client";

import { FormEvent, useState } from "react";
import { coupleName } from "@/config/wedding";

interface WishItem {
  id: string;
  name: string;
  relationship: string;
  message: string;
  date: string;
}

const defaultWishes: WishItem[] = [
  {
    id: "wish-1",
    name: "Ephraim & Sara",
    relationship: "Family & Parents",
    message:
      "May God bless this sacred union beyond measure. As you build your life together upon Christ the solid rock, may your home overflow with peace, honor, and everlasting joy.",
    date: "October 12, 2026",
  },
  {
    id: "wish-2",
    name: "Selamawit T.",
    relationship: "Maid of Honour & Lifelong Friend",
    message:
      "Watching your love story blossom from the start has been the greatest gift. Bethel and Baseleal, your kindness and devotion inspire everyone around you. Can't wait to dance and rejoice with you both!",
    date: "October 14, 2026",
  },
];

export function WishesSection() {
  const [wishes, setWishes] = useState<WishItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bb_wedding_wishes");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Local storage unavailable
      }
    }
    return defaultWishes;
  });

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("Friend");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      // Simulate real network request to an optional API endpoint
      const newWish: WishItem = {
        id: `wish-${Date.now()}`,
        name: name.trim(),
        relationship: relationship || "Guest",
        message: message.trim(),
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };

      // Try sending to local API route /api/wishes if available
      try {
        await fetch("/api/wishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWish),
        }).catch(() => {
          // If server API route is not running in full backend mode, continue with local client storage
        });
      } catch {
        // Fallback gracefully
      }

      // Persist to local state & localStorage
      const updated = [newWish, ...wishes];
      setWishes(updated);
      try {
        localStorage.setItem("bb_wedding_wishes", JSON.stringify(updated));
      } catch {
        // Ignore quota/disabled storage
      }

      setName("");
      setMessage("");
      setRelationship("Friend");
      setStatusMessage({
        type: "success",
        text: "Thank you from our hearts! Your heartfelt wish and prayer have been added to our guestbook.",
      });
    } catch {
      setStatusMessage({
        type: "error",
        text: "There was a momentary difficulty saving your blessing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="wishes"
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden border-t border-b border-[#D8DFE8]"
      style={{
        background: "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 22%, #EFF2F6 48%, #FFFFFF 72%, #F1F4F8 100%)",
      }}
    >
      {/* Metallic White Specular Luster & Ambient Lighting Overlays */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80 select-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(255, 255, 255, 0.95), transparent 70%), radial-gradient(ellipse 70% 45% at 85% 100%, rgba(215, 226, 238, 0.4), transparent 70%), linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.6) 48%, rgba(225, 235, 245, 0.35) 52%, transparent 65%)",
        }}
        aria-hidden
      />
      {/* Subtle Brushed Metal Surface Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay select-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='metallicGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -0.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23metallicGrain)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="eyebrow text-[#8C6A3B] mb-2.5 tracking-[0.24em] font-semibold">
            Guestbook &amp; Blessings
          </p>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#2B1810]">
            Leave Us a Little Love
          </h2>
          <div className="h-px w-16 bg-[#8C6A3B]/40 mx-auto mt-5 mb-5" />
          <p className="text-sm sm:text-base text-[#5A4A40] leading-relaxed">
            Your prayers, blessings, and cherished memories will accompany us into our marriage. Please share a word of love with us.
          </p>
        </div>

        {/* 2-Column: Left Make a Wish Card (Postage Stamp Border), Right Living Guestbook */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Make a Wish Card with Reference Image Perforated Stamp Border */}
          <div className="lg:col-span-6">
            <div className="filter drop-shadow-[0_18px_38px_rgba(43,24,16,0.08)]">
              {/* Outer Postage Stamp Card (Perforated Scalloped Outer Edge) */}
              <div className="postage-stamp-card bg-[#FAF8F5]">
                {/* Double Inset Border Frame (Matches Reference Image Exactly) */}
                <div className="m-4 sm:m-6 md:m-8 border border-[#DDD6CA] p-1 sm:p-1.5">
                  <div className="border border-[#E7E1D6] p-6 sm:p-9 md:p-11 relative bg-[#FAF8F5]/80">
                    <span className="absolute top-4 right-4 text-[#8C6A3B] text-xs">✦</span>

                    <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#2B1810] mb-1.5">
                      Make a Wish &amp; Blessing
                    </h3>
                    <p className="text-xs text-[#8C6A3B] mb-7 uppercase tracking-[0.16em] font-medium">
                      For {coupleName}
                    </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="wish-name"
                        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2B1810] mb-1"
                      >
                        Your Full Name <span className="text-[#8C6A3B]">*</span>
                      </label>
                      <input
                        id="wish-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Samuel &amp; Ruth"
                        className="editorial-input"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="wish-relation"
                        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2B1810] mb-1"
                      >
                        Relationship to the Couple
                      </label>
                      <select
                        id="wish-relation"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="editorial-input bg-transparent cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <option value="Friend">Cherished Friend</option>
                        <option value="Family">Family Member</option>
                        <option value="Church Community">Church Community / Fellowship</option>
                        <option value="Colleague">Colleague / Mentor</option>
                        <option value="Well-wisher">Warm Well-wisher</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="wish-message"
                        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2B1810] mb-1"
                      >
                        Your Blessing, Prayer, or Memory <span className="text-[#8C6A3B]">*</span>
                      </label>
                      <textarea
                        id="wish-message"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Speak from your heart…"
                        className="editorial-input resize-none"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-editorial w-full sm:w-auto disabled:opacity-50"
                      >
                        <span>{isSubmitting ? "Sending Blessing…" : "Send With Love"}</span>
                        <span aria-hidden>→</span>
                      </button>
                    </div>

                    {statusMessage && (
                      <div
                        role="status"
                        className={`p-4 border text-xs sm:text-sm leading-relaxed ${
                          statusMessage.type === "success"
                            ? "bg-[#FAF8F5] border-[#8C6A3B] text-[#2B1810]"
                            : "bg-red-50 border-red-200 text-red-800"
                        }`}
                      >
                        {statusMessage.text}
                      </div>
                    )}
                  </form>

                  <p className="mt-8 pt-4 border-t border-[#EAE4DC] text-[10px] text-[#7A6B60] leading-normal uppercase tracking-[0.14em]">
                    Wishes submitted here are displayed immediately and saved locally. Connect an external database (Supabase / Postgres) via <code className="text-[#2B1810]">/api/wishes</code> for multi-device sync.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Right Column: Recent Wishes & Blessings Stream */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFE8]">
              <h3 className="font-editorial-serif text-2xl text-[#2B1810]">
                Recent Blessings ({wishes.length})
              </h3>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6A3B] font-semibold">
                Live Guestbook
              </span>
            </div>

            <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2">
              {wishes.map((item) => (
                <article
                  key={item.id}
                  className="bg-white/85 backdrop-blur-xs border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] rounded-sm transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div>
                      <h4 className="font-editorial-serif text-lg text-[#2B1810] font-normal">
                        {item.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-[#8C6A3B] font-semibold">
                        {item.relationship}
                      </span>
                    </div>
                    <time className="text-[10px] text-[#7A6B60] uppercase tracking-[0.15em]">
                      {item.date}
                    </time>
                  </div>
                  <p className="font-editorial-serif italic text-base text-[#2B1810]/85 leading-relaxed">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </article>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
