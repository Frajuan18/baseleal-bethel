import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, GuestWish, Invitation, RSVP } from "@/app/lib/models";
import { hashInvitationToken } from "@/app/lib/invitation-token";

async function handleInvitationRsvp(
  request: Request,
  params: { token: string }
) {
  try {
    const { token } = params;
    const body = (await request.json()) as {
      name?: string;
      fullName?: string;
      attendance?: string;
      attendanceStatus?: string;
      response?: string;
      churchAttendance?: boolean;
      homeAttendance?: boolean;
      attendeeCount?: number;
      guestCount?: number;
      wish?: string;
      note?: string;
    };

    const guestName = String(body.name || body.fullName || "").trim();
    const rawAttendance = body.attendance || body.attendanceStatus || body.response;
    const attendance = (rawAttendance === "accept" || rawAttendance === "ATTENDING")
      ? "ATTENDING"
      : (rawAttendance === "decline" || rawAttendance === "NOT_ATTENDING")
      ? "NOT_ATTENDING"
      : "";

    if (!attendance) {
      return NextResponse.json({ error: "Attendance response is required." }, { status: 400 });
    }

    await connectMongo();
    const invitation = await Invitation.findOne({
      tokenHash: hashInvitationToken(token),
      status: "ACTIVE",
    });

    if (!invitation || (invitation.expiresAt && new Date(invitation.expiresAt) < new Date())) {
      return NextResponse.json({ error: "Invitation unavailable." }, { status: 404 });
    }

    const guest = await Guest.findById(invitation.guestId);
    if (!guest) {
      return NextResponse.json({ error: "Invitation unavailable." }, { status: 404 });
    }

    if (guestName && guest.fullName !== guestName) {
      guest.fullName = guestName;
      await guest.save();
    }

    const isChurchAndHome = ["CHURCH_AND_HOME", "CHURCH_AND_BOTH", "CHURCH_AND_BASSELEAL", "CHURCH_AND_BETHEL"].includes(invitation.invitationType);
    const homeAttendance = isChurchAndHome ? Boolean(body.homeAttendance) : false;
    const wish = String(body.wish || body.note || "").trim().slice(0, 2000);
    const attendeeCount = attendance === "ATTENDING"
      ? Math.min(20, Math.max(1, Number(body.attendeeCount || body.guestCount) || 1))
      : 0;

    await RSVP.findOneAndUpdate(
      { guestId: guest._id, invitationId: invitation._id },
      {
        guestId: guest._id,
        invitationId: invitation._id,
        attendanceStatus: attendance,
        attendeeCount,
        churchAttendance: Boolean(body.churchAttendance),
        homeAttendance,
        wish,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (wish) {
      await GuestWish.findOneAndUpdate(
        { guestId: guest._id, source: "RSVP" },
        { $set: { message: wish, guestId: guest._id, source: "RSVP" } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[INVITATION_RSVP_ERROR]", err);
    return NextResponse.json({ error: "Could not save RSVP." }, { status: 503 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  return handleInvitationRsvp(request, await params);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  return handleInvitationRsvp(request, await params);
}

