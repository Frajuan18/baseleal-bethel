import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "https://basselealandbethel.com";
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "👉 ሊንኩን በመጫን ወደ ዌብሳይቱ ይሂዱ 👈 | Basseleal & Dr. Bethel Wedding",
  description:
    "ባስልኤል እና ዶ/ር ቤቴል ዲጂታል የሠርግ መጥሪያ — የማክበር ሰላምታችንን እያቀረብን በእግዚአብሔር ፈቃድ የጋብቻ ሥነ-ሥርዓታችን የሚፈጸመው ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም ስለሆነ በዚህ ዕለት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን በምናደርገው ደማቅ ዝግጅት ላይ አብረውን እንዲያከብሩ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።",
  keywords: [
    "Basseleal",
    "Dr. Bethel",
    "Bethel",
    "Wedding",
    "Invitation",
    "ባስልኤል",
    "ዶ/ር ቤቴል",
    "ቤቴል",
    "የሠርግ ጥሪ",
    "የሠርግ መጥሪያ",
    "RSVP",
    "Addis Ababa",
  ],
  openGraph: {
    title: "👉 ሊንኩን በመጫን ወደ ዌብሳይቱ ይሂዱ 👈 | Basseleal & Dr. Bethel Wedding",
    description:
      "ባስልኤል እና ዶ/ር ቤቴል ዲጂታል የሠርግ መጥሪያ — የማክበር ሰላምታችንን እያቀረብን በእግዚአብሔር ፈቃድ የጋብቻ ሥነ-ሥርዓታችን የሚፈጸመው ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም ስለሆነ በዚህ ዕለት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን በምናደርገው ደማቅ ዝግጅት ላይ አብረውን እንዲያከብሩ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።",
    url: siteUrl,
    type: "website",
    locale: "am_ET",
    siteName: "Basseleal & Dr. Bethel Wedding",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Basseleal & Dr. Bethel Digital Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "👉 ሊንኩን በመጫን ወደ ዌብሳይቱ ይሂዱ 👈 | Basseleal & Dr. Bethel Wedding",
    description:
      "ባስልኤል እና ዶ/ር ቤቴል ዲጂታል የሠርግ መጥሪያ — ቅዳሜ ፡ ታህሳስ 17 ፡ 2019 ዓ.ም በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/b-and-b-seal.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/b-and-b-seal.png",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/b-and-b-seal.png" },
    ],
  },
  other: {
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4A2E22",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="am" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/b-and-b-seal.png" type="image/png" />
        <link rel="shortcut icon" href="/b-and-b-seal.png" />
        <link rel="apple-touch-icon" href="/b-and-b-seal.png" />
      </head>
      <body
        className="min-h-full bg-[#F8F4ED] font-sans text-[#422B20] antialiased selection:bg-[#B18A54] selection:text-[#F8F4ED]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
