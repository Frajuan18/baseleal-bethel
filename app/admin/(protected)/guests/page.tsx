"use client";

import { useEffect, useState } from "react";
import { AdminTabShell } from "../_components/AdminTabShell";
import { Icon } from "@/app/components/dashboard/Icon";

type Guest = { _id: string; fullName: string; email?: string; invitation?: { invitationType?: string } | null; rsvp?: { attendanceStatus?: string; attendeeCount?: number } | null };

function getInvitationTypeLabel(type?: string) {
  if (!type) return "Not invited";
  switch (type) {
    case "CHURCH_ONLY":
      return "Church only";
    case "CHURCH_AND_BASSELEAL":
      return "Church + Basseleal's house";
    case "CHURCH_AND_BETHEL":
      return "Church + Bethel's house";
    case "CHURCH_AND_BOTH":
    case "CHURCH_AND_HOME":
      return "Church + Both houses";
    default:
      return type;
  }
}

export default function GuestsPage() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/guests?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setGuests(data.items || []))
      .catch(() => setGuests([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query]);

  return (
    <AdminTabShell
      active="/admin/guests"
      eyebrow="People"
      title="Guests & RSVPs"
      description="Search every guest, assigned venue directions, and response."
      action={
        <a
          href="/api/admin/guests/export"
          className="inline-flex min-h-[46px] items-center justify-center gap-2 self-start rounded-full bg-[#C2491A] px-5 text-xs font-semibold text-white transition hover:bg-[#A83E15] active:scale-[0.99] md:self-auto"
        >
          <Icon name="download" className="h-4 w-4" /> Export guest list
        </a>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Guest directory</h2>
          <p className="mt-0.5 text-xs text-[#6B6660]">{guests.length} records currently visible.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#736C64]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by guest name"
            type="search"
            className="h-11 w-full rounded-full border border-[#E1D9CF] bg-white pl-10 pr-4 text-base text-[#171717] outline-none transition placeholder:text-[#9A938B] focus:border-[#C9B79F] focus:ring-2 focus:ring-[#C2491A]/15 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#EDE9E2] bg-white">
        <div className="hidden grid-cols-[1.6fr_1.3fr_1fr_0.6fr] gap-4 border-b border-[#E7E2DB] bg-[#FBFAF8] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6660] md:grid">
          <span>Guest</span>
          <span>Invitation</span>
          <span>RSVP status</span>
          <span>Party</span>
        </div>
        {loading ? (
          <p className="px-5 py-12 text-center text-sm text-[#6B6660]">Loading guest records...</p>
        ) : guests.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-serif text-xl text-[#4A443E]">No guests match these filters.</p>
            <p className="mx-auto mt-1.5 max-w-[36ch] text-sm text-[#6B6660]">Try a different name, or clear the search.</p>
          </div>
        ) : (
          guests.map((guest) => <GuestRow key={guest._id} guest={guest} />)
        )}
      </div>
    </AdminTabShell>
  );
}

function GuestRow({ guest }: { guest: Guest }) {
  const status = guest.rsvp?.attendanceStatus;
  const party = guest.rsvp?.attendeeCount || 0;
  const attending = status === "ATTENDING";
  const declined = status === "NOT_ATTENDING";
  const statusClass = attending ? "bg-[#E7EFE5] text-[#4C6B48]" : declined ? "bg-[#F6E5DE] text-[#9B4A2C]" : "bg-[#F1EDE7] text-[#6A5D51]";
  const invite = getInvitationTypeLabel(guest.invitation?.invitationType);

  return (
    <div className="border-b border-[#F0EEEB] p-4 last:border-0 md:grid md:grid-cols-[1.6fr_1.3fr_1fr_0.6fr] md:items-center md:gap-4">
      <div className="flex items-start justify-between gap-3 md:block">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight">{guest.fullName}</p>
          <p className="mt-0.5 truncate text-xs text-[#6B6660]">{guest.email || "No contact recorded"}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold md:hidden ${statusClass}`}>
          {attending ? "Attending" : declined ? "Not attending" : "Pending"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 md:hidden">
        <span className="rounded-full bg-[#F3EFE9] px-2.5 py-1 text-[11px] font-medium text-[#6B6660]">{invite}</span>
        <span className="rounded-full bg-[#F3EFE9] px-2.5 py-1 text-[11px] font-medium text-[#6B6660]">
          {party} {party === 1 ? "guest" : "guests"}
        </span>
      </div>

      <span className="hidden text-xs font-medium text-[#6B6660] md:block">{invite}</span>
      <span className={`hidden w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold md:block ${statusClass}`}>
        {attending ? "Attending" : declined ? "Not attending" : "Pending"}
      </span>
      <span className="hidden text-xs font-medium text-[#6B6660] md:block">{party}</span>
    </div>
  );
}
