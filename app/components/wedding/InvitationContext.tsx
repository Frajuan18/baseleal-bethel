"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type InvitationInfo = { guestName?: string; invitationType?: string };

type InvitationState = {
  invitation: InvitationInfo | null;
  hasToken: boolean;
  token: string | undefined;
};

const InvitationContext = createContext<InvitationState>({ invitation: null, hasToken: false, token: undefined });

export function InvitationProvider({ token, children }: { token?: string; children: ReactNode }) {
  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    fetch(`/api/public/invitations/${encodeURIComponent(token)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (active) setInvitation(data.invitation ?? null);
      })
      .catch(() => {
        if (active) setInvitation(null);
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