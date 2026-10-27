"use client";

import { useEffect, useState } from "react";
import { AdminTabShell } from "../_components/AdminTabShell";

type Guest = { _id: string; fullName: string; email?: string; invitation?: { invitationType?: string } | null; rsvp?: { attendanceStatus?: string; attendeeCount?: number } | null };

export default function GuestsPage() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const controller = new AbortController(); fetch(`/api/admin/guests?q=${encodeURIComponent(query)}`, { signal: controller.signal }).then((r) => r.ok ? r.json() : Promise.reject()).then((data) => setGuests(data.items || [])).catch(() => setGuests([])).finally(() => setLoading(false)); return () => controller.abort(); }, [query]);
  return <AdminTabShell active="/admin/guests" eyebrow="People" title="Guests & RSVPs" description="Search every guest, invitation permission, and response." action={<a href="/api/admin/guests/export" className="rounded-full bg-[#E85A0C] px-4 py-2.5 text-xs font-semibold text-white">Export guest list</a>}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-base font-semibold">Guest directory</h2><p className="mt-1 text-xs text-[#777774]">{guests.length} records currently visible.</p></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by guest name" className="w-full max-w-xs rounded-full border-0 bg-white px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#A58B68]/30" /></div><div className="mt-5 overflow-hidden rounded-2xl bg-white"><div className="hidden grid-cols-[1.5fr_1fr_1fr_0.7fr] gap-4 border-b border-[#E7E5E1] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#999690] sm:grid"><span>Guest</span><span>Invitation</span><span>RSVP status</span><span>People</span></div>{loading ? <p className="px-5 py-14 text-center text-sm text-[#999690]">Loading guest records…</p> : guests.length === 0 ? <p className="px-5 py-14 text-center font-serif text-xl text-[#65564D]">No guests match these filters.</p> : guests.map((guest) => <GuestRow key={guest._id} guest={guest} />)}</div></AdminTabShell>;
}

function GuestRow({ guest }: { guest: Guest }) { const status = guest.rsvp?.attendanceStatus; const statusClass = status === "ATTENDING" ? "bg-[#E8F0E7] text-[#537452]" : status === "NOT_ATTENDING" ? "bg-[#F3E7E3] text-[#925A4D]" : "bg-[#F1EEE9] text-[#988B7F]"; return <div className="grid gap-2 border-b border-[#F0EEEB] px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1fr_1fr_0.7fr] sm:items-center sm:gap-4"><div><p className="text-sm font-medium">{guest.fullName}</p><p className="mt-1 text-xs text-[#A09B94]">{guest.email || "No contact recorded"}</p></div><span className="text-xs text-[#777774]">{guest.invitation?.invitationType === "CHURCH_ONLY" ? "Church only" : guest.invitation ? "Church + home" : "Not invited"}</span><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass}`}>{status === "ATTENDING" ? "Attending" : status === "NOT_ATTENDING" ? "Not attending" : "Pending"}</span><span className="text-xs text-[#777774]">{guest.rsvp?.attendeeCount || 0}</span></div>; }

