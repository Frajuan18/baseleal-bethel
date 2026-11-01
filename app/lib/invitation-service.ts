import { connectMongo } from "@/app/lib/mongo";
import { Guest, Invitation } from "@/app/lib/models";
import { createInvitationToken } from "@/app/lib/invitation-token";

export async function createPersonalizedInvitation(
  fullName: string,
  invitationType: string,
  baseUrl?: string,
  email?: string
) {
  await connectMongo();
  const trimmed = fullName.trim();
  const guest = await Guest.findOneAndUpdate(
    { fullName: trimmed },
    {
      $set: {
        fullName: trimmed,
        ...(email ? { email: email.toLowerCase().trim() } : {}),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const { token, tokenHash } = createInvitationToken();
  const rawOrigin =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "https://basselealandbethel.com";
  const origin = (rawOrigin.startsWith("http") ? rawOrigin : `https://${rawOrigin}`).replace(/\/$/, "");
  const relativeUrl = `/?invite=${token}&to=${encodeURIComponent(guest.fullName)}`;
  const absoluteUrl = `${origin}${relativeUrl}`;

  const invitation = await Invitation.create({
    guestId: guest._id,
    tokenHash,
    shareUrl: relativeUrl,
    invitationType,
  });

  return {
    id: String(invitation._id),
    token,
    guestName: guest.fullName,
    invitationType,
    relativeUrl,
    shareUrl: absoluteUrl,
  };
}
