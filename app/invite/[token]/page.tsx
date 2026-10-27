"use client";

import { FormEvent, useEffect, useState } from "react";
import { coupleName, formatFullWeddingDate, wedding } from "@/config/wedding";

type Invitation = { guestName?: string; invitationType?: string };

const pad2 = (value: number) => String(value).padStart(2, "0");

function dateParts() {
  const [year, month, day] = (wedding.date || "2027-01-03").split("-").map(Number);
  return { year, month, day };
}

function compactDate({ year, month, day }: { year: number; month: number; day: number }) {
  return `${year}${pad2(month)}${pad2(day)}`;
}

function timeStamp(time: string, fallback = "10:00") {
  const [hours, minutes] = (time || fallback).split(":").map(Number);
  return `${pad2(hours)}${pad2(minutes)}00`;
}

function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function icsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function foldLine(line: string) {
  if (line.length <= 73) return line;
  const chunks: string[] = [line.slice(0, 73)];
  let rest = line.slice(73);
  while (rest.length > 72) {
    chunks.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  if (rest) chunks.push(" " + rest);
  return chunks.join("\r\n");
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function PersonalizedInvitation({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState("");
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [status, setStatus] = useState("");
  const [attendance, setAttendance] = useState("ATTENDING");
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    params.then(({ token: value }) => {
      setToken(value);
      fetch(`/api/public/invitations/${value}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((data) => {
          setInvitation(data.invitation);
          setName(data.invitation?.guestName || "");
        })
        .catch(() => setStatus("This invitation is no longer available."));
    });
  }, [params]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/public/invitations/${token}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        attendance,
        churchAttendance: attendance === "ATTENDING",
        homeAttendance: invitation?.invitationType === "CHURCH_AND_HOME",
        wish,
      }),
    });
    setStatus(response.ok ? "Your response has been saved with love." : "We could not save your response.");
  }

  if (!invitation) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#F7F0E6] p-6 text-center font-serif text-2xl text-[#4A3025]">
        {status || "Opening your invitation..."}
      </main>
    );
  }

  const withHome = invitation.invitationType === "CHURCH_AND_HOME";
  const { year, month, day } = dateParts();
  const dateCode = compactDate({ year, month, day });
  const dateLabel = formatFullWeddingDate(wedding.date);

  const plan = [
    { key: "church" as const, ...wedding.schedule.church, ...wedding.locations.church },
    ...(withHome ? [{ key: "home" as const, ...wedding.schedule.home, ...wedding.locations.home }] : []),
  ];
  const startTime = plan[0].start;
  const endTime = plan[plan.length - 1].end;
  const locationText = plan.map((item) => `${item.label}: ${item.address}`).join(" | ");
  const detailsText = `Wedding day schedule\n${plan
    .map((item) => `${item.start}–${item.end}  ${item.label} — ${item.address}`)
    .join("\n")}\n\nWe cannot wait to celebrate with you.`;

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${coupleName} — Wedding Day`
  )}&dates=${dateCode}T${timeStamp(startTime)}/${dateCode}T${timeStamp(
    endTime
  )}&details=${encodeURIComponent(detailsText)}&location=${encodeURIComponent(locationText)}&ctz=${encodeURIComponent("Africa/Addis_Ababa")}`;

  function downloadIcs() {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const events = plan.map((item) =>
      [
        "BEGIN:VEVENT",
        `UID:${item.key}-${dateCode}@baseleal-bethel.wedding`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${dateCode}T${timeStamp(item.start)}`,
        `DTEND:${dateCode}T${timeStamp(item.end)}`,
        foldLine(`SUMMARY:${icsText(`${coupleName} — ${item.label}`)}`),
        foldLine(`LOCATION:${icsText(item.address)}`),
        foldLine(`DESCRIPTION:${icsText(detailsText)}`),
        "END:VEVENT",
      ].join("\r\n")
    );
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Baseleal & Bethel//Wedding Day//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...events,
      "END:VCALENDAR",
    ].join("\r\n");

    const url = window.URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${wedding.couple.first}-${wedding.couple.second}-wedding.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  }

  return (
    <main className="min-h-dvh scroll-smooth bg-[#F7F0E6] px-4 py-8 text-[#2B211D] sm:px-6 sm:py-12">
      <article className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-[#DECDB6] bg-[#FCF7EF] shadow-[0_24px_80px_rgba(74,48,37,0.14)]">
        <header className="px-6 pb-7 pt-10 text-center sm:px-12 sm:pt-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A753F]">A private invitation</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Baseleal <em>&amp;</em> Bethel
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#796B61]">
            {invitation.guestName ? `Dear ${invitation.guestName}, you are` : "You are"} warmly invited to share in our
            wedding celebration.
          </p>
          <a
            href="#invite-actions"
            className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#2B211D] px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#8C6A3B] focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2 focus:ring-offset-[#FCF7EF]"
          >
            View directions &amp; add to calendar
            <span aria-hidden>↓</span>
          </a>
        </header>

        <div className="mx-6 border-y border-[#E5D7C6] py-6 text-center text-sm leading-7 text-[#5D4B40] sm:mx-12">
          <p className="font-serif text-lg text-[#2B211D]">{dateLabel}</p>
          <p>
            {wedding.timeDisplay} · {wedding.city}
          </p>
          <p className="mt-2 text-[#9A753F]">
            {withHome ? "Church ceremony and home reception" : "Church ceremony invitation"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 pb-8 pt-8 text-left sm:px-12">
          <h2 className="font-serif text-2xl">Your RSVP</h2>
          <label className="block text-xs text-[#665850]">
            Full name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[#D9CCBC] bg-white px-4 text-base outline-none focus:border-[#9A753F] sm:text-sm"
            />
          </label>

          <fieldset>
            <legend className="text-xs text-[#665850]">Your response</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttendance("ATTENDING")}
                className={`min-h-[48px] rounded-xl border px-3 text-sm transition ${
                  attendance === "ATTENDING" ? "border-[#9A753F] bg-[#EFE5D5]" : "border-[#D9CCBC] bg-white hover:bg-[#FFFBF4]"
                }`}
              >
                Joyfully attending
              </button>
              <button
                type="button"
                onClick={() => setAttendance("NOT_ATTENDING")}
                className={`min-h-[48px] rounded-xl border px-3 text-sm transition ${
                  attendance === "NOT_ATTENDING" ? "border-[#9A753F] bg-[#EFE5D5]" : "border-[#D9CCBC] bg-white hover:bg-[#FFFBF4]"
                }`}
              >
                Unable to attend
              </button>
            </div>
          </fieldset>

          <label className="block text-xs text-[#665850]">
            A wish for the couple
            <textarea
              value={wish}
              onChange={(event) => setWish(event.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-[#D9CCBC] bg-white px-4 py-3 text-base outline-none focus:border-[#9A753F] sm:text-sm"
            />
          </label>

          <button
            type="submit"
            className="min-h-[48px] w-full rounded-xl bg-[#2B211D] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#8C6A3B] focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2 focus:ring-offset-[#FCF7EF]"
          >
            Send response
          </button>
          {status && (
            <p role="status" className="text-center text-xs text-[#5F7148]">
              {status}
            </p>
          )}
        </form>

        <div id="invite-actions" className="scroll-mt-6 space-y-4 px-6 pb-10 sm:px-12">
          <section className="rounded-2xl border border-[#E5D7C6] bg-white/70 p-4 sm:p-5">
            <h2 className="font-serif text-xl">Directions</h2>
            <p className="mt-1 text-xs text-[#796B61]">Opens the address in Google Maps.</p>
            <div className={`mt-3 grid gap-2 ${withHome ? "sm:grid-cols-2" : ""}`}>
              {plan.map((item) => (
                <a
                  key={item.key}
                  href={mapsLink(item.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[64px] items-center gap-3 rounded-xl border border-[#E1D3C2] bg-white px-4 py-3 transition hover:border-[#9A753F] hover:bg-[#FFFBF4] focus:outline-none focus:ring-2 focus:ring-[#9A753F]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EFE5D5] text-[#8C6A3B]">
                    <PinIcon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#2B211D]">
                      Check address of {item.key}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[#796B61]">{item.address}</span>
                  </span>
                  <span className="ml-auto text-[#9A753F]">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5D7C6] bg-white/70 p-4 sm:p-5">
            <h2 className="font-serif text-xl">Add to calendar</h2>
            <p className="mt-1 text-xs text-[#796B61]">A ready-made template with the day&apos;s schedule.</p>
            <div className={`mt-3 grid gap-2 ${withHome ? "sm:grid-cols-2" : ""}`}>
              <button
                type="button"
                onClick={downloadIcs}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#2B211D] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#8C6A3B] focus:outline-none focus:ring-2 focus:ring-[#8C6A3B] focus:ring-offset-2 focus:ring-offset-[#FCF7EF]"
              >
                <CalendarIcon />
                {downloaded ? "Downloaded" : "Add to calendar"}
              </button>
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#D9CCBC] bg-[#FFFBF4] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#2B211D] transition hover:border-[#9A753F] focus:outline-none focus:ring-2 focus:ring-[#9A753F]"
              >
                <CalendarIcon />
                Google Calendar
              </a>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}