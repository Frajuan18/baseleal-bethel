"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export function InvitationRedirect() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;

  useEffect(() => {
    if (token) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const extra = search && search.startsWith("?") ? `&${search.slice(1)}` : "";
      router.replace(`/?invite=${encodeURIComponent(token)}${extra}`);
    }
  }, [token, router]);

  return null;
}