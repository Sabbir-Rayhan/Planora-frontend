import HeroSection from "@/components/home/HeroSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import EventCategories from "@/components/home/EventCategories";

import CallToAction from "@/components/home/CallToAction";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import StatsSection from "@/components/home/StatsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero Section (60-70vh) */}
      <HeroSection />

      {/* 2. Upcoming Events (4 cards per row with images) */}
      <UpcomingEvents />

      {/* 3. Event Categories */}
      <EventCategories />

      {/* 4. Features Section */}
      <FeaturesSection />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Stats Section */}
      <StatsSection />

      {/* 8. Newsletter Signup */}
      <NewsletterSection />

      {/* 9. Call to Action */}
      <CallToAction />

      {/* 10. Footer is already in layout, so this makes 10 total sections */}
    </main>
  );
}