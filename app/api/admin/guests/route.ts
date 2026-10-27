import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, Invitation, RSVP } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") || "").trim().slice(0, 80);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  try {
    await connectMongo();
    const filter = query ? { fullName: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {};
    const [items, total] = await Promise.all([
      Guest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Guest.countDocuments(filter),
    ]);
    const ids = items.map((item) => item._id);
    const [invitations, rsvps] = await Promise.all([Invitation.find({ guestId: { $in: ids } }).lean(), RSVP.find({ guestId: { $in: ids } }).lean()]);
    const rows = items.map((guest) => ({ ...guest, invitation: invitations.find((item) => String(item.guestId) === String(guest._id)) || null, rsvp: rsvps.find((item) => String(item.guestId) === String(guest._id)) || null }));
    return NextResponse.json({ items: rows, page, limit, total, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
}

