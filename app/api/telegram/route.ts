import { NextResponse } from "next/server";
import { handleTelegramUpdate } from "@/app/lib/telegram-bot";

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN is not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const update = await request.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || undefined;
    await handleTelegramUpdate(update, botToken, siteUrl);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ error: "Failed to process update" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Telegram Wedding Bot Webhook",
    configured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
  });
}
