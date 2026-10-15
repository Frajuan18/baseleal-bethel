import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message, relationship } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required fields." },
        { status: 400 }
      );
    }

    // In a production backend setup with a database (e.g. Supabase, PostgreSQL, Prisma):
    // await prisma.wish.create({ data: { name, relationship, message } });

    console.log("[WISH RECEIVED]:", {
      name,
      relationship,
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Wish received successfully with love.",
        wish: {
          id: `wish-${Date.now()}`,
          name,
          relationship: relationship || "Guest",
          message,
          date: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[WISH ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to process wish submission." },
      { status: 500 }
    );
  }
}
