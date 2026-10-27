import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin-auth";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return session;
}

