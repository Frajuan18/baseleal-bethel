import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Icon, type IconName } from "@/app/components/dashboard/Icon";

const adminTabs: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/admin", icon: "home" },
  { label: "Guests", href: "/admin/guests", icon: "users" },
  { label: "Directions", href: "/admin/directions", icon: "map-pin" },
  { label: "Wishes", href: "/admin/wishes", icon: "heart" },
  { label: "Links", href: "/admin/invitations", icon: "link" },
];

export function AdminTabShell({
  active,
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  active: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <AdminSidebar active={active} hideDesktop />
      <main className="dashboard-root font-satoshi min-h-dvh bg-[#F8F8F7] px-4 pb-[calc(6rem_+_env(safe-area-inset-bottom))] pt-5 text-[#171717] sm:px-6 sm:pt-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1440px]">
          {/* Sleek inline section navigation (no top navbar) */}
          <nav aria-label="Admin navigation" className="mb-6 hidden items-center gap-1.5 overflow-x-auto py-1 lg:flex">
            {adminTabs.map(({ label, href, icon }) => {
              const isActive = active === href;
              return (
                <a
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-xs font-semibold transition active:scale-[0.98] ${
                    isActive
                      ? "bg-[#1E140E] text-white shadow-xs"
                      : "bg-[#EFEBE5] text-[#6B6660] hover:bg-[#E5DFD6] hover:text-[#171717]"
                  }`}
                >
                  <Icon name={icon} className="h-4 w-4" />
                  {label}
                </a>
              );
            })}
          </nav>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A7B4F]">{eyebrow}</p>
              <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.03em] sm:text-3xl lg:text-4xl">{title}</h1>
              <p className="mt-1.5 max-w-[60ch] text-sm text-[#6B6660]">{description}</p>
            </div>
            {action}
          </div>
          <section className="mt-5 rounded-[22px] bg-[#EEEEEC] p-4 sm:mt-6 sm:p-5 lg:p-6">{children}</section>
        </div>
      </main>
    </>
  );
}