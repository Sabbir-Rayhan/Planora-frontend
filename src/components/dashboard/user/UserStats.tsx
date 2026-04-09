'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, Star, Ticket } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface IStats {
  totalEvents: number;
  totalParticipations: number;
  pendingInvitations: number;
  averageRating: number;
}

export default function UserStats() {
  const [stats, setStats] = useState<IStats>({
    totalEvents: 0,
    totalParticipations: 0,
    pendingInvitations: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // use existing routes — fetch in parallel
        const [eventsRes, participationsRes, invitationsRes, reviewsRes] =
          await Promise.allSettled([
            axiosInstance.get('/events/my/events'),
            axiosInstance.get('/participations/my'),
            axiosInstance.get('/invitations/my'),
            axiosInstance.get('/reviews/my'),
          ]);

        const events =
          eventsRes.status === 'fulfilled'
            ? eventsRes.value.data.data || []
            : [];

        const participations =
          participationsRes.status === 'fulfilled'
            ? participationsRes.value.data.data || []
            : [];

        const invitations =
          invitationsRes.status === 'fulfilled'
            ? invitationsRes.value.data.data || []
            : [];

        const reviews =
          reviewsRes.status === 'fulfilled'
            ? reviewsRes.value.data.data || []
            : [];

        // calculate stats from existing data
        const pendingInvitations = invitations.filter(
          (inv: any) => inv.status === 'PENDING'
        ).length;

        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
              reviews.length
            : 0;

        setStats({
          totalEvents: events.length,
          totalParticipations: participations.length,
          pendingInvitations,
          averageRating: avgRating,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'My Events',
      value: stats.totalEvents,
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      label: 'Participations',
      value: stats.totalParticipations,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      label: 'Pending Invitations',
      value: stats.pendingInvitations,
      icon: Ticket,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-500/20 to-amber-500/20',
    },
    {
      label: 'Avg Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      suffix: '★',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 hover:opacity-100 transition-opacity duration-500`}
          />
          <div className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/50 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {card.value}
                  {card.suffix && (
                    <span className="text-yellow-400 ml-1">{card.suffix}</span>
                  )}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}