'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Users, Calendar, CreditCard, TrendingUp, Activity, Award } from 'lucide-react';

interface IAdminStats {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  totalParticipations: number;
  recentPayments: any[];
  recentEvents: any[];
  allUsers: any[];
  allEvents: any[];
}

function buildMonthlyRevenue(payments: any[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  return Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - (5 - i) + 12) % 12;
    const revenue = payments
      .filter((p: any) => {
        const d = new Date(p.createdAt);
        return d.getMonth() === monthIndex && p.status === 'PAID';
      })
      .reduce((sum: number, p: any) => sum + p.amount, 0);
    return { month: months[monthIndex], revenue };
  });
}

function buildEventTypeData(events: any[]) {
  const publicFree = events.filter(e => e.eventType === 'PUBLIC' && !e.isPaid).length;
  const publicPaid = events.filter(e => e.eventType === 'PUBLIC' && e.isPaid).length;
  const privateFree = events.filter(e => e.eventType === 'PRIVATE' && !e.isPaid).length;
  const privatePaid = events.filter(e => e.eventType === 'PRIVATE' && e.isPaid).length;
  return [
    { name: 'Public Free', value: publicFree, color: '#22c55e' },
    { name: 'Public Paid', value: publicPaid, color: '#3b82f6' },
    { name: 'Private Free', value: privateFree, color: '#a855f7' },
    { name: 'Private Paid', value: privatePaid, color: '#f97316' },
  ];
}

function buildUserGrowth(users: any[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  return Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - (5 - i) + 12) % 12;
    const count = users.filter((u: any) => {
      const d = new Date(u.createdAt);
      return d.getMonth() === monthIndex;
    }).length;
    return { month: months[monthIndex], users: count };
  });
}

export default function AdminOverview() {
  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, eventsRes, paymentsRes, participationsRes] =
          await Promise.allSettled([
            axiosInstance.get('/users'),
            axiosInstance.get('/events'),
            axiosInstance.get('/payments/all'),
            axiosInstance.get('/participations/my'),
          ]);

        const users = usersRes.status === 'fulfilled' ? usersRes.value.data.data || [] : [];
        const events = eventsRes.status === 'fulfilled' ? eventsRes.value.data.data || [] : [];
        const payments = paymentsRes.status === 'fulfilled' ? paymentsRes.value.data.data || [] : [];
        const participations = participationsRes.status === 'fulfilled' ? participationsRes.value.data.data || [] : [];

        const totalRevenue = payments
          .filter((p: any) => p.status === 'PAID')
          .reduce((sum: number, p: any) => sum + p.amount, 0);

        setStats({
          totalUsers: users.length,
          totalEvents: events.length,
          totalRevenue,
          totalParticipations: participations.length,
          recentPayments: payments.slice(0, 5),
          recentEvents: events.slice(0, 5),
          allUsers: users,
          allEvents: events,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      label: 'Total Events',
      value: stats?.totalEvents || 0,
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-500',
      change: '+8%',
    },
    {
      label: 'Total Revenue',
      value: `৳${stats?.totalRevenue || 0}`,
      icon: CreditCard,
      gradient: 'from-orange-500 to-red-500',
      change: '+23%',
    },
    {
      label: 'Participations',
      value: stats?.totalParticipations || 0,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      change: '+15%',
    },
  ];

  const revenueData = buildMonthlyRevenue(stats?.recentPayments || []);
  const eventTypeData = buildEventTypeData(stats?.allEvents || []);
  const userGrowthData = buildUserGrowth(stats?.allUsers || []);

  const tooltipStyle = {
    contentStyle: {
      background: 'rgba(10,10,25,0.95)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      color: '#fff',
    },
  };

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl border border-white/10 p-5"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full">
                {card.change}
              </span>
            </div>
            <p className="text-white/50 text-xs font-medium mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h3 className="text-white font-semibold">Monthly Revenue</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`৳${v}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="rounded-2xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">User Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}`, 'New Users']} />
              <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Event Types Pie Chart */}
        <div className="rounded-2xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Event Distribution</h3>
          </div>
          {eventTypeData.every(d => d.value === 0) ? (
            <div className="h-52 flex items-center justify-center">
              <p className="text-white/30 text-sm">No events yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Recent Events</h3>
          </div>
          <div className="space-y-3">
            {stats?.recentEvents.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No events yet</p>
            ) : (
              stats?.recentEvents.map((event: any) => (
                <div key={event.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    event.eventType === 'PUBLIC' ? 'bg-blue-400' : 'bg-purple-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{event.title}</p>
                    <p className="text-white/40 text-xs">
                      {event.organizer?.name} •{' '}
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    event.isPaid
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {event.isPaid ? `৳${event.fee}` : 'Free'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-yellow-400" />
            <h4 className="text-white/70 text-sm font-medium">Featured Events</h4>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats?.allEvents.filter((e: any) => e.isFeatured).length || 0}
          </p>
          <p className="text-white/40 text-xs mt-1">Currently featured</p>
        </div>

        <div className="rounded-2xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-400" />
            <h4 className="text-white/70 text-sm font-medium">Active Users</h4>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats?.allUsers.filter((u: any) => u.status === 'ACTIVE').length || 0}
          </p>
          <p className="text-white/40 text-xs mt-1">Out of {stats?.totalUsers} total</p>
        </div>

        <div className="rounded-2xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h4 className="text-white/70 text-sm font-medium">Upcoming Events</h4>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats?.allEvents.filter((e: any) => e.status === 'UPCOMING').length || 0}
          </p>
          <p className="text-white/40 text-xs mt-1">Scheduled events</p>
        </div>
      </div>

    </div>
  );
}