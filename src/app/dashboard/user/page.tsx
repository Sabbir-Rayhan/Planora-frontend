'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import MyEvents from '@/components/dashboard/user/MyEvents';
import MyParticipations from '@/components/dashboard/user/MyParticipations';
import MyInvitations from '@/components/dashboard/user/MyInvitations';
import MyReviews from '@/components/dashboard/user/MyReviews';
import ProfileSettings from '@/components/dashboard/user/ProfileSettings';
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
} from 'lucide-react';

const menuItems = [
  { id: 'events', label: 'My Events', icon: Calendar, desc: 'Manage your events' },
  { id: 'participations', label: 'My Participations', icon: Users, desc: 'Events you joined' },
  { id: 'invitations', label: 'Invitations', icon: Mail, desc: 'Pending invitations' },
  { id: 'reviews', label: 'My Reviews', icon: Star, desc: 'Your event reviews' },
  { id: 'settings', label: 'Settings', icon: Settings, desc: 'Profile & preferences' },
];

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const renderContent = () => {
    switch (activeTab) {
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
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
    }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-72
        flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-xl font-bold">Planora</span>
          </div>
          <p className="text-white/40 text-xs mt-1 ml-11">User Dashboard</p>
        </div>

        {/* User Profile */}
        <div className="p-4 mx-3 mt-4 rounded-2xl" style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-white/50 text-xs truncate">{user?.email}</p>
              <div className="mt-1">
                <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">
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
                    ? 'bg-linear-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-500/30'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isActive
                    ? 'bg-linear-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
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
                  <div className="ml-auto w-1.5 h-6 bg-linear-to-b from-blue-400 to-purple-500 rounded-full" />
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
        <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
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
              <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-white/60 hover:text-white text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Content Card */}
            <div className="rounded-2xl p-6 min-h-96"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}