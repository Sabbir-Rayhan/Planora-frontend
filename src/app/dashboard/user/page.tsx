import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MyEvents from '@/components/dashboard/user/MyEvents';
import MyParticipations from '@/components/dashboard/user/MyParticipations';
import MyInvitations from '@/components/dashboard/user/MyInvitations';
import MyReviews from '@/components/dashboard/user/MyReviews';

export default function UserDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Dashboard</h1>
        <Link href="/">
          <Button variant="outline">← Home</Button>
        </Link>
      </div>
      <div className="space-y-10">
        <MyEvents />
        <MyParticipations />
        <MyInvitations />
        <MyReviews />
      </div>
    </div>
  );
}