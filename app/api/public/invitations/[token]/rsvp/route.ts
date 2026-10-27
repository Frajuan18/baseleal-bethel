import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, Invitation, RSVP } from "@/app/lib/models";
import { hashInvitationToken } from "@/app/lib/invitation-token";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await request.json() as { name?: string; attendance?: string; churchAttendance?: boolean; homeAttendance?: boolean; attendeeCount?: number; wish?: string };
    if (!body.name?.trim() || !["ATTENDING", "NOT_ATTENDING"].includes(body.attendance || "")) return NextResponse.json({ error: "Name and attendance are required." }, { status: 400 });
    await connectMongo();
    const invitation = await Invitation.findOne({ tokenHash: hashInvitationToken(token), status: "ACTIVE" });
    if (!invitation || (invitation.expiresAt && new Date(invitation.expiresAt) < new Date())) return NextResponse.json({ error: "Invitation unavailable." }, { status: 404 });
    const guest = await Guest.findById(invitation.guestId);
    if (!guest) return NextResponse.json({ error: "Invitation unavailable." }, { status: 404 });
    const homeAttendance = invitation.invitationType === "CHURCH_AND_HOME" ? Boolean(body.homeAttendance) : false;
    await RSVP.findOneAndUpdate({ guestId: guest._id, invitationId: invitation._id }, { guestId: guest._id, invitationId: invitation._id, attendanceStatus: body.attendance, attendeeCount: body.attendance === "ATTENDING" ? Math.min(20, Math.max(1, Number(body.attendeeCount) || 1)) : 0, churchAttendance: Boolean(body.churchAttendance), homeAttendance, wish: body.wish?.slice(0, 2000) }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not save RSVP." }, { status: 503 });
  }
}

