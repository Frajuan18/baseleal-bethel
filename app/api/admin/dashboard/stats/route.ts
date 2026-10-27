import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, Invitation, RSVP } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    await connectMongo();
    const [total, attending, notAttending, pending, church, home, recent] = await Promise.all([
      RSVP.countDocuments({ attendanceStatus: { $ne: "PENDING" } }),
      RSVP.countDocuments({ attendanceStatus: "ATTENDING" }),
      RSVP.countDocuments({ attendanceStatus: "NOT_ATTENDING" }),
      Invitation.countDocuments({ status: "ACTIVE", _id: { $nin: await RSVP.distinct("invitationId") } }),
      RSVP.countDocuments({ churchAttendance: true }),
      RSVP.countDocuments({ homeAttendance: true }),
      RSVP.find({ attendanceStatus: { $ne: "PENDING" } }).sort({ updatedAt: -1 }).limit(6).populate("guestId", "fullName").lean(),
    ]);
    return NextResponse.json({ stats: { total, attending, notAttending, pending, church, home }, recent });
  } catch (error) {
    console.error(`[MONGO_STATS_ERROR] name=${error instanceof Error ? error.name : "UnknownError"} code=${typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "none"}`);
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
}
