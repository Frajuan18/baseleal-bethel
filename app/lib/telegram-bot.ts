import {
  getInvitationTypeLabel,
  venuesToInvitationType,
  type VenueSelection,
} from "@/app/lib/venues";
import { createPersonalizedInvitation } from "@/app/lib/invitation-service";

type BotSession = {
  name: string;
  venues: VenueSelection;
  updatedAt: number;
};

// In-memory cache for active invitation generation sessions by session ID
const sessions = new Map<string, BotSession>();

function getSession(id: string): BotSession | null {
  const s = sessions.get(id);
  if (!s) return null;
  // Expire after 2 hours
  if (Date.now() - s.updatedAt > 2 * 60 * 60 * 1000) {
    sessions.delete(id);
    return null;
  }
  return s;
}

function saveSession(id: string, s: BotSession) {
  sessions.set(id, { ...s, updatedAt: Date.now() });
}

export async function callTelegramApi(
  token: string,
  method: string,
  body: Record<string, unknown>
) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

function buildVenueKeyboard(sessionId: string, venues: VenueSelection) {
  const churchIcon = venues.church ? "✅" : "❌";
  const basselealIcon = venues.basseleal ? "✅" : "❌";
  const bethelIcon = venues.bethel ? "✅" : "❌";

  return {
    inline_keyboard: [
      [
        {
          text: `${churchIcon} Church Ceremony (3:00 PM)`,
          callback_data: `v:church:${sessionId}`,
        },
      ],
      [
        {
          text: `${basselealIcon} Basseleal's House (10:30 AM)`,
          callback_data: `v:basseleal:${sessionId}`,
        },
      ],
      [
        {
          text: `${bethelIcon} Bethel's House (10:30 AM)`,
          callback_data: `v:bethel:${sessionId}`,
        },
      ],
      [
        {
          text: "🔗 Generate Invitation Link",
          callback_data: `gen:${sessionId}`,
        },
      ],
    ],
  };
}

export function formatSessionMessage(guestName: string, venues: VenueSelection) {
  const label = getInvitationTypeLabel(venuesToInvitationType(venues));
  return (
    `💌 *Basseleal & Bethel Wedding Invitation*\n\n` +
    `Guest Name: *${guestName}*\n` +
    `Current Combination: *${label}*\n\n` +
    `Click any of the 3 buttons below to toggle what venues are included for this guest, then tap *Generate Invitation Link*:`
  );
}

export async function handleTelegramUpdate(update: any, botToken: string, baseUrl?: string) {
  // 1. Handle Callback Query (Toggling venue options or generating link)
  if (update.callback_query) {
    const cb = update.callback_query;
    const data: string = cb.data || "";
    const chatId = cb.message?.chat?.id;
    const messageId = cb.message?.message_id;

    // Toggle a venue option: "v:<venue>:<sessionId>"
    if (data.startsWith("v:")) {
      const [, venueKey, sessionId] = data.split(":");
      const session = getSession(sessionId);

      if (!session) {
        await callTelegramApi(botToken, "answerCallbackQuery", {
          callback_query_id: cb.id,
          text: "Session expired. Please send the guest's name again.",
          show_alert: true,
        });
        return;
      }

      if (venueKey === "church" || venueKey === "basseleal" || venueKey === "bethel") {
        const nextVenues = {
          ...session.venues,
          [venueKey]: !session.venues[venueKey as keyof VenueSelection],
        };

        // Ensure at least one venue remains selected
        if (!nextVenues.church && !nextVenues.basseleal && !nextVenues.bethel) {
          await callTelegramApi(botToken, "answerCallbackQuery", {
            callback_query_id: cb.id,
            text: "Please keep at least one venue selected.",
            show_alert: false,
          });
          return;
        }

        session.venues = nextVenues;
        saveSession(sessionId, session);

        await callTelegramApi(botToken, "answerCallbackQuery", {
          callback_query_id: cb.id,
          text: `Updated: ${getInvitationTypeLabel(venuesToInvitationType(nextVenues))}`,
        });

        await callTelegramApi(botToken, "editMessageText", {
          chat_id: chatId,
          message_id: messageId,
          text: formatSessionMessage(session.name, session.venues),
          parse_mode: "Markdown",
          reply_markup: buildVenueKeyboard(sessionId, session.venues),
        });
      }
      return;
    }

    // Generate link: "gen:<sessionId>"
    if (data.startsWith("gen:")) {
      const [, sessionId] = data.split(":");
      const session = getSession(sessionId);

      if (!session) {
        await callTelegramApi(botToken, "answerCallbackQuery", {
          callback_query_id: cb.id,
          text: "Session expired. Please type the guest name again.",
          show_alert: true,
        });
        return;
      }

      const invitationType = venuesToInvitationType(session.venues);
      const invitation = await createPersonalizedInvitation(session.name, invitationType, baseUrl);
      const label = getInvitationTypeLabel(invitationType);

      await callTelegramApi(botToken, "answerCallbackQuery", {
        callback_query_id: cb.id,
        text: "Invitation link generated!",
      });

      const confirmationText =
        `🎉 *Digital Invitation Link Generated!*\n\n` +
        `👤 *Guest:* ${session.name}\n` +
        `📍 *Access:* ${label}\n` +
        `📅 *Date:* ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም (Dec 26, 2026)\n\n` +
        `🔗 *Personalized Link:*\n${invitation.shareUrl}\n\n` +
        `💬 *Message to Forward to Guest:*\n` +
        `ለተከበሩ ${session.name}፣\n` +
        `የባስልኤል እና የቤቴል የሰርግ ጥሪ ካርድዎን ከታች ባለው ሊንክ ይመልከቱ እንዲሁም የመገኘትዎን ሁኔታ (RSVP) በበይነ-መረብ ያሳውቁን።\n` +
        `${invitation.shareUrl}`;

      // Edit original prompt message into the generated result
      await callTelegramApi(botToken, "editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: confirmationText,
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      });

      // Clear session
      sessions.delete(sessionId);
      return;
    }
  }

  // 2. Handle Text Message
  if (update.message?.text) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const rawText = msg.text.trim();

    if (rawText === "/start" || rawText === "/help") {
      const helpText =
        `💒 *Basseleal & Bethel Wedding Invitation Bot*\n\n` +
        `Welcome! You can generate personalized invitation links with any combination of venues directly from this bot.\n\n` +
        `*How to use:*\n` +
        `1️⃣ Send any guest's name (e.g. \`Abebe Bikila\`) or \`/invite Abebe Bikila\`\n` +
        `2️⃣ Use the 3 interactive buttons to click/unclick any combination:\n` +
        `   • Church Ceremony (3:00 PM)\n` +
        `   • Basseleal's House (10:30 AM)\n` +
        `   • Bethel's House (10:30 AM)\n` +
        `3️⃣ Tap *Generate Invitation Link* to receive the shareable link!\n\n` +
        `_The invitation card & RSVP section will adapt to the exact combination you chose._`;

      await callTelegramApi(botToken, "sendMessage", {
        chat_id: chatId,
        text: helpText,
        parse_mode: "Markdown",
      });
      return;
    }

    // Extract guest name (either from `/invite Name` or plain text name)
    let guestName = rawText;
    if (guestName.startsWith("/invite")) {
      guestName = guestName.replace(/^\/invite\s*/i, "").trim();
    }

    if (!guestName) {
      await callTelegramApi(botToken, "sendMessage", {
        chat_id: chatId,
        text: "Please send the guest's full name. Example:\n`/invite Abebe Bikila`",
        parse_mode: "Markdown",
      });
      return;
    }

    const sessionId = Math.random().toString(36).slice(2, 10);
    const initialVenues: VenueSelection = {
      church: true,
      basseleal: false,
      bethel: false,
    };

    saveSession(sessionId, {
      name: guestName,
      venues: initialVenues,
      updatedAt: Date.now(),
    });

    await callTelegramApi(botToken, "sendMessage", {
      chat_id: chatId,
      text: formatSessionMessage(guestName, initialVenues),
      parse_mode: "Markdown",
      reply_markup: buildVenueKeyboard(sessionId, initialVenues),
    });
  }
}
