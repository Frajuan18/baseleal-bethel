"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) setError("Unable to sign in with those details.");
    else window.location.assign("/admin");
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-5 py-8 text-[#2B211D] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-[#DDD9D2] bg-[#FBFCFD] shadow-[0_24px_80px_rgba(67,48,36,0.12)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden min-h-[570px] overflow-hidden bg-[#4A3025] md:block">
            <Image src="/card flower.png" alt="" fill className="object-cover object-top opacity-30 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A3025] via-transparent to-[#1C1512]/60" />
            <div className="relative flex h-full flex-col justify-between p-10 text-[#F8F1E8]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D8BC82]">Private administration</span>
              <div>
                <p className="mb-5 font-serif text-5xl leading-[0.95]">Baseleal<br /><em>&amp;</em> Bethel</p>
                <p className="max-w-xs text-sm leading-6 text-[#E8DCCF]/75">A quiet space to care for every guest, wish, and invitation.</p>
              </div>
              <span className="text-xs tracking-[0.16em] text-[#E8DCCF]/55">BB / 2027</span>
            </div>
          </div>
          <div className="flex min-h-[570px] flex-col justify-center p-7 sm:p-12 lg:p-16">
            <div className="mb-10">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9A753F]">Welcome back</p>
              <h1 className="font-serif text-4xl tracking-[-0.03em] text-[#2B211D] sm:text-5xl">Sign in quietly.</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#776E68]">This area is reserved for the wedding administrator.</p>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <label className="block text-xs font-medium text-[#4B4039]">Administrator email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="username" required className="mt-2 w-full rounded-xl border border-[#D8D5CF] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#9A753F] focus:ring-4 focus:ring-[#C9A75F]/15" /></label>
              <label className="block text-xs font-medium text-[#4B4039]">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-[#D8D5CF] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#9A753F] focus:ring-4 focus:ring-[#C9A75F]/15" /></label>
              {error && <p role="alert" className="rounded-lg bg-[#F4E9E6] px-3 py-2.5 text-xs text-[#8C4439]">{error}</p>}
              <button disabled={busy} className="w-full rounded-xl bg-[#2B211D] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FCF8F2] transition hover:bg-[#51392D] disabled:cursor-wait disabled:opacity-60">{busy ? "Checking…" : "Enter dashboard"}</button>
            </form>
            <p className="mt-8 text-center text-[11px] leading-5 text-[#958B83]">Access is protected by a server-side session. No registration is available.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

