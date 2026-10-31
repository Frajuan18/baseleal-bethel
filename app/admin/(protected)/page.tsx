"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "./_components/AdminSidebar";

type Stats = { total: number; attending: number; notAttending: number; pending: number; church: number; home: number };
type Recent = { _id: string; updatedAt?: string; attendanceStatus?: string; guestId?: { fullName?: string }; invitationId?: { invitationType?: string } };

const emptyStats: Stats = { total: 0, attending: 0, notAttending: 0, pending: 0, church: 0, home: 0 };

function LineIcon({ kind }: { kind: "home" | "users" | "link" | "heart" | "settings" | "filter" | "download" | "plus" | "arrow" }) {
  const shapes = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    users: <><circle cx="9" cy="7" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 4a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 6" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" /></>,
    heart: <path d="M20.8 8.6c0 5.4-8.8 10.4-8.8 10.4S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.1 1Z" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  }[kind];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>{shapes}</svg>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    const load = () => {
      fetch("/api/admin/dashboard/stats")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => { setStats(data.stats || emptyStats); setRecent(data.recent || []); setError(false); })
        .catch(() => setError(true));
    };
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);
  const data = stats || emptyStats;
  const maxAttendance = Math.max(data.attending, data.notAttending, 1);
  const responseRate = data.pending + data.total ? Math.round((data.total / (data.total + data.pending)) * 100) : 0;
  const activity = useMemo(() => [
    { label: "Church attendance", value: data.church, detail: "confirmed guests", dark: false, kind: "home" as const },
    { label: "Home reception", value: data.home, detail: "confirmed guests", dark: false, kind: "heart" as const },
    { label: "Invitation responses", value: `${responseRate}%`, detail: `${data.pending} pending`, dark: true, kind: "link" as const },
  ], [data.church, data.home, data.pending, responseRate]);

  return <main className="min-h-dvh bg-[#E8E5E0] p-0 text-[#171717] sm:p-4 lg:p-6">
    <AdminSidebar active="/admin" hideDesktop />
    <div className="mx-auto min-h-[100svh] max-w-[1440px] overflow-hidden rounded-none bg-[#F8F8F7] sm:min-h-[calc(100svh-2rem)] sm:rounded-[26px] sm:border sm:border-[#DED8D1] sm:shadow-[0_30px_80px_-40px_rgba(43,33,29,0.4)]">
      <header className="flex flex-wrap items-center gap-4 border-b border-[#E7E5E1] px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <a href="/admin" className="flex min-h-[44px] items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#171717] font-serif text-base text-[#F2D69B]">B</span><span className="hidden font-serif text-base sm:inline sm:text-lg">Basseleal &amp; Bethel</span></a>
        <nav aria-label="Admin navigation" className="order-3 hidden w-full gap-1 overflow-x-auto rounded-full bg-[#EFEBE5] p-1 lg:order-none lg:ml-10 lg:flex lg:w-auto">{[["Overview", "/admin", "home"], ["Guests & RSVPs", "/admin/guests", "users"], ["Directions", "/admin/directions", "settings"], ["Invitations", "/admin/invitations", "link"], ["Guest Wishes", "/admin/wishes", "heart"]].map(([label, href, kind]) => <a key={href} href={href} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs transition ${href === "/admin" ? "bg-[#171717] text-white" : "bg-[#F0F0EE] text-[#777774] hover:bg-white"}`}><LineIcon kind={kind as "home"} />{label}</a>)}</nav>
        <div className="ml-auto flex items-center gap-2"><button className="hidden rounded-full bg-white p-2.5 text-[#777774] sm:block" aria-label="Notifications">♡</button></div>
      </header>
      <div className="px-4 pb-[calc(6rem_+_env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:py-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs text-[#6B6660]">Tuesday, October 27, 2026</p>
            <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.03em] sm:text-3xl lg:text-4xl">Wedding Overview</h1>
            <p className="mt-1.5 max-w-[60ch] text-sm text-[#6B6660]">Manage your guests, RSVPs, and wedding invitations.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#E1D9CF] bg-white px-4 text-xs font-semibold text-[#4A443E]"><LineIcon kind="filter" />Filters</button>
            <a href="/api/admin/guests/export" className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#E1D9CF] bg-white px-4 text-xs font-semibold text-[#4A443E]"><LineIcon kind="download" />Export</a>
            <a href="/admin/invitations" className="col-span-2 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#C2491A] px-4 text-xs font-semibold text-white sm:col-auto"><LineIcon kind="plus" />Create invitation</a>
          </div>
        </div>
        {error && <p className="mt-5 rounded-xl bg-[#F4E7E2] px-4 py-3 text-xs text-[#8D5145]">Live MongoDB data is temporarily unavailable.</p>}
        <div className="mt-8 grid gap-4 xl:grid-cols-[0.95fr_1.7fr]">
          <section className="rounded-[20px] bg-[#EEEEEC] p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">Attendance Summary</h2><p className="mt-1 text-xs text-[#777774]">Your wedding RSVP overview.</p></div><span className="rounded-full bg-white px-3 py-2 text-[10px] text-[#777774]">All responses</span></div><div className="mt-5 rounded-2xl bg-white p-4"><div className="grid grid-cols-2 divide-x divide-[#E7E5E1]"><Metric label="Guests attending" value={data.attending} /><Metric label="Not attending" value={data.notAttending} /></div><div className="mt-6 flex h-24 items-end gap-2 border-b border-[#E7E5E1] px-1">{[data.attending, data.notAttending].map((value, index) => <div key={index} className={`w-1/2 rounded-t-lg ${index === 0 ? "bg-[#E85A0C]" : "bg-[#D8D3CA]"}`} style={{ height: `${Math.max(10, (value / maxAttendance) * 100)}%` }} />)}</div></div><div className="mt-4 grid grid-cols-2 gap-3"><SmallMetric label="Pending RSVPs" value={data.pending} /><SmallMetric label="Total invitations" value={data.total + data.pending} /></div><a href="/admin/guests" className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-xs text-[#55534F]">Open guest directory <LineIcon kind="arrow" /></a></section>
          <section className="rounded-[20px] bg-[#EEEEEC] p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">Wedding Activity</h2><p className="mt-1 text-xs text-[#777774]">Track your guests and invitations.</p></div><button className="rounded-full bg-white p-2.5 text-[#777774]" aria-label="Filter activity"><LineIcon kind="filter" /></button></div><div className="mt-5 grid gap-3 md:grid-cols-3">{activity.map((item) => <article key={item.label} className={`min-h-[150px] rounded-2xl p-4 md:min-h-[190px] ${item.dark ? "bg-[#402916] text-white" : "bg-white"}`}><div className="flex items-center justify-between"><span className={item.dark ? "text-white/75" : "text-[#777774]"}><LineIcon kind={item.kind} /></span><span className={`text-[10px] ${item.dark ? "text-[#E85A0C]" : "text-[#9A8A78]"}`}>●</span></div><p className={`mt-3 text-xs md:mt-5 ${item.dark ? "text-white/65" : "text-[#777774]"}`}>{item.label}</p><p className={`mt-2 text-3xl font-semibold tracking-[-0.04em] ${item.dark ? "text-white" : "text-[#171717]"}`}>{item.value}</p><p className={`mt-2 text-[11px] ${item.dark ? "text-white/55" : "text-[#A09B94]"}`}>{item.detail}</p></article>)}</div></section>
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.7fr]"><section className="grid grid-cols-2 gap-3"><SmallPanel label="Pending responses" value={data.pending} detail="Need a reply" /><SmallPanel label="Church + home" value={data.home} detail="Home reception" /><a href="/admin/invitations" className="col-span-2 flex items-center justify-between rounded-2xl bg-white px-4 py-4 text-sm font-medium">Generate a personalized invitation <LineIcon kind="arrow" /></a></section><section className="rounded-[20px] bg-[#EEEEEC] p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">Recent RSVPs</h2><p className="mt-1 text-xs text-[#777774]">Review the latest guest responses.</p></div><a href="/admin/guests" className="text-xs text-[#A58B68]">View all →</a></div><div className="mt-5 overflow-hidden rounded-2xl bg-white"><div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-4 border-b border-[#E7E5E1] px-4 py-3 text-[10px] text-[#999690] sm:grid"><span>Guest</span><span>Invitation</span><span>Status</span><span>Date</span></div>{recent.length === 0 ? <p className="px-4 py-10 text-center text-sm text-[#999690]">No RSVP records available yet.</p> : recent.map((item) => <div key={item._id} className="grid gap-1 border-b border-[#F0EEEB] px-4 py-3 last:border-0 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr] sm:items-center sm:gap-4"><span className="text-sm font-medium">{item.guestId?.fullName || "Guest"}</span><span className="text-xs text-[#777774]">{item.invitationId?.invitationType === "CHURCH_ONLY" ? "Church only" : "Church + home"}</span><span className={`w-fit rounded-full px-2 py-1 text-[10px] ${item.attendanceStatus === "ATTENDING" ? "bg-[#E8F0E7] text-[#537452]" : "bg-[#F3E7E3] text-[#925A4D]"}`}>{item.attendanceStatus === "ATTENDING" ? "Attending" : "Not attending"}</span><span className="text-xs text-[#999690]">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}</span></div>)}</div></section></div>
      </div>
    </div>
  </main>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="px-2"><p className="text-[10px] text-[#999690]">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>; }
function SmallMetric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-white p-4"><p className="text-[10px] text-[#999690]">{label}</p><p className="mt-3 text-xl font-semibold">{value}</p></div>; }
function SmallPanel({ label, value, detail }: { label: string; value: number; detail: string }) { return <div className="rounded-2xl bg-[#EEEEEC] p-4"><p className="text-xs text-[#777774]">{label}</p><p className="mt-5 text-2xl font-semibold">{value}</p><p className="mt-1 text-[10px] text-[#A09B94]">{detail}</p></div>; }
