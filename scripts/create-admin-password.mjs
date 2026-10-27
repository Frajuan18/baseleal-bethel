import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Usage: node scripts/create-admin-password.mjs <password>\nPassword must be at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const digest = scryptSync(password, salt, 64).toString("hex");
const hash = `${salt}:${digest}`;
const envPath = ".env.local";
const current = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const next = current.includes("ADMIN_PASSWORD_HASH=")
  ? current.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${hash}`)
  : `${current}${current && !current.endsWith("\n") ? "\n" : ""}ADMIN_PASSWORD_HASH=${hash}\n`;
writeFileSync(envPath, next, { mode: 0o600 });
console.log(`Wrote ADMIN_PASSWORD_HASH to ${envPath}. Keep this file private.`);

