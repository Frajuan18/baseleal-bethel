import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getAdminSession } from "@/app/lib/admin-auth";

export const instant = false;

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return children;
}
