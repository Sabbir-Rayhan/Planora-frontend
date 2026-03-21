import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IEvent } from '@/types';
import { Calendar, MapPin } from 'lucide-react';

// server component — fetch directly
async function getUpcomingEvents(): Promise<IEvent[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?status=UPCOMING`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.data?.slice(0, 6) || [];
  } catch {
    return [];
  }
}

export default async function UpcomingEvents() {
  const events = await getUpcomingEvents();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Upcoming Events</h2>
          <p className="text-slate-500 mt-2">
            Discover and join events happening near you
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-slate-400">No upcoming events yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={event.eventType === 'PUBLIC' ? 'default' : 'secondary'}
                    >
                      {event.eventType}
                    </Badge>
                    <Badge variant={event.isPaid ? 'destructive' : 'outline'}>
                      {event.isPaid ? `৳${event.fee}` : 'Free'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-1">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/events/${event.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/events">
            <Button size="lg">View All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}