"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Calendar,
  LayoutDashboard,
  User,
  LogOut,
  CalendarPlus,
  Ticket,
  Mail,
  ChevronDown,
  BookOpen,
  Users,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);

  // Handle click outside for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (pagesRef.current && !pagesRef.current.contains(event.target as Node)) {
        setPagesOpen(false);
      }
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const publicNavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Events", icon: Calendar },
  ];

  // Pages dropdown items
  const pages = [
    { href: "/about", label: "About Us", icon: Users, desc: "Learn about Planora" },
    { href: "/contact", label: "Contact", icon: Mail, desc: "Get in touch with us" },
    { href: "/blog", label: "Blog", icon: BookOpen, desc: "Tips and insights" },
  ];

  const authenticatedNavLinks = [
    { href: "/events/my-events", label: "My Events", icon: Ticket },
    { href: "/invitations", label: "Invitations", icon: Mail },
  ];

  const dashboardLink = user
    ? {
        href: user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user",
        label: "Dashboard",
        icon: LayoutDashboard,
      }
    : null;

  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: any;
  }) => (
    <Link
      href={href}
      className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
      onClick={() => {
        setMobileOpen(false);
        setDropdownOpen(false);
        setPagesOpen(false);
      }}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-indigo-100 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Planora
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" icon={Home} />
          <NavLink href="/events" label="Events" icon={Calendar} />

          {/* Pages Dropdown */}
          <div className="relative" ref={pagesRef}>
            <button
              onClick={() => setPagesOpen(!pagesOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              <span>Pages</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pagesOpen ? "rotate-180" : ""}`} />
            </button>

            {pagesOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-indigo-100 dark:border-slate-700 py-2 z-50">
                {pages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      onClick={() => setPagesOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{page.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{page.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <>
              <NavLink href="/events/my-events" label="My Events" icon={Ticket} />
              <NavLink href="/invitations" label="Invitations" icon={Mail} />
              {dashboardLink && <NavLink {...dashboardLink} />}
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-medium">
                  {user ? getInitials(user.name) : "U"}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user?.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-indigo-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-indigo-50 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-indigo-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-slate-500"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          ) : (
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-indigo-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-4 flex flex-col gap-4">
          {publicNavLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          {/* Pages Section in Mobile Menu */}
          <div className="pt-2 border-t border-indigo-100 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 px-1">
              Pages
            </p>
            {pages.map((page) => (
              <NavLink
                key={page.href}
                href={page.href}
                label={page.label}
                icon={page.icon}
              />
            ))}
          </div>

          {isAuthenticated && (
            <>
              {authenticatedNavLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
              {dashboardLink && <NavLink {...dashboardLink} />}
              <div className="pt-2 border-t border-indigo-100 dark:border-slate-700">
                <NavLink href="/profile" label="Profile" icon={User} />
              </div>
            </>
          )}
          <div className="flex justify-center py-2 border-t border-indigo-100 dark:border-slate-700">
            <ThemeToggle />
          </div>
          <div className="pt-2 border-t border-indigo-100 dark:border-slate-700">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-indigo-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}