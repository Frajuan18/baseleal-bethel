import { WeddingHero } from "./components/wedding/WeddingHero";
import { InvitationSection } from "./components/wedding/InvitationSection";
import { WeddingCalendar } from "./components/wedding/WeddingCalendar";
import { FlipCountdown } from "./components/wedding/FlipCountdown";
import { WishesSection } from "./components/wedding/WishesSection";
import { RSVPSection } from "./components/wedding/RSVPSection";
import { WeddingFooter } from "./components/wedding/WeddingFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F4ED] text-[#422B20]">
      <WeddingHero />
      <InvitationSection />
      <WeddingCalendar />
      <FlipCountdown />
      <WishesSection />
      <RSVPSection />
      <WeddingFooter />
    </main>
  );
}
