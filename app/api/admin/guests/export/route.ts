import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, RSVP } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    await connectMongo();
    const [guests, rsvps] = await Promise.all([Guest.find().sort({ fullName: 1 }).lean(), RSVP.find().lean()]);
    const rows = [
      ["Full name", "Email", "Status", "Attendees", "Church", "Home", "Updated"],
      ...guests.map((guest) => {
        const rsvp = rsvps.find((item) => String(item.guestId) === String(guest._id));
        return [guest.fullName, guest.email, rsvp?.attendanceStatus || "PENDING", rsvp?.attendeeCount || 0, rsvp?.churchAttendance ?? "", rsvp?.homeAttendance ?? "", rsvp?.updatedAt || guest.updatedAt];
      }),
    ];
    const body = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    return new NextResponse(body, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=baseleal-bethel-guests.csv", "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
}

