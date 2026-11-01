import { config } from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env") });

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const mongoUri = process.env.MONGODB_URI;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!botToken) {
  console.error("❌ Error: TELEGRAM_BOT_TOKEN is not set in .env.local or .env");
  console.log("👉 Add TELEGRAM_BOT_TOKEN=your_bot_token to baseleal-bethel/.env.local");
  process.exit(1);
}

if (!mongoUri) {
  console.error("❌ Error: MONGODB_URI is not set in .env");
  process.exit(1);
}

console.log("Connecting to MongoDB Atlas...");
await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB || "baseleal_bethel" });
console.log("✅ MongoDB connected successfully!");

// Dynamically import the handler logic
const { handleTelegramUpdate, callTelegramApi } = await import("../.next/server/app/lib/telegram-bot.js").catch(async () => {
  // If not built into .next, import directly via tsx / node
  return import("../app/lib/telegram-bot.ts");
});

console.log("🤖 Wedding Invitation Telegram Bot running in polling mode...");
console.log("Send /start to your bot in Telegram to begin generating invitations!\n");

let offset = 0;

while (true) {
  try {
    const res = await callTelegramApi(botToken, "getUpdates", {
      offset,
      timeout: 25,
      allowed_updates: ["message", "callback_query"],
    });

    if (res.ok && Array.isArray(res.result)) {
      for (const update of res.result) {
        offset = update.update_id + 1;
        try {
          await handleTelegramUpdate(update, botToken, siteUrl);
        } catch (updateErr) {
          console.error("Error processing update:", updateErr);
        }
      }
    }
  } catch (pollErr) {
    console.error("Polling error (retrying in 3s):", pollErr?.message || pollErr);
    await new Promise((r) => setTimeout(r, 3000));
  }
}
