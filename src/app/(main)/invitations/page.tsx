'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function MyInvitations() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    try {
      const res = await axiosInstance.get('/invitations/my');
      setInvitations(res.data.data);
    } catch {
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId: string) => {
    try {
      const res = await axiosInstance.patch(
        `/invitations/accept/${invitationId}`
      );
      const result = res.data.data;

      if (result.requiresPayment) {
        const payRes = await axiosInstance.post('/payments/initiate', {
          eventId: result.eventId,
        });
        window.location.href = payRes.data.data.paymentUrl;
      } else {
        toast.success('Invitation accepted!');
        fetchInvitations();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDecline = async (invitationId: string) => {
    try {
      await axiosInstance.patch(`/invitations/decline/${invitationId}`);
      toast.success('Invitation declined');
      fetchInvitations();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">My Invitations</h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : invitations.length === 0 ? (
        <p className="text-slate-400">No invitations yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invitations.map((inv) => (
            <Card key={inv.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base line-clamp-1">
                    {inv.event?.title}
                  </CardTitle>
                  <Badge variant="secondary">{inv.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-1">
                  👤 By {inv.event?.organizer?.name}
                </p>
                <p className="text-sm text-slate-500 mb-3">
                  📅 {new Date(inv.event?.date).toLocaleDateString()}
                </p>
                {inv.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(inv.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(inv.id)}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}