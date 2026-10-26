import { WeddingHero } from "./components/wedding/WeddingHero";
import { InvitationSection } from "./components/wedding/InvitationSection";
import { WeddingCalendar } from "./components/wedding/WeddingCalendar";
import { RSVPSection } from "./components/wedding/RSVPSection";
import { ScrollReveal } from "./components/wedding/ScrollReveal";
import { LanguageProvider } from "./components/wedding/LanguageContext";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-[#F8F4ED] text-[#422B20]">
        <ScrollReveal />
        <WeddingHero />
        <InvitationSection />
        <WeddingCalendar />
        <RSVPSection />
      </main>
    </LanguageProvider>
  );
}
