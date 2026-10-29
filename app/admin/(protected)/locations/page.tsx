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
};

export default function LocationsAdminPage() {
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
        setErrorMsg("Failed to load saved locations. Default config is displayed.");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      setErrorMsg("Failed to save location updates. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getMapsUrl = (venue: VenueData) => {
    if (venue.directionsUrl?.trim()) return venue.directionsUrl;
    if (venue.mapsQuery?.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address || "Addis Ababa")}`;
  };

  return (
    <AdminTabShell
      active="/admin/locations"
      eyebrow="Venues & Directions"
      title="Wedding Locations"
      description="Configure and update live Google Maps directions and addresses for the church and both homes."
      action={
        <button
          onClick={handleSubmit}
          disabled={saving || loading}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#C2491A] px-6 text-xs font-semibold text-white transition hover:bg-[#A83E15] active:scale-[0.99] disabled:opacity-60"
        >
          <Icon name="check" className="h-4 w-4" />
          {saving ? "Saving..." : "Save All Locations"}
        </button>
      }
    >
      {savedSuccess && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Icon name="check" className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Locations saved successfully! The wedding website and personalized invitations now reflect these addresses.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-[#736C64]">
          Loading location configurations...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Church Ceremony */}
          <section className="rounded-2xl border border-[#EDE9E2] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0ECE6] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2B1810] text-[#FAF6F0]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 2v4M10 4h4" />
                    <path d="M12 6L4 12v9h16v-9z" />
                    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#1E140E]">Church Ceremony Venue</h2>
                  <p className="text-xs text-[#8C6A3B]">Morning wedding ceremony (9:00 LT)</p>
                </div>
              </div>
              <a
                href={getMapsUrl(locations.church)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#DED2C2] bg-[#FAF5EE] px-3.5 py-1.5 text-xs font-semibold text-[#1E140E] transition hover:bg-white"
              >
                <Icon name="map-pin" className="h-3.5 w-3.5 text-[#8C6A3B]" />
                <span>Test in Google Maps ↗</span>
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
                  placeholder="ለምሳሌ፡ ሀልዎት አማኑኤል አጥቢያ ቤተክርስቲያን"
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
                  placeholder="ለምሳሌ፡ ሀልዎት አማኑኤል አጥቢያ ቤተክርስቲያን፣ አዲስ አበባ"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Google Maps Search Query or Coordinates
                </label>
                <input
                  type="text"
                  value={locations.church.mapsQuery}
                  onChange={(e) => handleChange("church", "mapsQuery", e.target.value)}
                  placeholder="e.g. Halwot Emmanuel Church, Addis Ababa, Ethiopia"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>
            </div>
          </section>

          {/* Card 2: Basseleal's house */}
          <section className="rounded-2xl border border-[#EDE9E2] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0ECE6] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2B1810] text-[#FAF6F0]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#1E140E]">Basseleal&apos;s House</h2>
                  <p className="text-xs text-[#8C6A3B]">Home reception venue (4:30 LT)</p>
                </div>
              </div>
              <a
                href={getMapsUrl(locations.basselealHome)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#DED2C2] bg-[#FAF5EE] px-3.5 py-1.5 text-xs font-semibold text-[#1E140E] transition hover:bg-white"
              >
                <Icon name="map-pin" className="h-3.5 w-3.5 text-[#8C6A3B]" />
                <span>Test in Google Maps ↗</span>
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
                  placeholder="Basseleal's house"
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
                  placeholder="የባስልኤል ቤት"
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
                  placeholder="e.g. Basseleal's house, Bole, Addis Ababa"
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
                  placeholder="ለምሳሌ፡ የባስልኤል ቤት፣ ቦሌ፣ አዲስ አበባ"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Google Maps Search Query or Coordinates
                </label>
                <input
                  type="text"
                  value={locations.basselealHome.mapsQuery}
                  onChange={(e) => handleChange("basselealHome", "mapsQuery", e.target.value)}
                  placeholder="e.g. Exact place name or GPS coordinates (9.0123, 38.7654)"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>
            </div>
          </section>

          {/* Card 3: Bethel's house */}
          <section className="rounded-2xl border border-[#EDE9E2] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0ECE6] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2B1810] text-[#FAF6F0]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#1E140E]">Bethel&apos;s House</h2>
                  <p className="text-xs text-[#8C6A3B]">Home reception venue (4:30 LT)</p>
                </div>
              </div>
              <a
                href={getMapsUrl(locations.bethelHome)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#DED2C2] bg-[#FAF5EE] px-3.5 py-1.5 text-xs font-semibold text-[#1E140E] transition hover:bg-white"
              >
                <Icon name="map-pin" className="h-3.5 w-3.5 text-[#8C6A3B]" />
                <span>Test in Google Maps ↗</span>
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
                  placeholder="Bethel's house"
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
                  placeholder="የቤቴል ቤት"
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
                  placeholder="e.g. Bethel's house, CMC, Addis Ababa"
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
                  placeholder="ለምሳሌ፡ የቤቴል ቤት፣ ሲኤምሲ፣ አዲስ አበባ"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Google Maps Search Query or Coordinates
                </label>
                <input
                  type="text"
                  value={locations.bethelHome.mapsQuery}
                  onChange={(e) => handleChange("bethelHome", "mapsQuery", e.target.value)}
                  placeholder="e.g. Exact place name or GPS coordinates (9.0234, 38.8765)"
                  className="h-11 w-full rounded-xl border border-[#E1D9CF] bg-[#FBFAF8] px-3.5 text-sm outline-none transition focus:border-[#C2491A] focus:ring-2 focus:ring-[#C2491A]/15"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#C2491A] px-7 text-xs font-semibold text-white transition hover:bg-[#A83E15] active:scale-[0.99] disabled:opacity-60"
            >
              <Icon name="check" className="h-4 w-4" />
              {saving ? "Saving locations..." : "Save All Locations"}
            </button>
          </div>
        </form>
      )}
    </AdminTabShell>
  );
}
