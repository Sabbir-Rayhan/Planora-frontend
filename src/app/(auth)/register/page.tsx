'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Sparkles, ArrowLeft, Users } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type TRegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: TRegisterForm) => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Event branding */}
          <div className="hidden lg:flex flex-col space-y-6 text-center lg:text-left">
            <div className="relative">
              {/* Blur blobs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-normal"></div>
              
              <div className="relative">
                <Users className="h-16 w-16 text-indigo-500 dark:text-indigo-400 mx-auto lg:mx-0" />
                <h1 className="text-4xl font-bold mt-6 bg-gradient-to-r from-slate-800 to-indigo-600 dark:from-slate-100 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
                  Join Planora
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-md mx-auto lg:mx-0">
                  Create your account and start organizing amazing events with ease.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                <Sparkles className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Easy Setup</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get started in minutes</p>
              </div>
              <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                <CalendarDays className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Full Control</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage attendees, payments, and more</p>
              </div>
            </div>
          </div>

          {/* Right side - Registration card */}
          <Card className="w-full max-w-md mx-auto lg:mx-0 shadow-2xl border-slate-200/60 dark:border-slate-800/80 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">Create Account</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Join Planora and start managing events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    {...register('name')} 
                    className="dark:bg-slate-950 dark:border-slate-800 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    {...register('email')} 
                    className="dark:bg-slate-950 dark:border-slate-800 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    {...register('password')} 
                    className="dark:bg-slate-950 dark:border-slate-800 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    {...register('confirmPassword')} 
                    className="dark:bg-slate-950 dark:border-slate-800 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white" disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Login
                </Link>
              </p>
              <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4">
                <Link href="/" className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
