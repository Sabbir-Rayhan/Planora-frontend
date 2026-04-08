import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-16 px-4 bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-6">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Never Miss an Event
        </h2>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and get notified about upcoming events,
          exclusive invitations, and updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 rounded-full">
            Subscribe
          </Button>
        </div>
        <p className="text-slate-400 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}