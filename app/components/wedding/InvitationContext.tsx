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
  token,
  initialGuestName,
  children,
}: {
  token?: string;
  initialGuestName?: string;
  children: ReactNode;
}) {
  const [invitation, setInvitation] = useState<InvitationInfo | null>(
    initialGuestName ? { guestName: initialGuestName } : null
  );

  useEffect(() => {
    // Also read direct guest name from URL parameters (e.g. ?to=..., ?name=..., ?guest=...)
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlGuestName = searchParams.get("to") || searchParams.get("name") || searchParams.get("guest") || searchParams.get("for");
      if (urlGuestName) {
        setInvitation((prev) => ({
          ...prev,
          guestName: urlGuestName,
        }));
      }
    }

    if (!token) return;
    let active = true;
    fetch(`/api/public/invitations/${encodeURIComponent(token)}`)
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
        // preserve previous guestName if set
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <InvitationContext.Provider value={{ invitation, hasToken: Boolean(token), token }}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  return useContext(InvitationContext);
}