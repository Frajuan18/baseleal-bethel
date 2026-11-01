"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminTabShell } from "../_components/AdminTabShell";
import { Icon } from "@/app/components/dashboard/Icon";
import { InviteLinkActions } from "@/app/components/dashboard/InviteLinkActions";
import {
  getInvitationTypeLabel,
  venuesToInvitationType,
  type VenueSelection,
} from "@/app/lib/venues";

type Invitation = {
  _id: string;
  createdAt: string;
  invitationType: string;
  status: string;
  shareUrl?: string;
  guestId?: { fullName?: string };
};

export default function InvitationsPage() {
  const [items, setItems] = useState<Invitation[]>([]);
  const [name, setName] = useState("");
  const [venues, setVenues] = useState<VenueSelection>({
    church: true,
    basseleal: false,
    bethel: false,
  });
  const [created, setCreated] = useState<{ url: string; guestName?: string } | null>(null);
  const [venueError, setVenueError] = useState<string | null>(null);

  const toggleVenue = (key: keyof VenueSelection) => {
    setVenueError(null);
    setVenues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const load = () =>
    fetch("/api/admin/invitations")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]));

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!venues.church && !venues.basseleal && !venues.bethel) {
      setVenueError("Please select at least one venue (Church, Basseleal's house, or Bethel's house).");
      return;
    }
    setVenueError(null);
    const invitationType = venuesToInvitationType(venues);
    const response = await fetch("/api/admin/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name, invitationType }),
    });
    if (response.ok) {
      const data = await response.json();
      setCreated({ url: data.invitation.url, guestName: data.invitation.guestName });
      setName("");
      load();
    }
  }

  async function revoke(id: string) {
    if (!window.confirm("Revoke this invitation link?")) return;
    await fetch(`/api/admin/invitations/${id}/revoke`, { method: "POST" });
    load();
  }

  async function createLink(id: string) {
    if (!window.confirm("Create a shareable link? Any previously issued link for this guest will stop working.")) return;
    const response = await fetch(`/api/admin/invitations/${id}/link`, { method: "POST" });
    if (response.ok) load();
  }

  return (
    <AdminTabShell
      active="/admin/invitations"
      eyebrow="Access control"
      title="Invitation links"
      description="Create, assign venue directions (church & homes), and revoke personalised wedding access."
    >
      <form onSubmit={submit} className="flex flex-col gap-3.5 rounded-2xl border border-[#EDE9E2] bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <label htmlFor="admin-inv-name" className="sr-only">
            Guest full name
          </label>
          <input
            id="admin-inv-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Guest full name (e.g. Abebe Bikila)"
            className="h-11 flex-1 w-full rounded-full border border-[#E1D9CF] bg-[#FBFAF8] px-4 text-base outline-none transition placeholder:text-[#9A938B] focus:border-[#C9B79F] focus:ring-2 focus:ring-[#C2491A]/15 sm:text-sm"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#C2491A] px-6 text-xs font-semibold text-white transition hover:bg-[#A83E15] active:scale-[0.99] shrink-0"
          >
            <Icon name="plus" className="h-4 w-4" /> Generate link
          </button>
        </div>

        {/* 3-Button Selector to Click & Unclick Any Combination */}
        <div className="border-t border-[#F0EBE3] pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6660]">
              Select Venues for Guest (Click to Toggle Combination):
            </span>
            <span className="text-[11px] font-medium text-[#8C6A3B]">
              {getInvitationTypeLabel(venuesToInvitationType(venues))}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Church */}
            <button
              type="button"
              onClick={() => toggleVenue("church")}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                venues.church
                  ? "border-[#2B1810] bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                  : "border-[#E1D9CF] bg-[#FBFAF8] text-[#554F48] hover:border-[#8C6A3B]/50 hover:bg-[#F6F2EC]"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  venues.church ? "bg-white/20 text-white" : "bg-[#EDE6DC] text-[#7A6A58]"
                }`}
              >
                {venues.church ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M10 4h4" />
                    <path d="M12 6L4 12v9h16v-9z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-tight">Church Ceremony</p>
                <p className={`text-[10px] mt-0.5 truncate ${venues.church ? "text-[#E6C687]" : "text-[#8C6A3B]"}`}>
                  ሀልዎት አማኑኤል (3:00 PM)
                </p>
              </div>
            </button>

            {/* 2. Basseleal's House */}
            <button
              type="button"
              onClick={() => toggleVenue("basseleal")}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                venues.basseleal
                  ? "border-[#2B1810] bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                  : "border-[#E1D9CF] bg-[#FBFAF8] text-[#554F48] hover:border-[#8C6A3B]/50 hover:bg-[#F6F2EC]"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  venues.basseleal ? "bg-white/20 text-white" : "bg-[#EDE6DC] text-[#7A6A58]"
                }`}
              >
                {venues.basseleal ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-tight">Basseleal&apos;s House</p>
                <p className={`text-[10px] mt-0.5 truncate ${venues.basseleal ? "text-[#E6C687]" : "text-[#8C6A3B]"}`}>
                  የባስልኤል ቤት (10:30 AM)
                </p>
              </div>
            </button>

            {/* 3. Bethel's House */}
            <button
              type="button"
              onClick={() => toggleVenue("bethel")}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                venues.bethel
                  ? "border-[#2B1810] bg-[#2B1810] text-[#FAF6F0] shadow-sm"
                  : "border-[#E1D9CF] bg-[#FBFAF8] text-[#554F48] hover:border-[#8C6A3B]/50 hover:bg-[#F6F2EC]"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  venues.bethel ? "bg-white/20 text-white" : "bg-[#EDE6DC] text-[#7A6A58]"
                }`}
              >
                {venues.bethel ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-tight">Bethel&apos;s House</p>
                <p className={`text-[10px] mt-0.5 truncate ${venues.bethel ? "text-[#E6C687]" : "text-[#8C6A3B]"}`}>
                  የቤቴል ቤት (10:30 AM)
                </p>
              </div>
            </button>
          </div>
          {venueError && (
            <p className="mt-2 text-xs font-semibold text-rose-600 animate-fadeIn">
              ⚠️ {venueError}
            </p>
          )}
        </div>
      </form>

      {created && <CreatedLink url={created.url} guestName={created.guestName} />}

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#EDE9E2] bg-white">
        <div className="hidden grid-cols-[1.4fr_1.3fr_0.8fr_auto] gap-4 border-b border-[#E7E2DB] bg-[#FBFAF8] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6660] md:grid">
          <span>Guest</span>
          <span>Permission</span>
          <span>Status</span>
          <span />
        </div>
        {items.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-serif text-xl text-[#4A443E]">No invitation links yet.</p>
            <p className="mx-auto mt-1.5 max-w-[38ch] text-sm text-[#6B6660]">Generate a link above to share personalised access.</p>
          </div>
        ) : (
          items.map((item) => <InvitationRow key={item._id} item={item} revoke={revoke} createLink={createLink} />)
        )}
      </div>
    </AdminTabShell>
  );
}

function CreatedLink({ url, guestName }: { url: string; guestName?: string }) {
  const absolute = typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;
  return (
    <div className="mt-3 rounded-2xl border border-[#D9E4D5] bg-[#EFF5EC] p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4C6B48]">
        Invitation created {guestName ? `for ${guestName}` : ""}
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs text-[#4A443E]">{absolute}</p>
        <InviteLinkActions url={url} guestName={guestName} />
      </div>
    </div>
  );
}

function InvitationRow({ item, revoke, createLink }: { item: Invitation; revoke: (id: string) => void; createLink: (id: string) => void }) {
  const active = item.status === "ACTIVE";
  const statusClass = active ? "bg-[#E7EFE5] text-[#4C6B48]" : "bg-[#F6E5DE] text-[#9B4A2C]";

  return (
    <div className="border-b border-[#F0EEEB] p-4 last:border-0 md:grid md:grid-cols-[1.4fr_1.3fr_0.8fr_auto] md:items-center md:gap-4">
      <div className="flex items-start justify-between gap-3 md:block">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.guestId?.fullName || "Guest"}</p>
          <p className="mt-0.5 text-xs text-[#6B6660]">Created {new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold md:hidden ${statusClass}`}>{item.status}</span>
      </div>

      <span className="mt-2 inline-flex w-fit rounded-full bg-[#F3EFE9] px-2.5 py-1 text-[11px] font-medium text-[#6B6660] md:mt-0">
        {getInvitationTypeLabel(item.invitationType)}
      </span>

      <span className={`hidden w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold md:block ${statusClass}`}>{item.status}</span>

      <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0 md:justify-end">
        {item.shareUrl ? (
          <InviteLinkActions url={item.shareUrl} guestName={item.guestId?.fullName} />
        ) : (
          active && (
            <button
              type="button"
              onClick={() => createLink(item._id)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#171717] px-4 text-xs font-semibold text-white transition hover:bg-[#2C2A27] active:scale-[0.98]"
            >
              <Icon name="link" className="h-4 w-4" /> Create link
            </button>
          )
        )}
        {active && (
          <button
            type="button"
            onClick={() => revoke(item._id)}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#D8D0C7] px-4 text-xs font-semibold text-[#765D4D] transition hover:bg-[#F6F1EA] active:scale-[0.98]"
          >
            Revoke
          </button>
        )}
      </div>
    </div>
  );
}
