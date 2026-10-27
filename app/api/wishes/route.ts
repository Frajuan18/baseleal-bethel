import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Guest, GuestWish } from "@/app/lib/models";

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

    if (typeof name !== "string" || name.trim().length > 120 || typeof message !== "string" || message.trim().length > 2000) {
      return NextResponse.json({ error: "Invalid wish data." }, { status: 400 });
    }
    await connectMongo();
    const guest = await Guest.findOneAndUpdate({ fullName: name.trim() }, { $setOnInsert: { fullName: name.trim() } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    const wish = await GuestWish.create({ guestId: guest._id, message: message.trim(), source: "GUESTBOOK" });

    return NextResponse.json(
      {
        success: true,
        message: "Wish received successfully with love.",
        wish: {
          id: String(wish._id),
          name,
          relationship: relationship || "Guest",
          message,
          date: wish.createdAt,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to process wish submission." },
      { status: 503 }
    );
  }
}
