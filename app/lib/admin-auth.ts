import "server-only";

import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bb_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encodeSession(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value: string | undefined) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; expiresAt?: number };
    if (!parsed.email || !parsed.expiresAt || parsed.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function setAdminSession(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, expires: new Date(0), sameSite: "lax", path: "/" });
}

export function isConfiguredAdmin(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  if (!configuredEmail || !configuredHash || email !== configuredEmail) return false;

  const [salt, digest] = configuredHash.split(":");
  if (!salt || !digest) return false;
  try {
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(digest, "hex");
    return expected.length === derived.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
