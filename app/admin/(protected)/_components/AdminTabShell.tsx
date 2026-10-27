import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

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
      <AdminSidebar active={active} />
      <main className="min-h-dvh bg-[#F8F8F7] px-4 pb-[calc(6rem_+_env(safe-area-inset-bottom))] pt-5 text-[#171717] sm:px-6 sm:pt-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-[1440px]">
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