import { Suspense } from "react";
import { InvitationRedirect } from "./redirect";

export default function InvitationRedirectPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-[#F7F0E6] p-6 text-center font-serif text-xl text-[#4A3025]">
          Opening your invitation…
        </main>
      }
    >
      <InvitationRedirect />
    </Suspense>
  );
}