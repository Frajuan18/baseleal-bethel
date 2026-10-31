import { WeddingHeader } from "./components/wedding/WeddingHeader";
import { WeddingHero } from "./components/wedding/WeddingHero";
import { InvitationSection } from "./components/wedding/InvitationSection";
import { GallerySection } from "./components/wedding/GallerySection";
import { WeddingCalendar } from "./components/wedding/WeddingCalendar";
import { RSVPSection } from "./components/wedding/RSVPSection";
import { ScrollReveal } from "./components/wedding/ScrollReveal";
import { LanguageProvider } from "./components/wedding/LanguageContext";
import { LanguageToggle } from "./components/wedding/LanguageToggle";
import { SongToggle } from "./components/wedding/SongToggle";
import { QuickDirectionsPill } from "./components/wedding/QuickDirectionsPill";
import { IntroLoader } from "./components/wedding/IntroLoader";
import { InvitationProvider } from "./components/wedding/InvitationContext";

export const instant = false;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; to?: string; name?: string; guest?: string }>;
}) {
  const params = await searchParams;
  const invite = params?.invite;
  const initialGuestName = params?.to || params?.name || params?.guest;
  return (
    <LanguageProvider>
      <InvitationProvider token={invite} initialGuestName={initialGuestName}>
        <IntroLoader />
        <WeddingHeader />
        <LanguageToggle />
        <SongToggle />
        <QuickDirectionsPill />
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
