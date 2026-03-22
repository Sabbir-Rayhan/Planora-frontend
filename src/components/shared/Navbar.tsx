"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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

  const navLinks = (
    <>
      <Link
        href="/"
        className="text-slate-600 hover:text-slate-900"
        onClick={() => setMobileOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/events"
        className="text-slate-600 hover:text-slate-900"
        onClick={() => setMobileOpen(false)}
      >
        Events
      </Link>
      {isAuthenticated && (
        <Link
          href={user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"}
          className="text-slate-600 hover:text-slate-900"
          onClick={() => setMobileOpen(false)}
        >
          Dashboard
        </Link>
      )}
    </>
  );

  const authButtons = (
    <>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Link href="/profile" onClick={() => setMobileOpen(false)}>
            <span className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
              Hi, {user?.name}
            </span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register" onClick={() => setMobileOpen(false)}>
            <Button size="sm">Register</Button>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-slate-800">
          Planora
        </Link>

        {/* Desktop Nav — hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks}
        </div>

        {/* Desktop Auth — hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          {authButtons}
        </div>

        {/* Mobile Hamburger — shown only on mobile */}
        <button
          className="md:hidden text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks}
          <div className="pt-2 border-t">
            {authButtons}
          </div>
        </div>
      )}
    </nav>
  );
}

