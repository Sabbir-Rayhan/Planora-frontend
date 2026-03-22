'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { IEvent } from '@/types';
import axiosInstance from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface IParticipant {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function OrganizerControls({ event }: { event: IEvent }) {
  const { user, isAuthenticated } = useAuthStore();
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  // only show for organizer or admin
  const isOrganizer = user?.id === event.organizerId;
  const isAdmin = user?.role === 'ADMIN';

  if (!isAuthenticated || (!isOrganizer && !isAdmin)) return null;

  const fetchParticipants = async () => {
    try {
      const res = await axiosInstance.get(
        `/participations/event/${event.id}`
      );
      setParticipants(res.data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [event.id]);

  const handleApprove = async (participationId: string) => {
    try {
      await axiosInstance.patch(`/participations/approve/${participationId}`);
      toast.success('Participant approved');
      fetchParticipants();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (participationId: string) => {
    try {
      await axiosInstance.patch(`/participations/reject/${participationId}`);
      toast.success('Participant rejected');
      fetchParticipants();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBan = async (participationId: string) => {
    if (!confirm('Ban this participant?')) return;
    try {
      await axiosInstance.patch(`/participations/ban/${participationId}`);
      toast.success('Participant banned');
      fetchParticipants();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const statusColor: Record<string, any> = {
    APPROVED: 'default',
    PENDING: 'secondary',
    REJECTED: 'outline',
    BANNED: 'destructive',
  };

  const pendingCount = participants.filter(
    (p) => p.status === 'PENDING'
  ).length;

  return (
    <div className="mb-8 border rounded-xl p-6 bg-slate-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {isOrganizer ? 'Manage Participants' : 'Participants (Admin View)'}
        </h2>
        {pendingCount > 0 && (
          <Badge variant="destructive">
            {pendingCount} pending
          </Badge>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading participants...</p>
      ) : participants.length === 0 ? (
        <p className="text-slate-400 text-sm">No participants yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500 border-b">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {participants.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-medium">{p.user.name}</td>
                  <td className="py-3 text-slate-500">{p.user.email}</td>
                  <td className="py-3">
                    <Badge variant={statusColor[p.status]}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {p.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(p.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(p.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {p.status === 'APPROVED' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBan(p.id)}
                        >
                          Ban
                        </Button>
                      )}
                      {p.status === 'REJECTED' && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(p.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {p.status === 'BANNED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(p.id)}
                        >
                          Unban
                        </Button>
                      )}
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