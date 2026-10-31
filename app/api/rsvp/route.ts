import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, GuestWish, RSVP } from "@/app/lib/models";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || body.fullName || "").trim();
    const rawResponse = body.response || body.attendance || body.attendanceStatus;
    const response = (rawResponse === "accept" || rawResponse === "ATTENDING")
      ? "accept"
      : (rawResponse === "decline" || rawResponse === "NOT_ATTENDING")
      ? "decline"
      : "";
    const note = String(body.note || body.wish || "").trim();
    const guestCount = Number(body.guestCount || body.attendeeCount) || 1;
    const email = typeof body.email === "string" && body.email.trim() ? body.email.toLowerCase().trim() : undefined;

    if (!name || !response || !note) {
      return NextResponse.json(
        { error: "Name, wish, and attendance response are required." },
        { status: 400 }
      );
    }

    if (name.length > 120 || note.length > 2000) {
      return NextResponse.json({ error: "Invalid RSVP data." }, { status: 400 });
    }

    await connectMongo();

    const guestFilter = email ? { email } : { fullName: name };
    const guestUpdate = {
      fullName: name,
      ...(email ? { email } : {}),
    };

    const guest = await Guest.findOneAndUpdate(
      guestFilter,
      { $set: guestUpdate },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await RSVP.findOneAndUpdate(
      { guestId: guest._id, invitationId: null },
      {
        guestId: guest._id,
        attendanceStatus: response === "accept" ? "ATTENDING" : "NOT_ATTENDING",
        attendeeCount: response === "accept" ? Math.min(20, Math.max(1, guestCount)) : 0,
        wish: note,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Mirror the message into the guestbook so it shows on the admin Wishes tab.
    await GuestWish.findOneAndUpdate(
      { guestId: guest._id, source: "RSVP" },
      { $set: { message: note, guestId: guest._id, source: "RSVP" } },
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
