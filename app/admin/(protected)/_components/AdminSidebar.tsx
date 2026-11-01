"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/app/components/dashboard/Icon";

const desktopItems: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/admin", icon: "home" },
  { label: "Guests", href: "/admin/guests", icon: "users" },
  { label: "Wishes", href: "/admin/wishes", icon: "heart" },
  { label: "Links", href: "/admin/invitations", icon: "link" },
  { label: "Directions", href: "/admin/directions", icon: "map-pin" },
];

const mobileMainItems: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/admin", icon: "home" },
  { label: "Guests", href: "/admin/guests", icon: "users" },
  { label: "Wishes", href: "/admin/wishes", icon: "heart" },
  { label: "Links", href: "/admin/invitations", icon: "link" },
];

export function AdminSidebar({ active, hideDesktop = true }: { active: string; hideDesktop?: boolean }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreOpen]);

  const isItemActive = (href: string) => {
    if (active === href) return true;
    if ((href === "/admin/directions" && active === "/admin/locations") || (href === "/admin/locations" && active === "/admin/directions")) return true;
    return false;
  };

  const isDirectionsOrTimeActive = active === "/admin/directions" || active === "/admin/locations";

  return (
    <>
      {!hideDesktop && (
        <header className="sticky top-0 z-40 hidden items-center gap-6 border-b border-[#E1DED9] bg-[#F8F8F7]/90 px-5 py-4 backdrop-blur-xl lg:flex lg:px-8">
          <a href="/admin" className="flex shrink-0 items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#171717] font-serif text-lg text-[#F2D69B]">B</span>
            <span className="font-serif text-lg">Basseleal &amp; Bethel</span>
          </a>
          <nav aria-label="Admin navigation" className="flex items-center gap-1 rounded-full bg-[#EFEBE5] p-1">
            {desktopItems.map(({ label, href, icon }) => {
              const isActive = isItemActive(href);
              return (
                <a
                  key={href}
                  href={href}
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

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Admin navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4DED6] bg-[#FBF9F6]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-1.5">
          {mobileMainItems.map(({ label, href, icon }) => {
            const isActive = isItemActive(href);
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[9px] font-semibold transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40 ${
                  isActive ? "bg-[#F0E6D9] text-[#7A4A2A]" : "text-[#6F665D]"
                }`}
              >
                <Icon name={icon} className="h-4 w-4" />
                <span className="truncate">{label}</span>
              </a>
            );
          })}

          {/* Rightmost 5th Item: Three Dots Menu */}
          <div ref={moreRef} className="relative">
            {moreOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                  onClick={() => setMoreOpen(false)}
                />

                <div
                  role="menu"
                  aria-label="Directions and Time navigation menu"
                  className="absolute bottom-full right-0 mb-3 w-56 rounded-2xl border border-[#E3DDD5] bg-[#FAF8F5] p-2 shadow-[0_16px_40px_-8px_rgba(43,24,16,0.25)] z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1.5 border-b border-[#EFEAE2] mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A7B4F]">
                      Schedule &amp; Venues
                    </p>
                  </div>

                  {/* Time Tab */}
                  <a
                    href="/admin/directions?tab=time"
                    onClick={() => setMoreOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#422B20] transition hover:bg-[#EFEBE4] active:scale-[0.98]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#EDE7DE] text-[#8C6A3B]">
                      <Icon name="clock" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-tight">Time Tab</p>
                      <p className="text-[10px] text-[#8C6A3B] mt-0.5 truncate">Program times &amp; schedule</p>
                    </div>
                  </a>

                  {/* Directions Tab */}
                  <a
                    href="/admin/directions?tab=directions"
                    onClick={() => setMoreOpen(false)}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#422B20] transition hover:bg-[#EFEBE4] active:scale-[0.98]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#EDE7DE] text-[#8C6A3B]">
                      <Icon name="map-pin" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-tight">Directions Tab</p>
                      <p className="text-[10px] text-[#8C6A3B] mt-0.5 truncate">Google Maps &amp; locations</p>
                    </div>
                  </a>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              aria-expanded={moreOpen}
              aria-label="Open Time and Directions options"
              className={`flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[9px] font-semibold transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40 ${
                isDirectionsOrTimeActive || moreOpen ? "bg-[#F0E6D9] text-[#7A4A2A]" : "text-[#6F665D]"
              }`}
            >
              <Icon name="dots" className="h-4 w-4" />
              <span className="truncate">Directions</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
