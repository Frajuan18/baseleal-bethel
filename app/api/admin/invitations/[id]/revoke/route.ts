import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { AuditLog, Invitation } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    await connectMongo();
    const invitation = await Invitation.findByIdAndUpdate(id, { status: "REVOKED" }, { new: true });
    if (!invitation) return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    await AuditLog.create({ action: "INVITATION_REVOKED", actor: auth.email, targetId: id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not revoke invitation." }, { status: 503 });
  }
}

