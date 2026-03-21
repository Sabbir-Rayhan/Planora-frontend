import { cookies } from 'next/headers';
import MyEvents from '@/components/dashboard/user/MyEvents';
import MyParticipations from '@/components/dashboard/user/MyParticipations';
import MyInvitations from '@/components/dashboard/user/MyInvitations';
import MyReviews from '@/components/dashboard/user/MyReviews';


export default async function UserDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">My Dashboard</h1>
      <div className="space-y-10">
        <MyEvents />
        <MyParticipations />
        <MyInvitations />
        <MyReviews />
      </div>
    </div>
  );
}