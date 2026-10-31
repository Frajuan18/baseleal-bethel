"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AdminTabShell } from "../_components/AdminTabShell";
import { Icon } from "@/app/components/dashboard/Icon";

type VenueData = {
  label: string;
  labelAm: string;
  address: string;
  addressAm: string;
  mapsQuery: string;
  directionsUrl?: string;
  note?: string;
  noteAm?: string;
};

type LocationsData = {
  church: VenueData;
  basselealHome: VenueData;
  bethelHome: VenueData;
};

const emptyVenue: VenueData = {
  label: "",
  labelAm: "",
  address: "",
  addressAm: "",
  mapsQuery: "",
  directionsUrl: "",
  note: "",
  noteAm: "",
};

export default function DirectionsAdminPage() {
  const [locations, setLocations] = useState<LocationsData>({
    church: { ...emptyVenue },
    basselealHome: { ...emptyVenue },
    bethelHome: { ...emptyVenue },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.locations) {
          setLocations(data.locations);
        }
      })
      .catch(() => {
        setErrorMsg("Failed to load saved directions. Default settings are displayed.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    venue: "church" | "basselealHome" | "bethelHome",
    field: keyof VenueData,
    value: string
  ) => {
    setLocations((prev) => ({
      ...prev,
      [venue]: {
        ...prev[venue],
        [field]: value,
      },
    }));
    setSavedSuccess(false);
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locations),
      });

      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (data.locations) {
        setLocations(data.locations);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch {
      setErrorMsg("Failed to save directions updates. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getMapsUrl = (venue: VenueData) => {
    if (venue.directionsUrl?.trim()) return venue.directionsUrl.trim();
    if (venue.mapsQuery?.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery.trim())}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address || "Addis Ababa")}`;
  };

  return (
    <AdminTabShell
      active="/admin/directions"
      eyebrow="Venues & Navigation"
      title="Wedding Directions"
      description="Manage live Google Maps links, addresses, and route instructions for the church ceremony and both homes. Updates are stored in the database and instantly accessible on the wedding website."
      action={
        <button
          onClick={() => handleSubmit()}
          disabled={saving || loading}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#C2491A] px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-[#A83E15] active:scale-[0.99] disabled:opacity-60"
        >
          <Icon name="check" className="h-4 w-4" />
          {saving ? "Saving to Database..." : "Save All Directions"}
        </button>
      }
    >
      {savedSuccess && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-xs">
          <Icon name="check" className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Directions updated and saved to the database successfully! The live website and all guest invitations now reflect these directions.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-xs">
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-[#736C64]">
          Loading directions from database...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Church Ceremony */}
          <section className="rounded-2xl border border-[#EDE9E2] bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0ECE6] pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#2B1810] text-[#FAF6F0] shadow-inner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 2v4M10 4h4" />
                    <path d="M12 6L4 12v9h16v-9z" />
                    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#1E140E]">1. Church Ceremony Directions</h2>
                  <p className="text-xs text-[#8C6A3B]">Morning wedding service & vows (9:00 LT / 3:00 Ethiopian Time)</p>
                </div>
              </div>
              <a
                href={getMapsUrl(locations.church)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#DED2C2] bg-[#FAF5EE] px-4 py-2 text-xs font-semibold text-[#1E140E] transition hover:bg-white hover:border-[#8C6A3B]"
              >
                <Icon name="map-pin" className="h-3.5 w-3.5 text-[#8C6A3B]" />
                <span>Test Link in Google Maps ↗</span>
              </a>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Church Name (English)
                </label>
                <input
                  type="text"
                  value={locations.church.label}
                  onChange={(e) => handleChange("church", "label", e.target.value)}
                  placeholder="e.g. Halwot Emmanuel Church"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  የቤተክርስቲያን ስም (Amharic)
                </label>
                <input
                  type="text"
                  value={locations.church.labelAm}
                  onChange={(e) => handleChange("church", "labelAm", e.target.value)}
                  placeholder="ለምሳሌ፡ ህልዎት አማኑኤል ቤተክርስቲያን"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Church Address (English)
                </label>
                <input
                  type="text"
                  value={locations.church.address}
                  onChange={(e) => handleChange("church", "address", e.target.value)}
                  placeholder="e.g. Halwot Emmanuel Church, Addis Ababa, Ethiopia"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  የቤተክርስቲያን አድራሻ (Amharic)
                </label>
                <input
                  type="text"
                  value={locations.church.addressAm}
                  onChange={(e) => handleChange("church", "addressAm", e.target.value)}
                  placeholder="ለምሳሌ፡ ህልዎት አማኑኤል ቤተክርስቲያን፣ አዲስ አበባ፣ ኢትዮጵያ"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Direct Google Maps Navigation Link (Share URL)
                </label>
                <input
                  type="url"
                  value={locations.church.directionsUrl || ""}
                  onChange={(e) => handleChange("church", "directionsUrl", e.target.value)}
                  placeholder="e.g. https://maps.app.goo.gl/..."
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
                <span className="mt-1 block text-[11px] text-[#8C6A3B]">
                  Direct URL opened when guests tap &ldquo;Open in Maps&rdquo; on the site.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Google Maps Search Query or GPS Coordinates
                </label>
                <input
                  type="text"
                  value={locations.church.mapsQuery}
                  onChange={(e) => handleChange("church", "mapsQuery", e.target.value)}
                  placeholder="e.g. Halwot Emmanuel Church, Addis Ababa or 9.0123, 38.7654"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
                <span className="mt-1 block text-[11px] text-[#8C6A3B]">
                  Fallback search query if direct URL is left empty.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Driving Directions &amp; Landmark Instructions (English)
                </label>
                <textarea
                  rows={3}
                  value={locations.church.note || ""}
                  onChange={(e) => handleChange("church", "note", e.target.value)}
                  placeholder="e.g. Morning service begins at 9:00 AM (3:00 LT). Parking is available in the main church compound."
                  className="w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] p-3 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  የመድረሻ አቅጣጫ እና መለያ ምልክት (Amharic)
                </label>
                <textarea
                  rows={3}
                  value={locations.church.noteAm || ""}
                  onChange={(e) => handleChange("church", "noteAm", e.target.value)}
                  placeholder="ለምሳሌ፡ የጧቱ ስነ-ስርዓት ከጠዋቱ 3:00 (9:00 LT) ይጀምራል። በቤተክርስቲያኑ ግቢ ውስጥ ሰፊ የመኪና ማቆሚያ ተዘጋጅቷል።"
                  className="w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] p-3 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>
            </div>
          </section>

          {/* Card 2: Basseleal's House */}
          <section className="rounded-2xl border border-[#EDE9E2] bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0ECE6] pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#2B1810] text-[#FAF6F0] shadow-inner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#1E140E]">2. Basseleal&apos;s House Directions</h2>
                  <p className="text-xs text-[#8C6A3B]">Home reception celebration (4:30 LT / 10:30 Ethiopian Time)</p>
                </div>
              </div>
              <a
                href={getMapsUrl(locations.basselealHome)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#DED2C2] bg-[#FAF5EE] px-4 py-2 text-xs font-semibold text-[#1E140E] transition hover:bg-white hover:border-[#8C6A3B]"
              >
                <Icon name="map-pin" className="h-3.5 w-3.5 text-[#8C6A3B]" />
                <span>Test Link in Google Maps ↗</span>
              </a>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Home Name (English)
                </label>
                <input
                  type="text"
                  value={locations.basselealHome.label}
                  onChange={(e) => handleChange("basselealHome", "label", e.target.value)}
                  placeholder="e.g. Basseleal's house"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  የቤት ስም (Amharic)
                </label>
                <input
                  type="text"
                  value={locations.basselealHome.labelAm}
                  onChange={(e) => handleChange("basselealHome", "labelAm", e.target.value)}
                  placeholder="ለምሳሌ፡ የባስልኤል ቤት"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Exact Address (English)
                </label>
                <input
                  type="text"
                  value={locations.basselealHome.address}
                  onChange={(e) => handleChange("basselealHome", "address", e.target.value)}
                  placeholder="e.g. Basseleal's house, Addis Ababa, Ethiopia"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  ትክክለኛ አድራሻ (Amharic)
                </label>
                <input
                  type="text"
                  value={locations.basselealHome.addressAm}
                  onChange={(e) => handleChange("basselealHome", "addressAm", e.target.value)}
                  placeholder="ለምሳሌ፡ የባስልኤል ቤት፣ አዲስ አበባ፣ ኢትዮጵያ"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Direct Google Maps Navigation Link (Share URL)
                </label>
                <input
                  type="url"
                  value={locations.basselealHome.directionsUrl || ""}
                  onChange={(e) => handleChange("basselealHome", "directionsUrl", e.target.value)}
                  placeholder="e.g. https://maps.app.goo.gl/..."
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Google Maps Search Query or GPS Coordinates
                </label>
                <input
                  type="text"
                  value={locations.basselealHome.mapsQuery}
                  onChange={(e) => handleChange("basselealHome", "mapsQuery", e.target.value)}
                  placeholder="e.g. Exact place name or coordinates (9.0123, 38.7654)"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Driving Directions &amp; Landmark Instructions (English)
                </label>
                <textarea
                  rows={3}
                  value={locations.basselealHome.note || ""}
                  onChange={(e) => handleChange("basselealHome", "note", e.target.value)}
                  placeholder="e.g. Afternoon reception begins at 4:30 PM (10:30 LT). Follow the wedding signage after turning into the residential road."
                  className="w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] p-3 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  የመድረሻ አቅጣጫ እና መለያ ምልክት (Amharic)
                </label>
                <textarea
                  rows={3}
                  value={locations.basselealHome.noteAm || ""}
                  onChange={(e) => handleChange("basselealHome", "noteAm", e.target.value)}
                  placeholder="ለምሳሌ፡ የከሰዓቱ የቤት ዝግጅት ከቀኑ 10:30 (4:30 LT) ጀምሮ ይካሄዳል። አካባቢው ሲደርሱ የሰርግ መመሪያ ምልክቶችን ይከተሉ።"
                  className="w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] p-3 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>
            </div>
          </section>

          {/* Card 3: Bethel's House */}
          <section className="rounded-2xl border border-[#EDE9E2] bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0ECE6] pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#2B1810] text-[#FAF6F0] shadow-inner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#1E140E]">3. Bethel&apos;s House Directions</h2>
                  <p className="text-xs text-[#8C6A3B]">Home reception celebration (4:30 LT / 10:30 Ethiopian Time)</p>
                </div>
              </div>
              <a
                href={getMapsUrl(locations.bethelHome)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#DED2C2] bg-[#FAF5EE] px-4 py-2 text-xs font-semibold text-[#1E140E] transition hover:bg-white hover:border-[#8C6A3B]"
              >
                <Icon name="map-pin" className="h-3.5 w-3.5 text-[#8C6A3B]" />
                <span>Test Link in Google Maps ↗</span>
              </a>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Home Name (English)
                </label>
                <input
                  type="text"
                  value={locations.bethelHome.label}
                  onChange={(e) => handleChange("bethelHome", "label", e.target.value)}
                  placeholder="e.g. Bethel's house"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  የቤት ስም (Amharic)
                </label>
                <input
                  type="text"
                  value={locations.bethelHome.labelAm}
                  onChange={(e) => handleChange("bethelHome", "labelAm", e.target.value)}
                  placeholder="ለምሳሌ፡ የቤቴል ቤት"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Exact Address (English)
                </label>
                <input
                  type="text"
                  value={locations.bethelHome.address}
                  onChange={(e) => handleChange("bethelHome", "address", e.target.value)}
                  placeholder="e.g. Bethel's house, Addis Ababa, Ethiopia"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  ትክክለኛ አድራሻ (Amharic)
                </label>
                <input
                  type="text"
                  value={locations.bethelHome.addressAm}
                  onChange={(e) => handleChange("bethelHome", "addressAm", e.target.value)}
                  placeholder="ለምሳሌ፡ የቤቴል ቤት፣ አዲስ አበባ፣ ኢትዮጵያ"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Direct Google Maps Navigation Link (Share URL)
                </label>
                <input
                  type="url"
                  value={locations.bethelHome.directionsUrl || ""}
                  onChange={(e) => handleChange("bethelHome", "directionsUrl", e.target.value)}
                  placeholder="e.g. https://maps.app.goo.gl/..."
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Google Maps Search Query or GPS Coordinates
                </label>
                <input
                  type="text"
                  value={locations.bethelHome.mapsQuery}
                  onChange={(e) => handleChange("bethelHome", "mapsQuery", e.target.value)}
                  placeholder="e.g. Exact place name or coordinates (9.0234, 38.8765)"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Driving Directions &amp; Landmark Instructions (English)
                </label>
                <textarea
                  rows={3}
                  value={locations.bethelHome.note || ""}
                  onChange={(e) => handleChange("bethelHome", "note", e.target.value)}
                  placeholder="e.g. Afternoon reception begins at 4:30 PM (10:30 LT). Follow the wedding signage after turning into the residential road."
                  className="w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] p-3 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  የመድረሻ አቅጣጫ እና መለያ ምልክት (Amharic)
                </label>
                <textarea
                  rows={3}
                  value={locations.bethelHome.noteAm || ""}
                  onChange={(e) => handleChange("bethelHome", "noteAm", e.target.value)}
                  placeholder="ለምሳሌ፡ የከሰዓቱ የቤት ዝግጅት ከቀኑ 10:30 (4:30 LT) ጀምሮ ይካሄዳል። አካባቢው ሲደርሱ የሰርግ መመሪያ ምልክቶችን ይከተሉ።"
                  className="w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] p-3 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#C2491A] px-8 text-xs font-semibold text-white shadow-sm transition hover:bg-[#A83E15] active:scale-[0.99] disabled:opacity-60"
            >
              <Icon name="check" className="h-4 w-4" />
              {saving ? "Saving to Database..." : "Save All Directions"}
            </button>
          </div>
        </form>
      )}
    </AdminTabShell>
  );
}
