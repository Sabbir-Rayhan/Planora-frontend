import { IEvent } from '@/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import EventFilters from '@/components/events/EventFilters';

async function getEvents(searchParams: Record<string, string>): Promise<IEvent[]> {
  try {
    const params = new URLSearchParams(searchParams).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?${params}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedParams = await searchParams;
  const events = await getEvents(resolvedParams);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">All Events</h1>
        <p className="text-slate-500 mt-1">
          Browse and join events that interest you
        </p>
      </div>

      {/* Filters */}
      <EventFilters />

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No events found.</p>
          <Link href="/events">
            <Button variant="outline" className="mt-4">
              Clear Filters
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>{event._count?.participations || 0} participants</span>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}