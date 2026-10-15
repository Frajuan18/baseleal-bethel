import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, response, guestCount, dietary, note } = body;

    if (!name || !email || !response) {
      return NextResponse.json(
        { error: "Name, email, and attendance response are required." },
        { status: 400 }
      );
    }

    // In a production backend setup:
    // await prisma.rsvp.create({ data: { name, email, response, guestCount, dietary, note } });
    // Or send notification email via Resend / SendGrid

    console.log("[RSVP RECEIVED]:", {
      name,
      email,
      response,
      guestCount,
      dietary,
      note,
      receivedAt: new Date().toISOString(),
    });

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
    console.error("[RSVP ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to process RSVP submission." },
      { status: 500 }
    );
  }
}
