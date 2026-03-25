"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import MyEvents from "@/components/dashboard/user/MyEvents";
import MyParticipations from "@/components/dashboard/user/MyParticipations";
import MyInvitations from "@/components/dashboard/user/MyInvitations";
import MyReviews from "@/components/dashboard/user/MyReviews";

import {
  Calendar,
  Mail,
  Star,
  Settings,
  Home,
  Menu,
  X,
  Users,
} from "lucide-react";
import ProfileSettings from "@/components/dashboard/user/ProfileSettings";
import { Button } from "@/components/ui/button";

const menuItems = [
  { id: "events", label: "My Events", icon: Calendar },
  { id: "participations", label: "My Participations", icon: Users },
  { id: "invitations", label: "Invitations", icon: Mail },
  { id: "reviews", label: "My Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("events");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const renderContent = () => {
    switch (activeTab) {
      case "events":
        return <MyEvents />;
      case "participations":
        return <MyParticipations />;
      case "invitations":
        return <MyInvitations />;
      case "reviews":
        return <MyReviews />;
      case "settings":
        return <ProfileSettings />;
      default:
        return <MyEvents />;
    }
  };

  const activeItem = menuItems.find((m) => m.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          w-64 bg-slate-900 text-white flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="text-xl font-bold text-white">
            Planora
          </Link>
          <p className="text-slate-400 text-sm mt-1">User Dashboard</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-slate-400 text-xs">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sm font-medium transition-colors text-left
                  ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {activeItem?.label}
              </h1>
              <p className="text-sm text-slate-500 hidden sm:block">
                Manage your {activeItem?.label.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="hidden md:flex">
                ← Home
              </Button>
            </Link>
            <Link href="/" className="md:hidden text-slate-600">
              <Home className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
