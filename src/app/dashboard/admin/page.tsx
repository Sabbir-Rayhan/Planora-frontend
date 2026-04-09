'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import AdminUsers from '@/components/dashboard/admin/AdminUsers';
import AdminEvents from '@/components/dashboard/admin/AdminEvents';
import AdminPayments from '@/components/dashboard/admin/AdminPayments';

import {
  Users, Calendar, CreditCard, Home,
  Menu, X, Shield, Sparkles,
  LayoutDashboard, TrendingUp,
} from 'lucide-react';
import AdminOverview from '@/components/dashboard/admin/AdminOverview';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, desc: 'Platform statistics' },
  { id: 'users', label: 'Manage Users', icon: Users, desc: 'User accounts & roles' },
  { id: 'events', label: 'Manage Events', icon: Calendar, desc: 'All platform events' },
  { id: 'payments', label: 'Payments', icon: CreditCard, desc: 'Revenue & transactions' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />;
      case 'users': return <AdminUsers />;
      case 'events': return <AdminEvents />;
      case 'payments': return <AdminPayments />;
      default: return <AdminOverview />;
    }
  };

  const activeItem = menuItems.find((m) => m.id === activeTab);

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
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
          background: 'rgba(10,10,25,0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white text-lg font-bold">Planora</span>
              <p className="text-orange-400 text-xs font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-4 mx-3 mt-4 rounded-2xl" style={{
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.15)'
        }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-white/50 text-xs truncate">{user?.email}</p>
              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                Administrator
              </span>
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
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left group ${
                  isActive ? 'text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(239,68,68,0.15))',
                  border: '1px solid rgba(249,115,22,0.3)'
                } : {}}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="leading-none">{item.label}</p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-white/60' : 'text-white/30'}`}>{item.desc}</p>
                </div>
                {isActive && <div className="ml-auto w-1.5 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/80 text-sm transition-all">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{
            background: 'rgba(10,10,25,0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(true)}>
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
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.07)',
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