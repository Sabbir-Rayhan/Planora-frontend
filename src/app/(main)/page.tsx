import CallToAction from "@/components/home/CallToAction";
import EventCategories from "@/components/home/EventCategories";
import HeroSection from "@/components/home/HeroSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <UpcomingEvents />
      <EventCategories />
      <CallToAction />
    </main>
  );
}
