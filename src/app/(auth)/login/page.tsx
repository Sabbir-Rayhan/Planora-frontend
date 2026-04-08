'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense } from 'react';
import { CalendarDays, Sparkles, ArrowLeft, Eye } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type TLoginForm = z.infer<typeof loginSchema>;

// Demo credentials - can be moved to .env
const DEMO_CREDENTIALS = {
  USER: {
    email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || 'demo@planora.com',
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD || 'demo123',
  },
  ADMIN: {
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || 'admin@planora.com',
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'admin123',
  },
};

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<'user' | 'admin' | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const redirectTo = searchParams.get('redirect') || null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const performLogin = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { accessToken, user } = res.data.data;
      setAuth(user, accessToken);
      toast.success('Login successful!');

      if (redirectTo) {
        router.push(redirectTo);
      } else if (user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const onSubmit = async (data: TLoginForm) => {
    setLoading(true);
    try {
      await performLogin(data.email, data.password);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setDemoLoading(role);
    const creds = role === 'user' ? DEMO_CREDENTIALS.USER : DEMO_CREDENTIALS.ADMIN;
    
    // Prefill form for visual feedback
    setValue('email', creds.email);
    setValue('password', creds.password);
    
    try {
      await performLogin(creds.email, creds.password);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Event branding */}
          <div className="hidden lg:flex flex-col space-y-6 text-center lg:text-left">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>
              <div className="relative">
                <CalendarDays className="h-16 w-16 text-indigo-500 dark:text-indigo-400 mx-auto lg:mx-0" />
                <h1 className="text-4xl font-bold mt-6 bg-gradient-to-r from-slate-800 to-indigo-600 dark:from-slate-200 dark:to-indigo-400 bg-clip-text text-transparent">
                  Welcome to Planora
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-md mx-auto lg:mx-0">
                  Your ultimate event management platform. Plan, organize, and
                  celebrate unforgettable moments.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <Sparkles className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Smart Planning</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Streamline your event logistics
                </p>
              </div>
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <CalendarDays className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Easy Management</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Handle attendees, payments, and more
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Login card */}
          <Card className="w-full max-w-md mx-auto lg:mx-0 shadow-2xl border-0 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold dark:text-slate-100">Welcome Back</CardTitle>
              <CardDescription className="dark:text-slate-400">Login to your Planora account</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="dark:text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="dark:text-slate-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              {/* Demo Login Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                      Try Demo Account
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                    onClick={() => handleDemoLogin('user')}
                    disabled={demoLoading !== null}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {demoLoading === 'user' ? 'Logging in...' : 'Demo User'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={demoLoading !== null}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {demoLoading === 'admin' ? 'Logging in...' : 'Demo Admin'}
                  </Button>
                </div>
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-2">
                  Click to explore the platform instantly
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Register
                </Link>
              </p>
              <div className="w-full border-t pt-4">
                <Link href="/" className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}