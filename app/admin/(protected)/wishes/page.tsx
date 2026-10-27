"use client";

import { useEffect, useState } from "react";
import { AdminTabShell } from "../_components/AdminTabShell";

export default function WishesPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<{ _id: string; message: string; createdAt: string; guestId?: { fullName?: string } }[]>([]);
  useEffect(() => { fetch(`/api/admin/wishes?q=${encodeURIComponent(query)}`).then((r) => r.ok ? r.json() : Promise.reject()).then((data) => setItems(data.items || [])).catch(() => setItems([])); }, [query]);
  return <AdminTabShell active="/admin/wishes" eyebrow="Messages" title="Guest wishes" description="Read the notes and blessings shared by your guests." action={<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search wishes" className="w-full max-w-xs rounded-full border-0 bg-white px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#A58B68]/30" />}><div className="flex items-center justify-between"><div><h2 className="text-base font-semibold">Latest messages</h2><p className="mt-1 text-xs text-[#777774]">Guest-submitted text is displayed safely as plain text.</p></div><span className="rounded-full bg-white px-3 py-2 text-[10px] text-[#777774]">{items.length} shown</span></div>{items.length === 0 ? <div className="mt-5 rounded-2xl bg-white px-5 py-16 text-center"><p className="font-serif text-2xl text-[#65564D]">No wishes yet.</p><p className="mt-2 text-sm text-[#978D84]">Guest messages will appear here after they submit them.</p></div> : <div className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((item) => <article key={item._id} className="rounded-2xl bg-white p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium">{item.guestId?.fullName || "Guest"}</p><time className="text-[10px] text-[#A0968E]">{new Date(item.createdAt).toLocaleDateString()}</time></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#665B53]">{item.message}</p></article>)}</div>}</AdminTabShell>;
}

