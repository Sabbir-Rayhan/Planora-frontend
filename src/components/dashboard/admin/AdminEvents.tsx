'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { IEvent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminEvents() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get('/events');
      setEvents(res.data.data);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleFeatured = async (eventId: string) => {
    try {
      await axiosInstance.patch(`/events/${eventId}/featured`);
      toast.success('Featured status updated');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Manage Events
        <span className="ml-2 text-sm font-normal text-slate-500">
          ({events.length} total)
        </span>
      </h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Organizer</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Fee</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Featured</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {event.organizer?.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        event.eventType === 'PUBLIC' ? 'default' : 'secondary'
                      }
                    >
                      {event.eventType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {event.isPaid ? `৳${event.fee}` : 'Free'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{event.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={event.isFeatured ? 'default' : 'outline'}
                    >
                      {event.isFeatured ? '⭐ Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleToggleFeatured(event.id)}
                      >
                        {event.isFeatured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}