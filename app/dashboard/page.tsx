"use client";

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/app/components/dashboard/Icon";
import { InviteLinkActions } from "@/app/components/dashboard/InviteLinkActions";

type Tab = "overview" | "guests" | "wishes" | "invitations";
type Stats = { total: number; attending: number; notAttending: number; pending: number; church: number; home: number };
type Guest = { _id: string; fullName: string; email?: string; invitation?: { invitationType?: string } | null; rsvp?: { attendanceStatus?: string; attendeeCount?: number } | null };
type Wish = { _id: string; message: string; createdAt: string; guestId?: { fullName?: string } };
type Invitation = { _id: string; createdAt: string; invitationType: string; status: string; shareUrl?: string; guestId?: { fullName?: string } };
type RecentItem = { _id: string; updatedAt?: string; attendanceStatus?: string; guestId?: { fullName?: string }; invitationId?: { invitationType?: string } | null };

const emptyStats: Stats = { total: 0, attending: 0, notAttending: 0, pending: 0, church: 0, home: 0 };

const TABS: { value: Tab; label: string; icon: IconName }[] = [
  { value: "overview", label: "Overview", icon: "home" },
  { value: "guests", label: "Guests", icon: "users" },
  { value: "wishes", label: "Wishes", icon: "heart" },
  { value: "invitations", label: "Links", icon: "link" },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [recent, setRecent] = useState<RecentItem[]>([]);
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
      fetch("/api/admin/dashboard/stats").then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch("/api/admin/guests").then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch("/api/admin/wishes").then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch("/api/admin/invitations").then((r) => (r.ok ? r.json() : Promise.reject())),
    ]);
    const [statsResult, guestsResult, wishesResult, invitationsResult] = results;
    if (statsResult.status === "fulfilled") {
      setStats(statsResult.value.stats || emptyStats);
      setRecent(statsResult.value.recent || []);
    }
    if (guestsResult.status === "fulfilled") setGuests(guestsResult.value.items || []);
    if (wishesResult.status === "fulfilled") setWishes(wishesResult.value.items || []);
    if (invitationsResult.status === "fulfilled") setInvitations(invitationsResult.value.items || []);
    setError(results.some((result) => result.status === "rejected"));
  };

  useEffect(() => {
    const load = () => {
      void refresh();
    };
    const timer = window.setTimeout(load, 0);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", load);
    };
  }, []);

  const filteredGuests = useMemo(
    () => guests.filter((guest) => guest.fullName.toLowerCase().includes(query.toLowerCase())),
    [guests, query]
  );
  const filteredWishes = useMemo(
    () => wishes.filter((wish) => (wish.message + " " + (wish.guestId?.fullName || "")).toLowerCase().includes(query.toLowerCase())),
    [wishes, query]
  );

  async function createInvitation(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name, invitationType: type }),
    });
    if (response.ok) {
      const data = await response.json();
      setCreated(data.invitation.url);
      setName("");
      await refresh();
    }
  }

  async function revoke(id: string) {
    if (!window.confirm("Revoke this invitation link?")) return;
    await fetch(`/api/admin/invitations/${id}/revoke`, { method: "POST" });
    await refresh();
  }

  async function createLink(id: string) {
    if (!window.confirm("Create a shareable link? Any previously issued link for this guest will stop working.")) return;
    const response = await fetch(`/api/admin/invitations/${id}/link`, { method: "POST" });
    if (response.ok) await refresh();
  }

  return (
    <main className="min-h-dvh bg-[#E8E5E0] text-[#171717] sm:p-4 lg:p-6">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col bg-[#F8F8F7] sm:min-h-[calc(100svh-2rem)] sm:rounded-[26px] sm:border sm:border-[#DED8D1] sm:shadow-[0_30px_80px_-40px_rgba(43,33,29,0.4)]">
        <AppHeader tab={tab} onTab={setTab} />
        <div className="flex-1">
          {error && (
            <div role="alert" className="mx-4 mt-4 rounded-2xl border border-[#E7C9BC] bg-[#FBEDE7] px-4 py-3 text-xs text-[#8A3D20] sm:mx-6 lg:mx-8">
              Some live MongoDB data is temporarily unavailable.
            </div>
          )}
          {tab === "overview" && <Overview stats={stats} recent={recent} onNavigate={setTab} />}
          {tab === "guests" && <Guests guests={filteredGuests} query={query} setQuery={setQuery} />}
          {tab === "wishes" && <Wishes wishes={filteredWishes} query={query} setQuery={setQuery} />}
          {tab === "invitations" && (
            <Invitations
              items={invitations}
              name={name}
              type={type}
              created={created}
              setName={setName}
              setType={setType}
              submit={createInvitation}
              revoke={revoke}
              createLink={createLink}
            />
          )}
        </div>
      </div>
      <BottomNav tab={tab} onTab={setTab} />
    </main>
  );
}

function AppHeader({ tab, onTab }: { tab: Tab; onTab: (value: Tab) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E2DB] bg-[#F8F8F7]/90 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <button
          type="button"
          onClick={() => onTab("overview")}
          className="flex min-h-[44px] items-center gap-2.5 rounded-2xl pr-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#171717] font-serif text-base text-[#F2D69B]">B</span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-base leading-tight sm:text-lg">Basseleal &amp; Bethel</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#736C64]">Wedding admin</span>
          </span>
        </button>

        <nav aria-label="Dashboard sections" className="ml-auto hidden items-center gap-1 rounded-full bg-[#EFEBE5] p-1 lg:flex">
          {TABS.map((item) => {
            const active = tab === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onTab(item.value)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[38px] items-center gap-2 rounded-full px-3.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40 ${
                  active ? "bg-white text-[#171717] shadow-[0_2px_8px_rgba(43,33,29,0.08)]" : "text-[#6B6660] hover:text-[#171717]"
                }`}
              >
                <Icon name={item.icon} className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function BottomNav({ tab, onTab }: { tab: Tab; onTab: (value: Tab) => void }) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4DED6] bg-[#FBF9F6]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 py-1.5">
        {TABS.map((item) => {
          const active = tab === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onTab(item.value)}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-semibold transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40 ${
                active ? "bg-[#F0E6D9] text-[#7A4A2A]" : "text-[#6F665D]"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SectionFrame({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="px-4 pb-[calc(6rem_+_env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:py-8">
      <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">{title}</h1>
      <p className="mt-1.5 max-w-[60ch] text-sm text-[#6B6660]">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Overview({ stats, recent, onNavigate }: { stats: Stats; recent: RecentItem[]; onNavigate: (value: Tab) => void }) {
  const responded = stats.attending + stats.notAttending;
  const responseBase = Math.max(responded, 1);
  const responseRate = stats.total + stats.pending ? Math.round((stats.total / (stats.total + stats.pending)) * 100) : 0;
  const attendPct = (stats.attending / responseBase) * 100;
  const declinePct = (stats.notAttending / responseBase) * 100;

  return (
    <section className="px-4 pb-[calc(6rem_+_env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:py-8">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7B4F]">
        <Icon name="calendar" className="h-3.5 w-3.5" />
        Tuesday, October 27, 2026
      </div>
      <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.03em] sm:text-3xl lg:text-4xl">Wedding Overview</h1>
      <p className="mt-1.5 max-w-[60ch] text-sm text-[#6B6660]">Manage your guests, RSVPs, and wedding invitations.</p>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:gap-3">
        <a
          href="/api/admin/guests/export"
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#E1D9CF] bg-white px-4 text-xs font-semibold text-[#4A443E] transition hover:border-[#C9B79F] active:scale-[0.99]"
        >
          <Icon name="download" className="h-4 w-4" /> Export
        </a>
        <button
          type="button"
          onClick={() => onNavigate("invitations")}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#C2491A] px-4 text-xs font-semibold text-white transition hover:bg-[#A83E15] active:scale-[0.99]"
        >
          <Icon name="plus" className="h-4 w-4" /> Create invitation
        </button>
      </div>

      <section className="mt-6 rounded-[22px] bg-[#EEEEEC] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Attendance</h2>
          <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-[#6B6660]">All responses</span>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6660]">Guests attending</p>
              <p className="mt-1 text-4xl font-semibold leading-none tracking-[-0.04em]">{stats.attending}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6660]">Response rate</p>
              <p className="mt-1 text-2xl font-semibold leading-none tracking-[-0.03em]">{responseRate}%</p>
            </div>
          </div>
          <div
            className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-[#EFEAE3]"
            role="img"
            aria-label={`${stats.attending} attending, ${stats.notAttending} not attending`}
          >
            <span className="h-full bg-[#E85A0C]" style={{ width: `${attendPct}%` }} />
            <span className="h-full bg-[#C9B79F]" style={{ width: `${declinePct}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-medium text-[#6B6660]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#E85A0C]" /> {stats.attending} attending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#C9B79F]" /> {stats.notAttending} not attending
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniStat label="Pending RSVPs" value={stats.pending} />
          <MiniStat label="Total responses" value={stats.total} />
        </div>
      </section>

      <section className="mt-4 rounded-[22px] bg-[#EEEEEC] p-4 sm:p-5">
        <h2 className="text-base font-semibold">Wedding activity</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ActivityRow icon="users" label="Church attendance" value={stats.church} detail="confirmed" />
          <ActivityRow icon="heart" label="Home reception" value={stats.home} detail="confirmed" />
          <ActivityRow icon="link" label="Responses" value={`${responseRate}%`} detail={`${stats.pending} pending`} />
        </div>
      </section>

      <section className="mt-4 rounded-[22px] bg-[#EEEEEC] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Recent RSVPs</h2>
            <p className="mt-0.5 text-xs text-[#6B6660]">Review the latest guest responses.</p>
          </div>
          <button type="button" onClick={() => onNavigate("guests")} className="shrink-0 text-xs font-semibold text-[#9A7B4F]">
            View all
          </button>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl bg-white">
          {recent.length === 0 ? (
            <EmptyState title="No RSVPs yet" text="Responses will appear here as guests reply." />
          ) : (
            recent.map((item) => (
              <div key={item._id} className="border-b border-[#F0EEEB] p-3.5 last:border-0 md:grid md:grid-cols-[1.4fr_1fr_0.8fr_0.8fr] md:items-center md:gap-3">
                <div className="flex items-center justify-between gap-3 md:block">
                  <p className="truncate text-sm font-semibold">{item.guestId?.fullName || "Guest"}</p>
                  <span className="md:hidden">
                    <StatusPill status={item.attendanceStatus} />
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#6B6660] md:mt-0">{invitationLabel(item.invitationId?.invitationType)}</p>
                <span className="hidden md:block">
                  <StatusPill status={item.attendanceStatus} />
                </span>
                <p className="mt-1 text-[11px] text-[#736C64] md:mt-0">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </section>
  );
}

function Guests({ guests, query, setQuery }: { guests: Guest[]; query: string; setQuery: (value: string) => void }) {
  return (
    <SectionFrame title="Guests & RSVPs" description="Search every guest, invitation, and response.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField value={query} onChange={setQuery} placeholder="Search guests" />
        <p className="text-xs font-medium text-[#6B6660]">
          {guests.length} {guests.length === 1 ? "guest" : "guests"}
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#EDE9E2] bg-white">
        <div className="hidden grid-cols-[1.7fr_1fr_1fr_0.6fr] gap-4 border-b border-[#E7E2DB] bg-[#FBFAF8] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6660] md:grid">
          <span>Guest</span>
          <span>Invitation</span>
          <span>Status</span>
          <span>Party</span>
        </div>
        {guests.length === 0 ? (
          <EmptyState title="No guests" text="Guests appear here after they respond or are invited." />
        ) : (
          guests.map((guest) => <GuestRow key={guest._id} guest={guest} />)
        )}
      </div>
    </SectionFrame>
  );
}

function GuestRow({ guest }: { guest: Guest }) {
  const status = guest.rsvp?.attendanceStatus;
  const party = guest.rsvp?.attendeeCount || 0;
  const invite = !guest.invitation
    ? "Not invited"
    : guest.invitation.invitationType === "CHURCH_ONLY"
      ? "Church only"
      : "Church + home";

  return (
    <div className="border-b border-[#F0EEEB] p-4 last:border-0 md:grid md:grid-cols-[1.7fr_1fr_1fr_0.6fr] md:items-center md:gap-4">
      <div className="flex items-start justify-between gap-3 md:block">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight">{guest.fullName}</p>
          <p className="mt-0.5 truncate text-xs text-[#6B6660]">{guest.email || "No contact recorded"}</p>
        </div>
        <span className="md:hidden">
          <StatusPill status={status} />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 md:hidden">
        <MetaChip>{invite}</MetaChip>
        <MetaChip>
          {party} {party === 1 ? "guest" : "guests"}
        </MetaChip>
      </div>

      <span className="hidden text-xs font-medium text-[#6B6660] md:block">{invite}</span>
      <span className="hidden md:block">
        <StatusPill status={status} />
      </span>
      <span className="hidden text-xs font-medium text-[#6B6660] md:block">{party}</span>
    </div>
  );
}

function Wishes({ wishes, query, setQuery }: { wishes: Wish[]; query: string; setQuery: (value: string) => void }) {
  return (
    <SectionFrame title="Guest wishes" description="Read the notes and blessings shared by your guests.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField value={query} onChange={setQuery} placeholder="Search wishes" />
        <p className="text-xs font-medium text-[#6B6660]">
          {wishes.length} {wishes.length === 1 ? "message" : "messages"}
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#EDE9E2] bg-white">
        {wishes.length === 0 ? (
          <EmptyState title="No wishes yet" text="Guest messages will appear here after they submit them." />
        ) : (
          wishes.map((wish) => (
            <article key={wish._id} className="border-b border-[#F0EEEB] p-4 last:border-0 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold">{wish.guestId?.fullName || "Guest"}</p>
                <time className="shrink-0 text-[11px] font-medium text-[#736C64]">{new Date(wish.createdAt).toLocaleDateString()}</time>
              </div>
              <p className="mt-2.5 max-w-[70ch] whitespace-pre-wrap text-[15px] leading-relaxed text-[#4A443E]">{wish.message}</p>
            </article>
          ))
        )}
      </div>
    </SectionFrame>
  );
}

function Invitations({
  items,
  name,
  type,
  created,
  setName,
  setType,
  submit,
  revoke,
  createLink,
}: {
  items: Invitation[];
  name: string;
  type: string;
  created: string;
  setName: (value: string) => void;
  setType: (value: string) => void;
  submit: (event: FormEvent) => void;
  revoke: (id: string) => void;
  createLink: (id: string) => void;
}) {
  return (
    <SectionFrame title="Invitation links" description="Create, share, and revoke personalised wedding access.">
      <form onSubmit={submit} className="grid gap-2.5 rounded-2xl border border-[#EDE9E2] bg-white p-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:gap-3">
        <label htmlFor="inv-name" className="sr-only">
          Guest full name
        </label>
        <input
          id="inv-name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Guest full name"
          className="h-11 w-full rounded-full border border-[#E1D9CF] bg-[#FBFAF8] px-4 text-base outline-none transition placeholder:text-[#9A938B] focus:border-[#C9B79F] focus:ring-2 focus:ring-[#C2491A]/15 sm:text-sm"
        />
        <label htmlFor="inv-type" className="sr-only">
          Invitation type
        </label>
        <select
          id="inv-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="h-11 w-full rounded-full border border-[#E1D9CF] bg-[#FBFAF8] px-4 text-base outline-none transition focus:border-[#C9B79F] focus:ring-2 focus:ring-[#C2491A]/15 sm:text-sm"
        >
          <option value="CHURCH_ONLY">Church only</option>
          <option value="CHURCH_AND_HOME">Church + home</option>
        </select>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#C2491A] px-5 text-xs font-semibold text-white transition hover:bg-[#A83E15] active:scale-[0.99]"
        >
          <Icon name="plus" className="h-4 w-4" /> Generate link
        </button>
      </form>

      {created && <CreatedLink url={created} />}

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#EDE9E2] bg-white">
        {items.length === 0 ? (
          <EmptyState title="No invitation links" text="Generate a link to share personalised access with a guest." />
        ) : (
          items.map((item) => <InvitationRow key={item._id} item={item} revoke={revoke} createLink={createLink} />)
        )}
      </div>
    </SectionFrame>
  );
}

function CreatedLink({ url }: { url: string }) {
  const absolute = typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;
  return (
    <div className="mt-3 rounded-2xl border border-[#D9E4D5] bg-[#EFF5EC] p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4C6B48]">Invitation created</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs text-[#4A443E]">{absolute}</p>
        <InviteLinkActions url={url} />
      </div>
    </div>
  );
}

function InvitationRow({ item, revoke, createLink }: { item: Invitation; revoke: (id: string) => void; createLink: (id: string) => void }) {
  const active = item.status === "ACTIVE";
  const statusClass = active ? "bg-[#E7EFE5] text-[#4C6B48]" : "bg-[#F6E5DE] text-[#9B4A2C]";

  return (
    <div className="border-b border-[#F0EEEB] p-4 last:border-0 md:grid md:grid-cols-[1.5fr_1fr_0.8fr_auto] md:items-center md:gap-4">
      <div className="flex items-start justify-between gap-3 md:block">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.guestId?.fullName || "Guest"}</p>
          <p className="mt-0.5 text-xs text-[#6B6660]">Created {new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold md:hidden ${statusClass}`}>{item.status}</span>
      </div>

      <span className="mt-2 inline-flex w-fit rounded-full bg-[#F3EFE9] px-2.5 py-1 text-[11px] font-medium text-[#6B6660] md:mt-0">
        {item.invitationType === "CHURCH_ONLY" ? "Church only" : "Church + home"}
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

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#736C64]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-[#E1D9CF] bg-white pl-10 pr-4 text-base text-[#171717] outline-none transition placeholder:text-[#9A938B] focus:border-[#C9B79F] focus:ring-2 focus:ring-[#C2491A]/15 sm:text-sm"
      />
    </div>
  );
}

function MetaChip({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-[#F3EFE9] px-2.5 py-1 text-[11px] font-medium text-[#6B6660]">{children}</span>;
}

function StatusPill({ status, className = "" }: { status?: string | null; className?: string }) {
  const attending = status === "ATTENDING";
  const declined = status === "NOT_ATTENDING";
  const styles = attending ? "bg-[#E7EFE5] text-[#4C6B48]" : declined ? "bg-[#F6E5DE] text-[#9B4A2C]" : "bg-[#F1EDE7] text-[#6A5D51]";
  const label = attending ? "Attending" : declined ? "Not attending" : "Pending";
  return <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles} ${className}`}>{label}</span>;
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white p-3.5">
      <p className="text-[11px] font-medium text-[#6B6660]">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-[-0.03em]">{value}</p>
    </div>
  );
}

function ActivityRow({ icon, label, value, detail }: { icon: IconName; label: string; value: number | string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3EEE7] text-[#9A7B4F]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#6B6660]">{label}</p>
        <p className="text-lg font-semibold leading-tight">
          {value} <span className="text-[11px] font-medium text-[#736C64]">{detail}</span>
        </p>
      </div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="font-serif text-xl text-[#4A443E]">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[36ch] text-sm text-[#6B6660]">{text}</p>
    </div>
  );
}

function invitationLabel(type?: string | null) {
  if (type === "CHURCH_ONLY") return "Church only";
  if (type === "CHURCH_AND_HOME") return "Church + home";
  return "Public RSVP";
}