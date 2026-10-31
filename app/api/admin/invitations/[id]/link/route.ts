import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { AuditLog, Invitation } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";
import { createInvitationToken } from "@/app/lib/invitation-token";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    await connectMongo();
    const invitation = await Invitation.findById(id).populate("guestId", "fullName");
    if (!invitation || invitation.status === "REVOKED") {
      return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    }
    const guest = invitation.guestId as { fullName?: string };
    const { token, tokenHash } = createInvitationToken();
    const guestParam = guest?.fullName ? `&to=${encodeURIComponent(guest.fullName)}` : "";
    const shareUrl = `/?invite=${token}${guestParam}`;
    invitation.tokenHash = tokenHash;
    invitation.shareUrl = shareUrl;
    await invitation.save();
    await AuditLog.create({ action: "INVITATION_LINK_ROTATED", actor: auth.email, targetId: id });
    return NextResponse.json({ url: shareUrl });
  } catch {
    return NextResponse.json({ error: "Could not create invitation link." }, { status: 503 });
  }
}