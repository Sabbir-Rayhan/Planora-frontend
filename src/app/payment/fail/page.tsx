import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-slate-500 mb-6">
          Something went wrong with your payment. Please try again.
        </p>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    </div>
  );
}