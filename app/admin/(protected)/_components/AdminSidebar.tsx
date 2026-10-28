"use client";

import { Icon, type IconName } from "@/app/components/dashboard/Icon";

const items: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/admin", icon: "home" },
  { label: "Guests", href: "/admin/guests", icon: "users" },
  { label: "Wishes", href: "/admin/wishes", icon: "heart" },
  { label: "Links", href: "/admin/invitations", icon: "link" },
];

export function AdminSidebar({ active, hideDesktop = false }: { active: string; hideDesktop?: boolean }) {
  return (
    <>
      {!hideDesktop && (
        <header className="sticky top-0 z-40 hidden items-center gap-6 border-b border-[#E1DED9] bg-[#F8F8F7]/90 px-5 py-4 backdrop-blur-xl lg:flex lg:px-8">
          <a href="/dashboard" className="flex shrink-0 items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#171717] font-serif text-lg text-[#F2D69B]">B</span>
            <span className="font-serif text-lg">Basseleal &amp; Bethel</span>
          </a>
          <nav aria-label="Admin navigation" className="flex items-center gap-1 rounded-full bg-[#EFEBE5] p-1">
            {items.map(({ label, href, icon }) => {
              const isActive = active === href;
              return (
                <a
                  key={href}
                  href={href.replace("/admin", "/dashboard")}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-[38px] items-center gap-2 rounded-full px-3.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40 ${
                    isActive ? "bg-white text-[#171717] shadow-[0_2px_8px_rgba(43,33,29,0.08)]" : "text-[#6B6660] hover:text-[#171717]"
                  }`}
                >
                  <Icon name={icon} className="h-4 w-4" />
                  {label}
                </a>
              );
            })}
          </nav>
          <div className="ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] text-[#736C64]">Wedding administration</div>
        </header>
      )}

      <nav
        aria-label="Admin navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4DED6] bg-[#FBF9F6]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 py-1.5">
          {items.map(({ label, href, icon }) => {
            const isActive = active === href;
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-semibold transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40 ${
                  isActive ? "bg-[#F0E6D9] text-[#7A4A2A]" : "text-[#6F665D]"
                }`}
              >
                <Icon name={icon} className="h-5 w-5" />
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}