"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Calendar,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      clearAuth();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      clearAuth();
      router.push("/");
    } finally {
      setMobileOpen(false);
    }
  };

  // Navigation links with icons
  const navLinks = (
    <>
      <Link
        href="/"
        className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors duration-200"
        onClick={() => setMobileOpen(false)}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      <Link
        href="/events"
        className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors duration-200"
        onClick={() => setMobileOpen(false)}
      >
        <Calendar className="w-4 h-4" />
        <span>Events</span>
      </Link>
      {isAuthenticated && (
        <Link
          href={
            user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"
          }
          className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      )}
    </>
  );

  // Auth buttons (desktop & mobile)
  const authButtons = (
    <>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Hi, {user?.name}</span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-full border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/login" onClick={() => setMobileOpen(false)}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
            >
              Login
            </Button>
          </Link>
          <Link href="/register" onClick={() => setMobileOpen(false)}>
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              Register
            </Button>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Planora
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">{navLinks}</div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">{authButtons}</div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-slate-700" />
          ) : (
            <Menu className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu with Slide Animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-indigo-100 bg-white/95 backdrop-blur-sm px-4 py-4 flex flex-col gap-4">
          {navLinks}
          <div className="pt-2 border-t border-indigo-100">{authButtons}</div>
        </div>
      </div>
    </nav>
  );
}