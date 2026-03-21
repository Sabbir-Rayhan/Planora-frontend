import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CallToAction() {
  return (
    <section className="py-20 px-4 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Host Your Event?
        </h2>
        <p className="text-slate-300 text-lg mb-8">
          Create your event in minutes. Invite people, manage participants,
          and make your event a success with Planora.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 px-10"
            >
              Create Your Event
            </Button>
          </Link>
          <Link href="/events">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-10"
            >
              Explore Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}