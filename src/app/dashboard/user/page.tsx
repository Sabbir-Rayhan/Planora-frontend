'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import MyEvents from '@/components/dashboard/user/MyEvents';
import MyParticipations from '@/components/dashboard/user/MyParticipations';
import MyInvitations from '@/components/dashboard/user/MyInvitations';
import MyReviews from '@/components/dashboard/user/MyReviews';
import ProfileSettings from '@/components/dashboard/user/ProfileSettings';
import UserStats from '@/components/dashboard/user/UserStats';
import ParticipationChart from '@/components/dashboard/user/ParticipationChart';
import {
  Calendar,
  Mail,
  Star,
  Settings,
  Home,
  Menu,
  X,
  Users,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, desc: 'Dashboard overview' },
  { id: 'events', label: 'My Events', icon: Calendar, desc: 'Manage your events' },
  { id: 'participations', label: 'Participations', icon: Users, desc: 'Events you joined' },
  { id: 'invitations', label: 'Invitations', icon: Mail, desc: 'Pending invitations' },
  { id: 'reviews', label: 'My Reviews', icon: Star, desc: 'Your event reviews' },
  { id: 'settings', label: 'Settings', icon: Settings, desc: 'Profile & preferences' },
];

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <UserStats />
            <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Participation Trend
              </h3>
              <ParticipationChart />
            </div>
            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('events')} className="block w-full text-left">
                <div className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-all cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Create New Event</h4>
                      <p className="text-white/40 text-sm">Host your own event</p>
                    </div>
                  </div>
                </div>
              </button>
              <Link href="/events" className="block">
                <div className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-all cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Discover Events</h4>
                      <p className="text-white/40 text-sm">Browse public events</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      case 'events': return <MyEvents />;
      case 'participations': return <MyParticipations />;
      case 'invitations': return <MyInvitations />;
      case 'reviews': return <MyReviews />;
      case 'settings': return <ProfileSettings />;
      default: return <MyEvents />;
    }
  };

  const activeItem = menuItems.find((m) => m.id === activeTab);

  return (
    <div className="min-h-screen flex bg-[#0a0a1a] dark:bg-[#0a0a1a]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-72
          flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          background: 'rgba(15,15,30,0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-xl font-bold">Planora</span>
          </div>
          <p className="text-white/40 text-xs mt-1 ml-11">User Dashboard</p>
        </div>

        {/* User Profile */}
        <div className="p-4 mx-3 mt-4 rounded-2xl" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-white/50 text-xs truncate">{user?.email}</p>
              <div className="mt-1">
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200 text-left group
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="leading-none">{item.label}</p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-white/60' : 'text-white/30'}`}>
                    {item.desc}
                  </p>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/80 text-sm transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{
            background: 'rgba(15,15,30,0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-white/60 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-white text-xl font-bold">{activeItem?.label}</h1>
              <p className="text-white/40 text-sm hidden sm:block">{activeItem?.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <button
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-white/60 hover:text-white text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              <div
                className="rounded-2xl p-6 min-h-96"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {renderContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}