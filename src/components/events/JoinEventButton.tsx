'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import { IEvent } from '@/types';

type ParticipationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED' | null;

export default function JoinEventButton({ event }: { event: IEvent }) {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ParticipationStatus>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // check if user already joined this event
  useEffect(() => {
    const checkParticipation = async () => {
      if (!isAuthenticated) {
        setCheckingStatus(false);
        return;
      }
      try {
        const res = await axiosInstance.get('/participations/my');
        const participations = res.data.data;
        const found = participations.find(
          (p: any) => p.eventId === event.id
        );
        setStatus(found ? found.status : null);
      } catch {
        setStatus(null);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkParticipation();
  }, [isAuthenticated, event.id]);

  // organizer cannot join own event
  if (user?.id === event.organizerId) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700 font-medium">
          You are the organizer of this event.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 border rounded-lg p-4 mb-6 text-center">
        <p className="text-slate-600 mb-3">Please login to join this event.</p>
        <Button onClick={() => router.push(`/login?redirect=${pathname}`)}>
          Login to Join
        </Button>
      </div>
    );
  }

  if (checkingStatus) {
    return (
      <div className="mb-6">
        <Button disabled>Checking status...</Button>
      </div>
    );
  }

  // show current status if already joined
  if (status) {
    const statusConfig = {
      PENDING: {
        label: '⏳ Request Pending — Waiting for approval',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      },
      APPROVED: {
        label: '✅ You are approved for this event!',
        color: 'bg-green-50 border-green-200 text-green-700',
      },
      REJECTED: {
        label: '❌ Your request was rejected',
        color: 'bg-red-50 border-red-200 text-red-700',
      },
      BANNED: {
        label: '🚫 You have been banned from this event',
        color: 'bg-red-50 border-red-200 text-red-700',
      },
    };

    const config = statusConfig[status];

    return (
      <div className={`border rounded-lg p-4 mb-6 ${config.color}`}>
        <p className="font-medium">{config.label}</p>
        {status === 'APPROVED' && event.isPaid && (
          <p className="text-sm mt-1 opacity-75">Payment confirmed ✓</p>
        )}
      </div>
    );
  }

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/participations/join/${event.id}`
      );
      const result = res.data;

      if (result.data?.requiresPayment) {
        const payRes = await axiosInstance.post('/payments/initiate', {
          eventId: event.id,
        });
        const { paymentUrl } = payRes.data.data;
        window.location.href = paymentUrl;
      } else if (result.data?.requiresApproval) {
        toast.success('Join request sent! Waiting for approval.');
        setStatus('PENDING');
      } else {
        toast.success('Successfully joined the event!');
        setStatus('APPROVED');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to join event');
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (event.eventType === 'PUBLIC' && !event.isPaid) return 'Join Event';
    if (event.eventType === 'PUBLIC' && event.isPaid)
      return `Pay ৳${event.fee} & Join`;
    if (event.eventType === 'PRIVATE' && !event.isPaid)
      return 'Request to Join';
    if (event.eventType === 'PRIVATE' && event.isPaid)
      return `Pay ৳${event.fee} & Request`;
    return 'Join Event';
  };

  return (
    <div className="mb-6">
      <Button
        size="lg"
        onClick={handleJoin}
        disabled={loading}
        className="w-full sm:w-auto px-10"
      >
        {loading ? 'Processing...' : getButtonLabel()}
      </Button>
    </div>
  );
}