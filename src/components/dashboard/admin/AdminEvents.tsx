// components/dashboard/admin/AdminEvents.tsx
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { IEvent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
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
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardHeader className="border-b bg-white/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Manage Events
          <span className="text-sm font-normal text-muted-foreground">
            ({events.length} total)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium max-w-48 truncate">
                      {event.title}
                    </TableCell>
                    <TableCell>{event.organizer?.name}</TableCell>
                    <TableCell>
                      <Badge variant={event.eventType === 'PUBLIC' ? 'default' : 'secondary'}>
                        {event.eventType}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.isPaid ? `৳${event.fee}` : 'Free'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.isFeatured ? 'default' : 'outline'}>
                        {event.isFeatured ? '⭐ Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}