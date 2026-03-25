import { IEvent } from '@/types';
import EventsSlider from './EventsSlider';

async function getUpcomingEvents(): Promise<IEvent[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ||
                   'https://planora-backend-production-d7e8.up.railway.app/api/v1';
    const res = await fetch(
      `${apiUrl}/events?status=UPCOMING&eventType=PUBLIC`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.data?.slice(0, 9) || [];
  } catch {
    return [];
  }
}

export default async function UpcomingEvents() {
  const events = await getUpcomingEvents();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Don't Miss Out
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            Upcoming Events
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Discover exciting public events happening soon. Join and connect
            with people who share your interests.
          </p>
        </div>
        <EventsSlider events={events} />
      </div>
    </section>
  );
}