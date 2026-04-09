export const dynamic = 'force-dynamic';


import { Suspense } from 'react';
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
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={null}>
        <UpcomingEvents />
      </Suspense>
      <EventCategories />
      <FeaturesSection />
      <HowItWorks />
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={null}>
        <StatsSection />
      </Suspense>
      <NewsletterSection />
      <CallToAction />
    </main>
  );
}