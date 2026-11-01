import { Suspense } from "react";
import type { Metadata } from "next";
import { InvitationRedirect } from "./redirect";

export const metadata: Metadata = {
  title: "Basseleal and Bethel Digital Wedding Invitation",
  description:
    "ባስልኤል እና ቤቴል ዲጂታል የሠርግ መጥሪያ — የማክበር ሰላምታችንን እያቀረብን በእግዚአብሔር ፈቃድ የጋብቻ ሥነ-ሥርዓታችን የሚፈጸመው ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም ስለሆነ በዚህ ዕለት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን በምናደርገው ደማቅ ዝግጅት ላይ አብረውን እንዲያከብሩ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።",
  openGraph: {
    title: "Basseleal and Bethel Digital Wedding Invitation",
    description:
      "ባስልኤል እና ቤቴል ዲጂታል የሠርግ መጥሪያ — የማክበር ሰላምታችንን እያቀረብን በእግዚአብሔር ፈቃድ የጋብቻ ሥነ-ሥርዓታችን የሚፈጸመው ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም ስለሆነ በዚህ ዕለት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን በደስታ አብረውን እንዲያከብሩ በአክብሮት ጋብዘንዎታል።",
    type: "website",
    locale: "am_ET",
    siteName: "Basseleal & Bethel Wedding",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Basseleal & Bethel Digital Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Basseleal and Bethel Digital Wedding Invitation",
    description:
      "ባስልኤል እና ቤቴል ዲጂታል የሠርግ መጥሪያ — ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን",
    images: ["/og-image.jpg"],
  },
};

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
