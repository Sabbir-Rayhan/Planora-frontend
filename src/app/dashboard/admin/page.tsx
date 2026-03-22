import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AdminUsers from '@/components/dashboard/admin/AdminUsers';
import AdminEvents from '@/components/dashboard/admin/AdminEvents';
import AdminPayments from '@/components/dashboard/admin/AdminPayments';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <Link href="/">
          <Button variant="outline">← Home</Button>
        </Link>
      </div>
      <div className="space-y-10">
        <AdminUsers />
        <AdminEvents />
        <AdminPayments />
      </div>
    </div>
  );
}