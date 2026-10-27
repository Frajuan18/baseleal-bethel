"use client";

import { useState } from "react";
import { Icon } from "./Icon";

type TelegramWindow = Window & {
  Telegram?: { WebApp?: { openTelegramLink?: (url: string) => void } };
};

/**
 * Copy + Telegram share for an invitation link.
 * `url` may be relative (e.g. /invite/<token>); it is resolved against the
 * current origin at click time so the copied/shared link is absolute.
 */
export function InviteLinkActions({ url, guestName }: { url: string; guestName?: string }) {
  const [copied, setCopied] = useState(false);

  const absolute = typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;
  const text = guestName
    ? `${guestName}, you are warmly invited to celebrate with Baseleal & Bethel.`
    : "You are warmly invited to celebrate with Baseleal & Bethel.";
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(absolute)}&text=${encodeURIComponent(text)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the link stays visible to copy by hand.
    }
  }

  function shareToTelegram() {
    const webApp = (window as TelegramWindow).Telegram?.WebApp;
    if (webApp?.openTelegramLink) {
      webApp.openTelegramLink(telegram);
      return;
    }
    window.open(telegram, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[#D8D0C7] px-4 text-xs font-semibold text-[#5F4B3C] transition hover:bg-[#F6F1EA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2491A]/40"
      >
        <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        type="button"
        onClick={shareToTelegram}
        className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#15709B] px-4 text-xs font-semibold text-white transition hover:bg-[#115B7E] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15709B]/40 focus-visible:ring-offset-2"
      >
        <Icon name="send" className="h-4 w-4" />
        Telegram
      </button>
    </div>
  );
}