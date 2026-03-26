'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { IParticipation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MyParticipations() {
  const [participations, setParticipations] = useState<IParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipations = async () => {
    try {
      const res = await axiosInstance.get('/participations/my');
      setParticipations(res.data.data);
    } catch {
      toast.error('Failed to load participations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipations();
  }, []);

  const statusColor: Record<string, any> = {
    APPROVED: 'default',
    PENDING: 'secondary',
    REJECTED: 'destructive',
    BANNED: 'destructive',
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">My Participations</h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : participations.length === 0 ? (
        <p className="text-slate-400">You have not joined any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participations.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base line-clamp-1">
                    {p.event?.title}
                  </CardTitle>
                  <Badge variant={statusColor[p.status]}>
                    {p.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-1">
                  📅 {p.event?.date
                    ? new Date(p.event.date).toLocaleDateString()
                    : 'N/A'}
                </p>
                <p className="text-sm text-slate-500 mb-3">
                  📍 {p.event?.venue}
                </p>
                <Link href={`/events/${p.eventId}`}>
                  <Button variant="outline" size="sm">
                    View Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}