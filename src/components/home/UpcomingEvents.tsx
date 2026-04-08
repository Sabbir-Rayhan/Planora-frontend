import { IEvent } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

async function getUpcomingEvents(): Promise<IEvent[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://planora-backend-production-d7e8.up.railway.app/api/v1";
    const res = await fetch(
      `${apiUrl}/events?status=UPCOMING&eventType=PUBLIC&limit=8`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.data?.slice(0, 8) || [];
  } catch {
    return [];
  }
}

const getGradient = (seed: string) => {
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-emerald-600",
    "from-orange-500 to-red-600",
    "from-teal-500 to-cyan-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-yellow-600",
    "from-sky-500 to-blue-600",
  ];
  const index =
    seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

export default async function UpcomingEvents() {
  const events = await getUpcomingEvents();

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
            Don&apos;t Miss Out
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            Upcoming Events
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Discover exciting public events happening soon. Join and connect
            with people who share your interests.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-slate-400 dark:text-slate-500 text-lg">
              No upcoming events yet.
            </p>
            <Link href="/events">
              <Button variant="outline" className="mt-4 dark:border-slate-600 dark:text-slate-300">
                Browse All Events
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => {
                const gradient = getGradient(event.id);
                return (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Placeholder */}
                    <div
                      className={`h-40 w-full bg-gradient-to-br ${gradient} relative flex items-center justify-center`}
                    >
                      <span className="text-white text-4xl opacity-80">🎉</span>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          {event.eventType}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={`${
                            event.isPaid ? "bg-orange-500" : "bg-green-500"
                          } text-white border-0`}
                        >
                          {event.isPaid ? `৳${event.fee}` : "Free"}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-2 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                        {event.description}
                      </p>
                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Users className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                          <span>{event._count?.participations || 0} participants</span>
                        </div>
                      </div>
                      <Link href={`/events/${event.id}`} className="mt-4">
                        <Button className="w-full" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-800 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 px-10 transition-colors"
                >
                  View All Events
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}