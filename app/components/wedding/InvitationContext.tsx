"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type InvitationInfo = { guestName?: string; invitationType?: string };

type InvitationState = {
  invitation: InvitationInfo | null;
  hasToken: boolean;
  token: string | undefined;
};

const InvitationContext = createContext<InvitationState>({ invitation: null, hasToken: false, token: undefined });

export function InvitationProvider({
  token: initialToken,
  initialGuestName,
  initialInvitation,
  children,
}: {
  token?: string;
  initialGuestName?: string;
  initialInvitation?: InvitationInfo | null;
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | undefined>(initialToken);
  const [invitation, setInvitation] = useState<InvitationInfo | null>(() => {
    if (initialInvitation) return initialInvitation;
    if (initialGuestName) return { guestName: initialGuestName };
    return null;
  });

  useEffect(() => {
    let resolvedToken = token;
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlGuestName = searchParams.get("to") || searchParams.get("name") || searchParams.get("guest") || searchParams.get("for");
      const urlToken = searchParams.get("invite") || searchParams.get("token");

      if (urlGuestName) {
        setInvitation((prev) => ({
          ...prev,
          guestName: urlGuestName,
        }));
      }

      if (urlToken && urlToken !== resolvedToken) {
        resolvedToken = urlToken;
        setToken(urlToken);
      }
    }

    if (!resolvedToken) return;
    let active = true;
    fetch(`/api/public/invitations/${encodeURIComponent(resolvedToken)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (active && data.invitation) {
          setInvitation((prev) => ({
            ...data.invitation,
            guestName: data.invitation.guestName || prev?.guestName,
          }));
        }
      })
      .catch(() => {
        // preserve previous state if already present
      });
    return () => {
      active = false;
    };
  }, [token]);

  const hasToken = Boolean(token || invitation?.invitationType);

  return (
    <InvitationContext.Provider value={{ invitation, hasToken, token }}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  return useContext(InvitationContext);
}