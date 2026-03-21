import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-500 mb-6">
          You have successfully joined the event.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
          <Link href="/dashboard/user">
            <Button variant="outline">My Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}