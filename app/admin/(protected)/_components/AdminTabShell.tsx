import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminTabShell({ active, eyebrow, title, description, action, children }: { active: string; eyebrow: string; title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <><AdminSidebar active={active} /><main className="min-h-screen bg-[#F8F8F7] px-5 py-6 pb-28 text-[#171717] sm:px-8 lg:px-10 lg:py-9"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs text-[#777774]">Private administration</p><p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A58B68]">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h1><p className="mt-2 text-sm text-[#777774]">{description}</p></div>{action}</div><section className="mt-8 rounded-[20px] bg-[#EEEEEC] p-5 sm:p-6">{children}</section></div></main></>;
}

