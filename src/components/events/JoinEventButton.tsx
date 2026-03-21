'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IEvent } from '@/types';

export default function JoinEventButton({ event }: { event: IEvent }) {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // organizer cannot join own event
  if (user?.id === event.organizerId) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700 font-medium">You are the organizer of this event.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 border rounded-lg p-4 mb-6 text-center">
        <p className="text-slate-600 mb-3">Please login to join this event.</p>
        <Button onClick={() => router.push('/login')}>Login to Join</Button>
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
        // initiate payment
        const payRes = await axiosInstance.post('/payments/initiate', {
          eventId: event.id,
        });
        const { paymentUrl } = payRes.data.data;
        window.location.href = paymentUrl;
      } else if (result.data?.requiresApproval) {
        toast.success('Join request sent! Waiting for approval.');
        router.refresh();
      } else {
        toast.success('Successfully joined the event!');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to join event');
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (event.eventType === 'PUBLIC' && !event.isPaid) return 'Join Event';
    if (event.eventType === 'PUBLIC' && event.isPaid) return `Pay ৳${event.fee} & Join`;
    if (event.eventType === 'PRIVATE' && !event.isPaid) return 'Request to Join';
    if (event.eventType === 'PRIVATE' && event.isPaid) return `Pay ৳${event.fee} & Request`;
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