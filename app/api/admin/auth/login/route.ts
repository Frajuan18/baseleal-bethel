import { NextResponse } from "next/server";
import { isConfiguredAdmin, setAdminSession } from "@/app/lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const key = (body.email || "unknown").trim().toLowerCase();
    const now = Date.now();
    const current = attempts.get(key);
    if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    if (!body.email || !body.password || !isConfiguredAdmin(body.email, body.password)) {
      const next = current && current.resetAt > now ? { count: current.count + 1, resetAt: current.resetAt } : { count: 1, resetAt: now + WINDOW_MS };
      attempts.set(key, next);
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    attempts.delete(key);
    await setAdminSession(body.email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Authentication unavailable." }, { status: 503 });
  }
}
