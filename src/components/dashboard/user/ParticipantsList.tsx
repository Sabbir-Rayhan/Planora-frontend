'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

export default function ParticipantsList({ eventId }: { eventId: string }) {
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchParticipants = async () => {
    try {
      const res = await axiosInstance.get(
        `/participations/event/${eventId}`
      );
      setParticipants(res.data.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load participants');
      router.push('/dashboard/user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const handleApprove = async (participationId: string) => {
    try {
      await axiosInstance.patch(
        `/participations/approve/${participationId}`
      );
      toast.success('Participant approved');
      fetchParticipants();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (participationId: string) => {
    try {
      await axiosInstance.patch(
        `/participations/reject/${participationId}`
      );
      toast.success('Participant rejected');
      fetchParticipants();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBan = async (participationId: string) => {
    if (!confirm('Are you sure you want to ban this participant?')) return;
    try {
      await axiosInstance.patch(
        `/participations/ban/${participationId}`
      );
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

  // count by status
  const counts = {
    total: participants.length,
    approved: participants.filter((p) => p.status === 'APPROVED').length,
    pending: participants.filter((p) => p.status === 'PENDING').length,
    banned: participants.filter((p) => p.status === 'BANNED').length,
  };

  if (loading) {
    return <p className="text-slate-400">Loading participants...</p>;
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: counts.total, color: 'bg-slate-100' },
          { label: 'Approved', value: counts.approved, color: 'bg-green-50' },
          { label: 'Pending', value: counts.pending, color: 'bg-yellow-50' },
          { label: 'Banned', value: counts.banned, color: 'bg-red-50' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-xl p-4 text-center`}
          >
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {participants.length === 0 ? (
        <p className="text-slate-400 text-center py-10">
          No participants yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Joined At</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{p.user.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColor[p.status]}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
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