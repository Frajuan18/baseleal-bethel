import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Invitation } from "@/app/lib/models";
import { hashInvitationToken } from "@/app/lib/invitation-token";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    await connectMongo();
    const invitation = await Invitation.findOne({ tokenHash: hashInvitationToken(token), status: "ACTIVE" }).populate("guestId", "fullName").lean();
    if (!invitation || (invitation.expiresAt && new Date(invitation.expiresAt) < new Date())) return NextResponse.json({ error: "Invitation unavailable." }, { status: 404 });
    const guest = invitation.guestId as { fullName?: string };
    return NextResponse.json({ invitation: { guestName: guest?.fullName, invitationType: invitation.invitationType } });
  } catch {
    return NextResponse.json({ error: "Invitation unavailable." }, { status: 503 });
  }
}
