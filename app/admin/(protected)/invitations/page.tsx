"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminTabShell } from "../_components/AdminTabShell";

type Invitation = { _id: string; createdAt: string; invitationType: string; status: string; guestId?: { fullName?: string } };

export default function InvitationsPage() {
  const [items, setItems] = useState<Invitation[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("CHURCH_ONLY");
  const [created, setCreated] = useState("");
  const load = () => fetch("/api/admin/invitations").then((r) => r.ok ? r.json() : Promise.reject()).then((data) => setItems(data.items || [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); const response = await fetch("/api/admin/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: name, invitationType: type }) }); if (response.ok) { const data = await response.json(); setCreated(data.invitation.url); setName(""); load(); } }
  async function revoke(id: string) { if (!window.confirm("Revoke this invitation link?")) return; await fetch(`/api/admin/invitations/${id}/revoke`, { method: "POST" }); load(); }
  return <AdminTabShell active="/admin/invitations" eyebrow="Access control" title="Invitation links" description="Create, share, and revoke personalized wedding access" action={<span className="rounded-full bg-[#E85A0C] px-4 py-2.5 text-xs font-semibold text-white">Create invitation</span>}>
    <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-[1.2fr_1fr_auto]"><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest full name" className="rounded-full border-0 bg-[#F2F2F0] px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#A58B68]/30" /><select value={type} onChange={(e) => setType(e.target.value)} className="rounded-full border-0 bg-[#F2F2F0] px-4 py-3 text-xs outline-none"><option value="CHURCH_ONLY">Church only</option><option value="CHURCH_AND_HOME">Church + home</option></select><button className="rounded-full bg-[#171717] px-5 py-3 text-xs font-semibold text-white">Generate link</button>{created && <p className="sm:col-span-3 rounded-xl bg-[#E8F0E7] px-3 py-2 text-xs text-[#537452]">Created: {created}</p>}</form>
    <div className="mt-5 overflow-hidden rounded-2xl bg-white"><div className="hidden grid-cols-[1.4fr_1fr_0.8fr_auto] gap-4 border-b border-[#E7E5E1] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#999690] sm:grid"><span>Guest</span><span>Permission</span><span>Status</span><span /></div>{items.length === 0 ? <p className="px-5 py-14 text-center font-serif text-xl text-[#65564D]">No invitation links yet.</p> : items.map((item) => <InvitationRow key={item._id} item={item} revoke={revoke} />)}</div>
  </AdminTabShell>;
}

function InvitationRow({ item, revoke }: { item: Invitation; revoke: (id: string) => void }) {
  const statusClass = item.status === "ACTIVE" ? "bg-[#E8F0E7] text-[#537452]" : "bg-[#F3E7E3] text-[#925A4D]";
  return <div className="grid gap-2 border-b border-[#F0EEEB] px-5 py-4 last:border-0 sm:grid-cols-[1.4fr_1fr_0.8fr_auto] sm:items-center sm:gap-4"><div><p className="text-sm font-medium">{item.guestId?.fullName || "Guest"}</p><p className="mt-1 text-xs text-[#A09B94]">Created {new Date(item.createdAt).toLocaleDateString()}</p></div><span className="text-xs text-[#777774]">{item.invitationType === "CHURCH_ONLY" ? "Church only" : "Church + home"}</span><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] ${statusClass}`}>{item.status}</span>{item.status === "ACTIVE" ? <button onClick={() => revoke(item._id)} className="w-fit rounded-full border border-[#D8D0C7] px-3 py-2 text-[10px] text-[#765D4D]">Revoke</button> : <span />}</div>;
}

