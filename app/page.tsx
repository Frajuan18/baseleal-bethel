import type { Metadata } from "next";
import { headers } from "next/headers";
import { WeddingHero } from "./components/wedding/WeddingHero";
import { InvitationSection } from "./components/wedding/InvitationSection";
import { GallerySection } from "./components/wedding/GallerySection";
import { WeddingCalendar } from "./components/wedding/WeddingCalendar";
import { RSVPSection } from "./components/wedding/RSVPSection";
import { ScrollReveal } from "./components/wedding/ScrollReveal";
import { LanguageProvider } from "./components/wedding/LanguageContext";
import { LanguageToggle } from "./components/wedding/LanguageToggle";
import { SongToggle } from "./components/wedding/SongToggle";
import { IntroLoader } from "./components/wedding/IntroLoader";
import { InvitationProvider } from "./components/wedding/InvitationContext";
import { connectMongo } from "@/app/lib/mongo";
import { Invitation } from "@/app/lib/models";
import { hashInvitationToken } from "@/app/lib/invitation-token";

export const instant = false;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; token?: string; to?: string; name?: string; guest?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const guestName = params?.to || params?.name || params?.guest;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");

  const rawBase =
    (host ? `${proto}://${host}` : undefined) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "https://basselealandbethel.com";

  const siteUrl = (rawBase.startsWith("http") ? rawBase : `https://${rawBase}`).replace(/\/$/, "");
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  const title = guestName
    ? `${guestName} — Wedding Invitation | Basseleal & Bethel`
    : "Basseleal and Bethel Digital Wedding Invitation";

  const description =
    "ባስልኤል እና ቤቴል ዲጂታል የሠርግ መጥሪያ — የማክበር ሰላምታችንን እያቀረብን በእግዚአብሔር ፈቃድ የጋብቻ ሥነ-ሥርዓታችን የሚፈጸመው ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም ስለሆነ በዚህ ዕለት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን በምናደርገው ደማቅ ዝግጅት ላይ አብረውን እንዲያከብሩ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      type: "website",
      locale: "am_ET",
      siteName: "Basseleal & Bethel Wedding",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Basseleal & Bethel Wedding Invitation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; token?: string; to?: string; name?: string; guest?: string }>;
}) {
  const params = await searchParams;
  const invite = params?.invite || params?.token;
  let initialGuestName = params?.to || params?.name || params?.guest;
  let initialInvitationType: string | undefined = undefined;

  if (invite) {
    try {
      await connectMongo();
      const doc = await Invitation.findOne({
        tokenHash: hashInvitationToken(invite),
        status: "ACTIVE",
      })
        .populate("guestId", "fullName")
        .lean();

      if (doc && (!doc.expiresAt || new Date(doc.expiresAt) >= new Date())) {
        const guest = doc.guestId as { fullName?: string } | undefined;
        if (guest?.fullName) initialGuestName = guest.fullName;
        initialInvitationType = doc.invitationType;
      }
    } catch (err) {
      console.error("SSR invitation resolution error:", err);
    }
  }

  const initialInvitation = initialInvitationType
    ? { guestName: initialGuestName, invitationType: initialInvitationType }
    : initialGuestName
    ? { guestName: initialGuestName }
    : null;

  return (
    <LanguageProvider>
      <InvitationProvider
        token={invite}
        initialGuestName={initialGuestName}
        initialInvitation={initialInvitation}
      >
        <IntroLoader />
        <LanguageToggle />
        <SongToggle />
        <main className="min-h-screen bg-[#F8F4ED] text-[#422B20]">
          <ScrollReveal />
          <WeddingHero />
          <InvitationSection />
          <GallerySection />
          <WeddingCalendar />
          <RSVPSection />
        </main>
      </InvitationProvider>
    </LanguageProvider>
  );
}
