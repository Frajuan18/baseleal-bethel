import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { GuestWish } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") || "").trim().slice(0, 80);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  try {
    await connectMongo();
    const filter = query ? { message: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {};
    const [items, total] = await Promise.all([GuestWish.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("guestId", "fullName").lean(), GuestWish.countDocuments(filter)]);
    return NextResponse.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
}

