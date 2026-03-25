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
import { CalendarDays, Sparkles, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type TLoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  // get redirect URL if present
  const redirectTo = searchParams.get('redirect') || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginForm) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', data);
      const { accessToken, user } = res.data.data;
      setAuth(user, accessToken);
      toast.success('Login successful!');

      // redirect to previous page or dashboard
      if (redirectTo) {
        router.push(redirectTo);
      } else if (user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Event branding */}
          <div className="hidden lg:flex flex-col space-y-6 text-center lg:text-left">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
              <div className="relative">
                <CalendarDays className="h-16 w-16 text-indigo-500 mx-auto lg:mx-0" />
                <h1 className="text-4xl font-bold mt-6 bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                  Welcome to Planora
                </h1>
                <p className="text-lg text-slate-600 mt-4 max-w-md mx-auto lg:mx-0">
                  Your ultimate event management platform. Plan, organize, and
                  celebrate unforgettable moments.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <Sparkles className="h-6 w-6 text-indigo-500 mb-2" />
                <p className="font-medium text-slate-700">Smart Planning</p>
                <p className="text-sm text-slate-500">
                  Streamline your event logistics
                </p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <CalendarDays className="h-6 w-6 text-indigo-500 mb-2" />
                <p className="font-medium text-slate-700">Easy Management</p>
                <p className="text-sm text-slate-500">
                  Handle attendees, payments, and more
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Login card */}
          <Card className="w-full max-w-md mx-auto lg:mx-0 shadow-2xl border-0 backdrop-blur-sm bg-white/90">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Login to your Planora account</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <p className="text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Register
                </Link>
              </p>
              <div className="w-full border-t pt-4">
                <Link href="/" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
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