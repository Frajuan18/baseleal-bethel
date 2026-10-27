"use client";

import { useEffect, useState } from "react";
import { AdminTabShell } from "../_components/AdminTabShell";
import { Icon } from "@/app/components/dashboard/Icon";

export default function WishesPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<{ _id: string; message: string; createdAt: string; guestId?: { fullName?: string } }[]>([]);

  useEffect(() => {
    fetch(`/api/admin/wishes?q=${encodeURIComponent(query)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]));
  }, [query]);

  return (
    <AdminTabShell
      active="/admin/wishes"
      eyebrow="Messages"
      title="Guest wishes"
      description="Read the notes and blessings shared by your guests."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Latest messages</h2>
          <p className="mt-0.5 text-xs text-[#6B6660]">Guest-submitted text is displayed safely as plain text.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#736C64]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wishes"
              type="search"
              className="h-11 w-full rounded-full border border-[#E1D9CF] bg-white pl-10 pr-4 text-base text-[#171717] outline-none transition placeholder:text-[#9A938B] focus:border-[#C9B79F] focus:ring-2 focus:ring-[#C2491A]/15 sm:text-sm"
            />
          </div>
          <span className="hidden shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-[#6B6660] sm:inline-flex">
            {items.length} shown
          </span>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#EDE9E2] bg-white">
        {items.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-serif text-xl text-[#4A443E]">No wishes yet.</p>
            <p className="mx-auto mt-1.5 max-w-[38ch] text-sm text-[#6B6660]">Guest messages will appear here after they submit them.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item._id} className="border-b border-[#F0EEEB] p-4 last:border-0 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold">{item.guestId?.fullName || "Guest"}</p>
                <time className="shrink-0 text-[11px] font-medium text-[#736C64]">{new Date(item.createdAt).toLocaleDateString()}</time>
              </div>
              <p className="mt-2.5 max-w-[70ch] whitespace-pre-wrap text-[15px] leading-relaxed text-[#4A443E]">{item.message}</p>
            </article>
          ))
        )}
      </div>
    </AdminTabShell>
  );
}