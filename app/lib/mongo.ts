import "server-only";

import dns from "node:dns";
import mongoose from "mongoose";

const globalForMongo = globalThis as unknown as {
  mongoose?: Promise<typeof mongoose>;
  mongoDnsReady?: boolean;
};

function mongoUri() {
  const base = process.env.MONGODB_URI;
  if (!base) throw new Error("MONGODB_URI is not configured.");
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  if (!username || !password) return base;
  const url = new URL(base);
  url.username = username;
  url.password = password;
  return url.toString();
}

/**
 * Some local networks (common with consumer routers) refuse the DNS SRV
 * queries the Node resolver uses server-side, which makes `mongodb+srv://`
 * URIs fail with `querySrv ECONNREFUSED` even though the cluster is reachable.
 * Probe the lookup once and, only if it fails, switch to public resolvers.
 * Override the resolvers with MONGODB_DNS_SERVERS, or set it to "off" to skip.
 */
async function ensureSrvResolution(uri: string) {
  if (globalForMongo.mongoDnsReady) return;
  if (!uri.startsWith("mongodb+srv://")) {
    globalForMongo.mongoDnsReady = true;
    return;
  }

  const host = new URL(uri).hostname;
  try {
    await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
    globalForMongo.mongoDnsReady = true;
    return;
  } catch {
    const configured = process.env.MONGODB_DNS_SERVERS;
    if (configured === "off") {
      globalForMongo.mongoDnsReady = true;
      return;
    }
    const servers = (configured || "8.8.8.8,1.1.1.1")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (servers.length) dns.setServers(servers);
    globalForMongo.mongoDnsReady = true;
  }
}

export async function connectMongo() {
  if (!globalForMongo.mongoose) {
    const uri = mongoUri();
    await ensureSrvResolution(uri);
    globalForMongo.mongoose = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || "baseleal_bethel",
        serverSelectionTimeoutMS: 7000,
      })
      .catch((error) => {
        globalForMongo.mongoose = undefined;
        throw error;
      });
  }
  return globalForMongo.mongoose;
}
