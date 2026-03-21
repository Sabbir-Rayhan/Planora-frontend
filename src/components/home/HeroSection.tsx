import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Plan, Create &{' '}
          <span className="text-blue-400">Join Events</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Planora makes it easy to discover public events, create your own,
          and connect with people who share your interests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
              Browse Events
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}