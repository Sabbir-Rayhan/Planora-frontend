'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      clearAuth();
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      clearAuth();
      router.push('/');
    }
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-slate-800">
          Planora
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Home
          </Link>
          <Link href="/events" className="text-slate-600 hover:text-slate-900">
            Events
          </Link>
          {isAuthenticated && (
            <Link
              href={user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user'}
              className="text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                Hi, {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}