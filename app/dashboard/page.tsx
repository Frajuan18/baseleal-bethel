"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Tab = "overview" | "guests" | "wishes" | "invitations";
type Stats = { total: number; attending: number; notAttending: number; pending: number; church: number; home: number };
type Guest = { _id: string; fullName: string; email?: string; invitation?: { invitationType?: string } | null; rsvp?: { attendanceStatus?: string; attendeeCount?: number } | null };
type Wish = { _id: string; message: string; createdAt: string; guestId?: { fullName?: string } };
type Invitation = { _id: string; createdAt: string; invitationType: string; status: string; guestId?: { fullName?: string } };

const emptyStats: Stats = { total: 0, attending: 0, notAttending: 0, pending: 0, church: 0, home: 0 };
const tabs: Array<[Tab, string, string]> = [["overview", "Overview", "⌂"], ["guests", "Guests", "♧"], ["wishes", "Wishes", "♡"], ["invitations", "Links", "↗"]];

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [recent, setRecent] = useState<Array<{ _id: string; updatedAt?: string; attendanceStatus?: string; guestId?: { fullName?: string }; invitationId?: { invitationType?: string } }>>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("CHURCH_ONLY");
  const [created, setCreated] = useState("");
  const [error, setError] = useState(false);

  const refresh = async () => {
    const results = await Promise.allSettled([
      fetch("/api/admin/dashboard/stats").then((r) => r.ok ? r.json() : Promise.reject()),
      fetch("/api/admin/guests").then((r) => r.ok ? r.json() : Promise.reject()),
      fetch("/api/admin/wishes").then((r) => r.ok ? r.json() : Promise.reject()),
      fetch("/api/admin/invitations").then((r) => r.ok ? r.json() : Promise.reject()),
    ]);
    const [statsResult, guestsResult, wishesResult, invitationsResult] = results;
    if (statsResult.status === "fulfilled") { setStats(statsResult.value.stats || emptyStats); setRecent(statsResult.value.recent || []); }
    if (guestsResult.status === "fulfilled") setGuests(guestsResult.value.items || []);
    if (wishesResult.status === "fulfilled") setWishes(wishesResult.value.items || []);
    if (invitationsResult.status === "fulfilled") setInvitations(invitationsResult.value.items || []);
    setError(results.some((result) => result.status === "rejected"));
  };

  useEffect(() => { refresh(); }, []);

  const filteredGuests = useMemo(() => guests.filter((guest) => guest.fullName.toLowerCase().includes(query.toLowerCase())), [guests, query]);
  const filteredWishes = useMemo(() => wishes.filter((wish) => (wish.message + " " + (wish.guestId?.fullName || "")).toLowerCase().includes(query.toLowerCase())), [wishes, query]);

  async function createInvitation(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: name, invitationType: type }) });
    if (response.ok) { const data = await response.json(); setCreated(data.invitation.url); setName(""); await refresh(); }
  }

  async function revoke(id: string) {
    if (!window.confirm("Revoke this invitation link?")) return;
    await fetch(`/api/admin/invitations/${id}/revoke`, { method: "POST" });
    await refresh();
  }

  return <main className="min-h-screen bg-[#D0D0D0] p-0 text-[#171717] sm:p-5 lg:p-9">
    <div className="mx-auto min-h-[calc(100svh-2.5rem)] max-w-[1440px] overflow-hidden rounded-none bg-[#F8F8F7] sm:rounded-[22px]">
      <header className="flex flex-wrap items-center gap-4 border-b border-[#E7E5E1] px-5 py-4 sm:px-8 lg:px-10">
        <button onClick={() => setTab("overview")} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#171717] font-serif text-lg text-[#F2D69B]">B</span><span className="hidden font-serif text-lg sm:inline">Baseleal &amp; Bethel</span></button>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto lg:order-none lg:ml-10 lg:w-auto" aria-label="Dashboard sections">
          {tabs.map(([value, label, icon]) => <button key={value} onClick={() => { setTab(value); setQuery(""); }} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs transition ${tab === value ? "bg-[#171717] text-white" : "bg-[#F0F0EE] text-[#777774] hover:bg-white"}`}><span className="font-serif text-base leading-none">{icon}</span>{label}</button>)}
        </nav>
        <span className="ml-auto hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0978F] sm:block">Wedding administration</span>
      </header>
      {error && <p className="mx-5 mt-5 rounded-xl bg-[#F4E7E2] px-4 py-3 text-xs text-[#8D5145] sm:mx-8 lg:mx-10">Some live MongoDB data is temporarily unavailable.</p>}
      {tab === "overview" && <Overview stats={stats} recent={recent} onNavigate={setTab} />}
      {tab === "guests" && <Guests guests={filteredGuests} query={query} setQuery={setQuery} />}
      {tab === "wishes" && <Wishes wishes={filteredWishes} query={query} setQuery={setQuery} />}
      {tab === "invitations" && <Invitations items={invitations} name={name} type={type} created={created} setName={setName} setType={setType} submit={createInvitation} revoke={revoke} />}
    </div>
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-[#E1D9D0] bg-[#FBFCFD]/95 p-1.5 shadow-[0_12px_36px_rgba(43,33,29,0.18)] backdrop-blur-xl lg:hidden" aria-label="Dashboard sections">
      {tabs.map(([value, label, icon]) => <button key={value} onClick={() => { setTab(value); setQuery(""); }} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium ${tab === value ? "bg-[#F0E8DD] text-[#5C3E2E]" : "text-[#8D8279]"}`}><span className="font-serif text-xl leading-4">{icon}</span><span>{label}</span></button>)}
    </nav>
  </main>;
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`rounded-[20px] bg-[#EEEEEC] p-5 sm:p-6 ${className}`}>{children}</section>; }
function Overview({ stats, recent, onNavigate }: { stats: Stats; recent: Array<{ _id: string; updatedAt?: string; attendanceStatus?: string; guestId?: { fullName?: string }; invitationId?: { invitationType?: string } }>; onNavigate: (tab: Tab) => void }) {
  const max = Math.max(stats.attending, stats.notAttending, 1); const responseRate = stats.pending + stats.total ? Math.round((stats.total / (stats.total + stats.pending)) * 100) : 0;
  return <div className="px-5 py-7 sm:px-8 lg:px-10 lg:py-9"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs text-[#777774]">Tuesday, October 27, 2026</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Wedding Overview</h1><p className="mt-2 text-sm text-[#777774]">Manage your guests, RSVPs, and wedding invitations.</p></div><div className="flex flex-wrap gap-2"><a href="/api/admin/guests/export" className="rounded-full bg-white px-4 py-2.5 text-xs text-[#55534F]">Export guests</a><button onClick={() => onNavigate("invitations")} className="rounded-full bg-[#E85A0C] px-4 py-2.5 text-xs font-semibold text-white">+ Create invitation</button></div></div><div className="mt-8 grid gap-4 xl:grid-cols-[0.95fr_1.7fr]"><Panel><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">Attendance Summary</h2><p className="mt-1 text-xs text-[#777774]">Your wedding RSVP overview.</p></div><span className="rounded-full bg-white px-3 py-2 text-[10px] text-[#777774]">All responses</span></div><div className="mt-5 rounded-2xl bg-white p-4"><div className="grid grid-cols-2 divide-x divide-[#E7E5E1]"><Metric label="Guests attending" value={stats.attending} /><Metric label="Not attending" value={stats.notAttending} /></div><div className="mt-6 flex h-24 items-end gap-2 border-b border-[#E7E5E1] px-1"><div className="w-1/2 rounded-t-lg bg-[#E85A0C]" style={{ height: `${Math.max(10, stats.attending / max * 100)}%` }} /><div className="w-1/2 rounded-t-lg bg-[#D8D3CA]" style={{ height: `${Math.max(10, stats.notAttending / max * 100)}%` }} /></div></div><div className="mt-4 grid grid-cols-2 gap-3"><SmallMetric label="Pending RSVPs" value={stats.pending} /><SmallMetric label="Response rate" value={`${responseRate}%`} /></div><button onClick={() => onNavigate("guests")} className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-xs text-[#55534F]">Open guest directory <span>→</span></button></Panel><Panel><h2 className="text-base font-semibold">Wedding Activity</h2><p className="mt-1 text-xs text-[#777774]">Track your guests and invitations.</p><div className="mt-5 grid gap-3 md:grid-cols-3"><Activity label="Church attendance" value={stats.church} detail="confirmed guests" /><Activity label="Home reception" value={stats.home} detail="confirmed guests" /><Activity label="Invitation responses" value={`${responseRate}%`} detail={`${stats.pending} pending`} dark /></div></Panel></div><div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.7fr]"><div className="grid grid-cols-2 gap-3"><SmallMetric label="Total responses" value={stats.total} /><SmallMetric label="Active invitations" value={stats.total + stats.pending} /><button onClick={() => onNavigate("invitations")} className="col-span-2 rounded-2xl bg-white px-4 py-4 text-left text-sm font-medium">Generate a personalized invitation <span className="float-right">→</span></button></div><Panel><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">Recent RSVPs</h2><p className="mt-1 text-xs text-[#777774]">Review the latest guest responses.</p></div><button onClick={() => onNavigate("guests")} className="text-xs text-[#A58B68]">View all →</button></div><div className="mt-5 overflow-hidden rounded-2xl bg-white">{recent.length === 0 ? <p className="px-4 py-10 text-center text-sm text-[#999690]">No RSVP records available yet.</p> : recent.map((item) => <div key={item._id} className="grid gap-1 border-b border-[#F0EEEB] px-4 py-3 last:border-0 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr] sm:items-center sm:gap-4"><span className="text-sm font-medium">{item.guestId?.fullName || "Guest"}</span><span className="text-xs text-[#777774]">{item.invitationId?.invitationType === "CHURCH_ONLY" ? "Church only" : "Church + home"}</span><span className="w-fit rounded-full bg-[#E8F0E7] px-2 py-1 text-[10px] text-[#537452]">{item.attendanceStatus === "ATTENDING" ? "Attending" : "Not attending"}</span><span className="text-xs text-[#999690]">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}</span></div>)}</div></Panel></div></div>;
}
function Guests({ guests, query, setQuery }: { guests: Guest[]; query: string; setQuery: (value: string) => void }) { return <SectionFrame eyebrow="People" title="Guests & RSVPs" description="Search every guest, invitation permission, and response."><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-base font-semibold">Guest directory</h2><p className="mt-1 text-xs text-[#777774]">{guests.length} records currently visible.</p></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by guest name" className="w-full max-w-xs rounded-full border-0 bg-white px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#A58B68]/30" /></div><div className="mt-5 overflow-hidden rounded-2xl bg-white">{guests.length === 0 ? <p className="px-5 py-14 text-center font-serif text-xl text-[#65564D]">No guests match these filters.</p> : guests.map((guest) => <div key={guest._id} className="grid gap-2 border-b border-[#F0EEEB] px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1fr_1fr_0.7fr] sm:items-center sm:gap-4"><div><p className="text-sm font-medium">{guest.fullName}</p><p className="mt-1 text-xs text-[#A09B94]">{guest.email || "No contact recorded"}</p></div><span className="text-xs text-[#777774]">{guest.invitation?.invitationType === "CHURCH_ONLY" ? "Church only" : guest.invitation ? "Church + home" : "Not invited"}</span><span className="w-fit rounded-full bg-[#F1EEE9] px-2.5 py-1 text-[10px] font-semibold text-[#988B7F]">{guest.rsvp?.attendanceStatus === "ATTENDING" ? "Attending" : guest.rsvp?.attendanceStatus === "NOT_ATTENDING" ? "Not attending" : "Pending"}</span><span className="text-xs text-[#777774]">{guest.rsvp?.attendeeCount || 0}</span></div>)}</div></SectionFrame>; }
function Wishes({ wishes, query, setQuery }: { wishes: Wish[]; query: string; setQuery: (value: string) => void }) { return <SectionFrame eyebrow="Messages" title="Guest wishes" description="Read the notes and blessings shared by your guests."><div className="flex items-center justify-between gap-4"><div><h2 className="text-base font-semibold">Latest messages</h2><p className="mt-1 text-xs text-[#777774]">Guest-submitted text is displayed safely as plain text.</p></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search wishes" className="w-full max-w-xs rounded-full border-0 bg-white px-4 py-3 text-xs outline-none" /></div>{wishes.length === 0 ? <div className="mt-5 rounded-2xl bg-white px-5 py-16 text-center"><p className="font-serif text-2xl text-[#65564D]">No wishes yet.</p><p className="mt-2 text-sm text-[#978D84]">Guest messages will appear here after they submit them.</p></div> : <div className="mt-5 grid gap-3 sm:grid-cols-2">{wishes.map((wish) => <article key={wish._id} className="rounded-2xl bg-white p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium">{wish.guestId?.fullName || "Guest"}</p><time className="text-[10px] text-[#A0968E]">{new Date(wish.createdAt).toLocaleDateString()}</time></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#665B53]">{wish.message}</p></article>)}</div>}</SectionFrame>; }
function Invitations({ items, name, type, created, setName, setType, submit, revoke }: { items: Invitation[]; name: string; type: string; created: string; setName: (value: string) => void; setType: (value: string) => void; submit: (event: FormEvent) => void; revoke: (id: string) => void }) { return <SectionFrame eyebrow="Access control" title="Invitation links" description="Create, share, and revoke personalized wedding access"><form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-[1.2fr_1fr_auto]"><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest full name" className="rounded-full border-0 bg-[#F2F2F0] px-4 py-3 text-xs outline-none" /><select value={type} onChange={(e) => setType(e.target.value)} className="rounded-full border-0 bg-[#F2F2F0] px-4 py-3 text-xs outline-none"><option value="CHURCH_ONLY">Church only</option><option value="CHURCH_AND_HOME">Church + home</option></select><button className="rounded-full bg-[#171717] px-5 py-3 text-xs font-semibold text-white">Generate link</button>{created && <p className="sm:col-span-3 rounded-xl bg-[#E8F0E7] px-3 py-2 text-xs text-[#537452]">Created: {created}</p>}</form><div className="mt-5 overflow-hidden rounded-2xl bg-white">{items.length === 0 ? <p className="px-5 py-14 text-center font-serif text-xl text-[#65564D]">No invitation links yet.</p> : items.map((item) => <div key={item._id} className="grid gap-2 border-b border-[#F0EEEB] px-5 py-4 last:border-0 sm:grid-cols-[1.4fr_1fr_0.8fr_auto] sm:items-center sm:gap-4"><div><p className="text-sm font-medium">{item.guestId?.fullName || "Guest"}</p><p className="mt-1 text-xs text-[#A09B94]">Created {new Date(item.createdAt).toLocaleDateString()}</p></div><span className="text-xs text-[#777774]">{item.invitationType === "CHURCH_ONLY" ? "Church only" : "Church + home"}</span><span className="w-fit rounded-full bg-[#E8F0E7] px-2.5 py-1 text-[10px] text-[#537452]">{item.status}</span>{item.status === "ACTIVE" ? <button onClick={() => revoke(item._id)} className="w-fit rounded-full border border-[#D8D0C7] px-3 py-2 text-[10px] text-[#765D4D]">Revoke</button> : <span />}</div>)}</div></SectionFrame>; }
function SectionFrame({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) { return <div className="px-5 py-7 pb-28 sm:px-8 lg:px-10 lg:py-9"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A58B68]">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h1><p className="mt-2 text-sm text-[#777774]">{description}</p><Panel className="mt-8">{children}</Panel></div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="px-2"><p className="text-[10px] text-[#999690]">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>; }
function SmallMetric({ label, value }: { label: string; value: number | string }) { return <div className="rounded-2xl bg-white p-4"><p className="text-[10px] text-[#999690]">{label}</p><p className="mt-3 text-xl font-semibold">{value}</p></div>; }
function Activity({ label, value, detail, dark = false }: { label: string; value: number | string; detail: string; dark?: boolean }) { return <article className={`min-h-[190px] rounded-2xl p-4 ${dark ? "bg-[#402916] text-white" : "bg-white"}`}><p className={`text-xs ${dark ? "text-white/65" : "text-[#777774]"}`}>{label}</p><p className={`mt-5 text-3xl font-semibold tracking-[-0.04em] ${dark ? "text-white" : "text-[#171717]"}`}>{value}</p><p className={`mt-2 text-[11px] ${dark ? "text-white/55" : "text-[#A09B94]"}`}>{detail}</p><div className={`mt-7 h-8 rounded-b-full border-b-2 ${dark ? "border-[#E85A0C]" : "border-[#E85A0C]/70"}`} /></article>; }
