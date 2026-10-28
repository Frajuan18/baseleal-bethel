import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import { coupleName } from "@/config/wedding";

export const metadata: Metadata = {
  title: `${coupleName} — Wedding Celebration`,
  description: `Together with our families, ${coupleName} request the honour of your presence as they unite in holy matrimony and celebrate a lifetime of love.`,
  keywords: ["Basseleal", "Bethel", "Wedding", "Invitation", "RSVP", "Addis Ababa"],
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
  viewportFit: "cover",
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
      className="scroll-smooth"
    >
      <head>
      </head>
      <body className="min-h-full bg-[#F8F4ED] font-sans text-[#422B20] antialiased selection:bg-[#B18A54] selection:text-[#F8F4ED]">
        {children}
      </body>
    </html>
  );
}
