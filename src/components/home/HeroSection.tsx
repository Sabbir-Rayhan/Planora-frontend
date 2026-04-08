import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IEvent } from "@/types";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AISearchBar from "@/components/shared/AISearchBar";  // <-- added import

async function getFeaturedEvent(): Promise<IEvent | null> {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/events?isFeatured=true`, {
      cache: "no-store",
    });
    const data = await res.json();
    const events = data.data || [];
    const featured = events.find((e: IEvent) => e.isFeatured === true);
    return featured || null;
  } catch {
    return null;
  }
}



export default async function HeroSection() {
  const featuredEvent = await getFeaturedEvent();

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden min-h-[70vh] flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-sm font-medium">
                Events happening now
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Plan, Create &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Join Events
              </span>
            </h1>

            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Planora makes it easy to discover public events, create your own,
              and connect with people who share your interests.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/events">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 gap-2"
                >
                  Browse Events
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* AI Search Bar - added as requested */}
            <div className="mt-8">
              <AISearchBar
                placeholder="Search for events..."
                className="max-w-md"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { label: "Events Created", value: "500+" },
                { label: "Active Users", value: "2K+" },
                { label: "Cities", value: "50+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content — Featured Event Card */}
          <div className="hidden lg:block">
            {featuredEvent ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-yellow-300 text-sm font-medium">
                    ⭐ Featured Event
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {featuredEvent.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {featuredEvent.description}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {featuredEvent.venue}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500/30 text-blue-200 border-0">
                    {featuredEvent.isPaid ? `৳${featuredEvent.fee}` : "Free"}
                  </Badge>
                  <Link href={`/events/${featuredEvent.id}`}>
                    <Button
                      size="sm"
                      className="bg-white text-slate-900 hover:bg-blue-50"
                    >
                      Join Event →
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Create Your First Event
                </h3>
                <p className="text-slate-300 text-sm mb-6">
                  Start by creating an event and invite people to join!
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard/user">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      Create Event
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Browse Events
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}