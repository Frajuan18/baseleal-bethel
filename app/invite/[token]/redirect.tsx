"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export function InvitationRedirect() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;

  useEffect(() => {
    if (token) router.replace(`/?invite=${encodeURIComponent(token)}`);
  }, [token, router]);

  return null;
}