import { WeddingHero } from "./components/wedding/WeddingHero";
import { InvitationSection } from "./components/wedding/InvitationSection";
import { WeddingCalendar } from "./components/wedding/WeddingCalendar";
import { RSVPSection } from "./components/wedding/RSVPSection";
import { ScrollReveal } from "./components/wedding/ScrollReveal";
import { LanguageProvider } from "./components/wedding/LanguageContext";
import { LanguageToggle } from "./components/wedding/LanguageToggle";
import { SongToggle } from "./components/wedding/SongToggle";
import { IntroLoader } from "./components/wedding/IntroLoader";
import { InvitationProvider } from "./components/wedding/InvitationContext";

export const instant = false;

export default async function Home({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const { invite } = await searchParams;
  return (
    <LanguageProvider>
      <InvitationProvider token={invite}>
        <IntroLoader />
        <LanguageToggle />
        <SongToggle />
        <main className="min-h-screen bg-[#F8F4ED] text-[#422B20]">
          <ScrollReveal />
          <WeddingHero />
          <InvitationSection />
          <WeddingCalendar />
          <RSVPSection />
        </main>
      </InvitationProvider>
    </LanguageProvider>
  );
}
