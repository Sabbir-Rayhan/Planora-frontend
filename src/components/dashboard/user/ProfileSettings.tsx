'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Shield } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
});

type TProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { user, setAuth, accessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const { register, handleSubmit, formState: { errors } } = useForm<TProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: TProfileForm) => {
    setLoading(true);
    try {
      const res = await axiosInstance.patch('/users/me', data);
      setAuth(res.data.data, accessToken!);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b pb-4">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield },
        ].map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {activeSection === 'profile' && (
        <>
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-lg">{user?.name}</p>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="default">{user?.role}</Badge>
                    <Badge variant={user?.status === 'ACTIVE' ? 'outline' : 'destructive'}>
                      {user?.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input {...register('name')} />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Email Address</Label>
                  <Input type="email" {...register('email')} />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      {activeSection === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Event invitations', desc: 'Get notified when someone invites you to an event' },
              { label: 'Participation approved', desc: 'Get notified when your join request is approved' },
              { label: 'New reviews', desc: 'Get notified when someone reviews your event' },
              { label: 'Payment confirmation', desc: 'Get notified after successful payment' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-700">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      )}

      {activeSection === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">✅ Your account is secure</p>
              <p className="text-green-600 text-sm mt-1">JWT authentication is active</p>
            </div>
            <div className="space-y-1">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}