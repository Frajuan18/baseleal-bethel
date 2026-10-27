import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, GuestWish, RSVP } from "@/app/lib/models";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, response, guestCount, dietary, note } = body;

    if (!name || !response || !note) {
      return NextResponse.json(
        { error: "Name, wish, and attendance response are required." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length > 120 || typeof note !== "string" || note.length > 2000 || !["accept", "decline"].includes(response)) {
      return NextResponse.json({ error: "Invalid RSVP data." }, { status: 400 });
    }
    await connectMongo();
    const guest = await Guest.findOneAndUpdate({ email: typeof email === "string" ? email.toLowerCase() : undefined, fullName: name.trim() }, { $set: { fullName: name.trim(), ...(email ? { email } : {}) } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    await RSVP.findOneAndUpdate(
      { guestId: guest._id, invitationId: null },
      { guestId: guest._id, attendanceStatus: response === "accept" ? "ATTENDING" : "NOT_ATTENDING", attendeeCount: response === "accept" ? Math.min(20, Math.max(1, Number(guestCount) || 1)) : 0, wish: note, ...(dietary ? { dietary } : {}) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Mirror the message into the guestbook so it shows on the admin Wishes tab.
    await GuestWish.findOneAndUpdate(
      { guestId: guest._id, source: "RSVP" },
      { $set: { message: note.trim(), guestId: guest._id, source: "RSVP" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "RSVP response recorded successfully.",
        rsvp: {
          id: `rsvp-${Date.now()}`,
          name,
          response,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[RSVP_ERROR] name=${error instanceof Error ? error.name : "UnknownError"} message=${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: "Failed to process RSVP submission." }, { status: 503 }
    );
  }
}
