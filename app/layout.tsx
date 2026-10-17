import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Playfair_Display } from "next/font/google";
import "./fonts.css";
import "./globals.css";
import { coupleName } from "@/config/wedding";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${coupleName} — Wedding Celebration`,
  description: `Together with our families, ${coupleName} request the honour of your presence as they unite in holy matrimony and celebrate a lifetime of love.`,
  keywords: ["Baseleal", "Bethel", "Wedding", "Invitation", "RSVP", "Addis Ababa"],
  openGraph: {
    title: `${coupleName} — Wedding Celebration`,
    description: `Celebrate the wedding of ${coupleName}. You are warmly invited.`,
    type: "website",
    locale: "en_US",
    siteName: `${coupleName} Wedding`,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4A2E22",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#F8F4ED] font-sans text-[#422B20] antialiased selection:bg-[#B18A54] selection:text-[#F8F4ED]">
        {children}
      </body>
    </html>
  );
}
