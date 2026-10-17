import { WeddingHero } from "./components/wedding/WeddingHero";
import { InvitationSection } from "./components/wedding/InvitationSection";
import { WeddingCalendar } from "./components/wedding/WeddingCalendar";
import { FlipCountdown } from "./components/wedding/FlipCountdown";
import { WishesSection } from "./components/wedding/WishesSection";
import { RSVPSection } from "./components/wedding/RSVPSection";
import { ScrollReveal } from "./components/wedding/ScrollReveal";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F4ED] text-[#422B20]">
      <ScrollReveal />
      <WeddingHero />
      <InvitationSection />
      <WeddingCalendar />
      <FlipCountdown />
      <WishesSection />
      <RSVPSection />
    </main>
  );
}
