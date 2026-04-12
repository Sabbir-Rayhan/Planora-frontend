"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useState, useRef, useEffect } from "react";
import {
  Menu, X, Home, Calendar, LayoutDashboard,
  User, LogOut, Ticket, Mail, ChevronDown,
  BookOpen, Users, Phone, Sparkles, Zap,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
      if (pagesRef.current && !pagesRef.current.contains(e.target as Node))
        setPagesOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setDropdownOpen(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const pages = [
    { href: "/about", label: "About Us", icon: Users, desc: "Our story & mission" },
    { href: "/contact", label: "Contact", icon: Phone, desc: "Get in touch" },
    { href: "/blog", label: "Blog", icon: BookOpen, desc: "Tips & insights" },
  ];

  const dashboardHref = user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/85 dark:bg-slate-950/90 backdrop-blur-2xl shadow-lg shadow-indigo-500/5 border-b border-indigo-100/60 dark:border-indigo-900/40"
            : "bg-transparent"
        }`}
      >
        {/* Thin accent line at top */}
        <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Planora
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Home */}
            <NavItem href="/" label="Home" active={isActive("/")} onClick={() => {}} />

            {/* Events */}
            <NavItem href="/events" label="Events" active={isActive("/events")} onClick={() => {}} />

            {/* Pages Dropdown */}
            <div className="relative" ref={pagesRef}>
              <button
                onClick={() => setPagesOpen((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pagesOpen
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Pages
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${pagesOpen ? "rotate-180" : ""}`} />
              </button>

              {pagesOpen && (
                <div className="absolute left-0 top-full mt-2 w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 border border-indigo-100/80 dark:border-indigo-900/60 overflow-hidden">
                  {/* Gradient header */}
                  <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  <div className="p-2">
                    {pages.map((page) => {
                      const Icon = page.icon;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={() => setPagesOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all flex-shrink-0">
                            <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{page.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{page.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated links */}
            {isAuthenticated && (
              <>
                <NavItem href="/dashboard/user/events" label="My Events" active={isActive("/dashboard/user/events")} onClick={() => {}} />
                <NavItem href="/invitations" label="Invitations" active={isActive("/invitations")} onClick={() => {}} />
                <NavItem href={dashboardHref} label="Dashboard" active={isActive(dashboardHref)} onClick={() => {}} />
              </>
            )}
          </div>

          {/* ── Right Side ── */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((d) => !d)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-500/30">
                    {user ? getInitials(user.name) : "U"}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-none">
                      {user?.name?.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-0.5 font-medium">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 border border-indigo-100/80 dark:border-indigo-900/60 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {user ? getInitials(user.name) : "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-0.5 text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <DropdownItem href="/profile" icon={User} label="My Profile" onClick={() => setDropdownOpen(false)} />
                      <DropdownItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" onClick={() => setDropdownOpen(false)} />
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="px-5 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors border border-indigo-100/60 dark:border-indigo-900/40"
            onClick={() => setMobileOpen((m) => !m)}
          >
            {mobileOpen
              ? <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-[600px]" : "max-h-0"}`}>
          <div className="border-t border-indigo-100/60 dark:border-indigo-900/40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-1">

            <MobileNavItem href="/" label="Home" icon={Home} onClick={() => setMobileOpen(false)} active={isActive("/")} />
            <MobileNavItem href="/events" label="Events" icon={Calendar} onClick={() => setMobileOpen(false)} active={isActive("/events")} />

            {/* Pages section */}
            <div className="pt-2">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1">Pages</p>
              {pages.map((p) => (
                <MobileNavItem key={p.href} href={p.href} label={p.label} icon={p.icon} onClick={() => setMobileOpen(false)} active={isActive(p.href)} />
              ))}
            </div>

            {isAuthenticated && (
              <div className="pt-2 border-t border-indigo-100/60 dark:border-indigo-900/40">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1">Account</p>
                <MobileNavItem href="/profile" label="My Profile" icon={User} onClick={() => setMobileOpen(false)} active={isActive("/profile")} />
                <MobileNavItem href={dashboardHref} label="Dashboard" icon={LayoutDashboard} onClick={() => setMobileOpen(false)} active={isActive(dashboardHref)} />
                <MobileNavItem href="/invitations" label="Invitations" icon={Mail} onClick={() => setMobileOpen(false)} active={isActive("/invitations")} />
              </div>
            )}

            <div className="pt-2 border-t border-indigo-100/60 dark:border-indigo-900/40 flex items-center justify-between">
              <ThemeToggle />
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <button className="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 dark:border-indigo-800">
                      Login
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div className="h-[69px]" />
    </>
  );
}

/* ── Sub-components ── */

function NavItem({
  href, label, active, onClick,
}: {
  href: string; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
          : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500 rounded-full" />
      )}
    </Link>
  );
}

function MobileNavItem({
  href, label, icon: Icon, onClick, active,
}: {
  href: string; label: string; icon: any; onClick: () => void; active: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
          : "text-slate-700 dark:text-slate-300 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        active
          ? "bg-indigo-100 dark:bg-indigo-900/40"
          : "bg-slate-100 dark:bg-slate-800"
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      {label}
    </Link>
  );
}

function DropdownItem({
  href, icon: Icon, label, onClick,
}: {
  href: string; icon: any; label: string; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
}