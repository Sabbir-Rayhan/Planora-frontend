'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import { IEvent } from '@/types';

type ParticipationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED' | null;
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | null;

interface IParticipationInfo {
  id: string;
  status: ParticipationStatus;
  paymentStatus: PaymentStatus;
  requiresPayment: boolean;
}

export default function JoinEventButton({ event }: { event: IEvent }) {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [participationInfo, setParticipationInfo] = useState<IParticipationInfo | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkParticipation = async () => {
      if (!isAuthenticated) {
        setCheckingStatus(false);
        return;
      }
      try {
        // check participation
        const res = await axiosInstance.get('/participations/my');
        const participations = res.data.data;
        const found = participations.find((p: any) => p.eventId === event.id);

        if (!found) {
          setParticipationInfo(null);
          setCheckingStatus(false);
          return;
        }

        // if event is paid, check payment status too
        if (event.isPaid) {
          try {
            const payRes = await axiosInstance.get('/payments/my');
            const payments = payRes.data.data;
            const payment = payments.find((p: any) => p.eventId === event.id);

            setParticipationInfo({
              id: found.id,
              status: found.status,
              paymentStatus: payment?.status || null,
              requiresPayment: true,
            });
          } catch {
            setParticipationInfo({
              id: found.id,
              status: found.status,
              paymentStatus: null,
              requiresPayment: true,
            });
          }
        } else {
          setParticipationInfo({
            id: found.id,
            status: found.status,
            paymentStatus: null,
            requiresPayment: false,
          });
        }
      } catch {
        setParticipationInfo(null);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkParticipation();
  }, [isAuthenticated, event.id, event.isPaid]);


// ── Handle join ──────────────────────────────────────
  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/participations/join/${event.id}`);
      const result = res.data;

      if (result.data?.requiresPayment) {
        const payRes = await axiosInstance.post('/payments/initiate', {
          eventId: event.id,
        });
        const { paymentUrl } = payRes.data.data;
        window.location.href = paymentUrl;
      } else if (result.data?.requiresApproval) {
        toast.success('Join request sent! Waiting for approval.');
        setParticipationInfo({
          id: result.data.participation.id,
          status: 'PENDING',
          paymentStatus: null,
          requiresPayment: false,
        });
      } else {
        toast.success('Successfully joined the event!');
        setParticipationInfo({
          id: result.data.participation.id,
          status: 'APPROVED',
          paymentStatus: null,
          requiresPayment: false,
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to join event');
    } finally {
      setLoading(false);
    }
  };
  

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

  // ── Determine what to show ──────────────────────────
  if (participationInfo) {
    const { status, paymentStatus, requiresPayment } = participationInfo;

    // paid event but payment not completed → show pay button again
    if (
      requiresPayment &&
      status === 'PENDING' &&
      (paymentStatus === 'PENDING' || paymentStatus === 'FAILED' || paymentStatus === null)
    ) {
      return (
        <div className="mb-6 space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm font-medium">
              ⚠️ Payment not completed. Please complete payment to join.
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleJoin}
            disabled={loading}
            className="w-full sm:w-auto px-10"
          >
            {loading ? 'Processing...' : `Pay ৳${event.fee} & ${event.eventType === 'PRIVATE' ? 'Request' : 'Join'}`}
          </Button>
        </div>
      );
    }

    // payment done but waiting for host approval (private event)
    if (status === 'PENDING' && (paymentStatus === 'PAID' || !requiresPayment)) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-700 font-medium">
            ⏳ Request Pending — Waiting for host approval
          </p>
          {paymentStatus === 'PAID' && (
            <p className="text-yellow-600 text-sm mt-1">Payment confirmed ✓</p>
          )}
        </div>
      );
    }

    // approved
    if (status === 'APPROVED') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-medium">
            ✅ You are approved for this event!
          </p>
          {paymentStatus === 'PAID' && (
            <p className="text-green-600 text-sm mt-1">Payment confirmed ✓</p>
          )}
        </div>
      );
    }

    // rejected
    if (status === 'REJECTED') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">
            ❌ Your request was rejected
          </p>
        </div>
      );
    }

    // banned
    if (status === 'BANNED') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">
            🚫 You have been banned from this event
          </p>
        </div>
      );
    }
  }

  // ── No participation yet — show join button ──────────
  // const handleJoin = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axiosInstance.post(`/participations/join/${event.id}`);
  //     const result = res.data;

  //     if (result.data?.requiresPayment) {
  //       const payRes = await axiosInstance.post('/payments/initiate', {
  //         eventId: event.id,
  //       });
  //       const { paymentUrl } = payRes.data.data;
  //       window.location.href = paymentUrl;
  //     } else if (result.data?.requiresApproval) {
  //       toast.success('Join request sent! Waiting for approval.');
  //       setParticipationInfo({
  //         id: result.data.participation.id,
  //         status: 'PENDING',
  //         paymentStatus: null,
  //         requiresPayment: false,
  //       });
  //     } else {
  //       toast.success('Successfully joined the event!');
  //       setParticipationInfo({
  //         id: result.data.participation.id,
  //         status: 'APPROVED',
  //         paymentStatus: null,
  //         requiresPayment: false,
  //       });
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || 'Failed to join event');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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