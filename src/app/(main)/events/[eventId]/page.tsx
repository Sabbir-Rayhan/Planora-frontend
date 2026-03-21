import { IEvent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import JoinEventButton from '@/components/events/JoinEventButton';
import EventReviews from '@/components/events/EventReviews';


async function getEvent(eventId: string): Promise<IEvent | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={event.eventType === 'PUBLIC' ? 'default' : 'secondary'}>
            {event.eventType}
          </Badge>
          <Badge variant={event.isPaid ? 'destructive' : 'outline'}>
            {event.isPaid ? `৳${event.fee}` : 'Free'}
          </Badge>
          <Badge variant="outline">{event.status}</Badge>
          {event.isFeatured && (
            <Badge className="bg-yellow-500 text-white">⭐ Featured</Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          {event.title}
        </h1>
        <p className="text-slate-500">
          Organized by{' '}
          <span className="font-semibold text-slate-700">
            {event.organizer?.name}
          </span>
        </p>
      </div>

      {/* Event Info */}
      <div className="bg-slate-50 rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-slate-400">Date</p>
            <p className="font-medium text-slate-700">
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-slate-400">Time</p>
            <p className="font-medium text-slate-700">{event.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-slate-400">Venue</p>
            <p className="font-medium text-slate-700">{event.venue}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-slate-400">Participants</p>
            <p className="font-medium text-slate-700">
              {event._count?.participations || 0} joined
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          About this Event
        </h2>
        <p className="text-slate-600 leading-relaxed">{event.description}</p>
      </div>

      {/* Join Button , Using here client component*/}
      <JoinEventButton event={event} />

      {/* Reviews,Using here client component */}
      <EventReviews eventId={event.id} />
    </div>
  );
}