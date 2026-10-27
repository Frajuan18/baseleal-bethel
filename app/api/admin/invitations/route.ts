import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { AuditLog, Guest, Invitation, RSVP } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";
import { createInvitationToken } from "@/app/lib/invitation-token";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    await connectMongo();
    const items = await Invitation.find({ status: { $ne: "REVOKED" } }).sort({ createdAt: -1 }).limit(100).populate("guestId", "fullName email").lean();
    const rsvps = await RSVP.find({ invitationId: { $in: items.map((item) => item._id) } }).lean();
    return NextResponse.json({ items: items.map((item) => ({ ...item, rsvp: rsvps.find((rsvp) => String(rsvp.invitationId) === String(item._id)) || null })) });
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await request.json() as { fullName?: string; email?: string; invitationType?: string; expiresAt?: string; note?: string };
    if (!body.fullName?.trim() || !["CHURCH_ONLY", "CHURCH_AND_HOME"].includes(body.invitationType || "")) return NextResponse.json({ error: "Name and invitation type are required." }, { status: 400 });
    await connectMongo();
    const guest = await Guest.findOneAndUpdate({ fullName: body.fullName.trim() }, { $set: { fullName: body.fullName.trim(), ...(body.email ? { email: body.email.toLowerCase().trim() } : {}) } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    const { token, tokenHash } = createInvitationToken();
    const shareUrl = `/?invite=${token}`;
    const invitation = await Invitation.create({ guestId: guest._id, tokenHash, shareUrl, invitationType: body.invitationType, expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined, note: body.note?.slice(0, 500) });
    await AuditLog.create({ action: "INVITATION_CREATED", actor: auth.email, targetId: String(invitation._id) });
    return NextResponse.json({ invitation: { id: invitation._id, guestName: guest.fullName, invitationType: invitation.invitationType, url: shareUrl } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create invitation." }, { status: 503 });
  }
}

