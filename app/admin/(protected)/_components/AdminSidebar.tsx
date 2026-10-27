"use client";

const items = [
  ["Overview", "/admin", "⌂"],
  ["Guests", "/admin/guests", "♧"],
  ["Wishes", "/admin/wishes", "♡"],
  ["Links", "/admin/invitations", "↗"],
];

export function AdminSidebar({ active, hideDesktop = false }: { active: string; hideDesktop?: boolean }) {
  return <>
    {!hideDesktop && <header className="hidden items-center gap-6 border-b border-[#E1DED9] bg-[#F8F8F7] px-5 py-4 lg:flex lg:px-8"><a href="/admin" className="flex shrink-0 items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#171717] font-serif text-lg text-[#F2D69B]">B</span><span className="font-serif text-lg">Baseleal &amp; Bethel</span></a><nav className="flex items-center gap-1">{items.map(([label, href]) => <a key={href} href={href} className={`rounded-full px-4 py-2 text-xs transition ${active === href ? "bg-[#171717] font-medium text-white" : "bg-[#EEEEEC] text-[#756D66] hover:bg-white"}`}>{label}</a>)}</nav><div className="ml-auto flex items-center gap-3"><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0978F]">Private administration</span><button onClick={async () => { await fetch("/api/admin/auth/logout", { method: "POST" }); window.location.assign("/admin/login"); }} className="rounded-full bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6C625B]">Sign out</button></div></header>}
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-[#E1D9D0] bg-[#FBFCFD]/95 p-1.5 shadow-[0_12px_36px_rgba(43,33,29,0.18)] backdrop-blur-xl lg:hidden" aria-label="Admin navigation">
      {items.map(([label, href, icon]) => <a key={href} href={href} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition ${active === href ? "bg-[#F0E8DD] text-[#5C3E2E]" : "text-[#8D8279]"}`}><span className="font-serif text-xl leading-4">{icon}</span><span>{label}</span></a>)}
    </nav>
  </>;
}
