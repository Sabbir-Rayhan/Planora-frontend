'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosInstance.get('/payments/all');
        setPayments(res.data.data);
      } catch {
        toast.error('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Payments
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({payments.length} total)
          </span>
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <p className="text-sm text-green-600 font-medium">
            Total Revenue: ৳{totalRevenue}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-slate-400">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Event</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Transaction ID</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">
                    {payment.user?.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">
                    {payment.event?.title}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    ৳{payment.amount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        payment.status === 'PAID'
                          ? 'default'
                          : payment.status === 'FAILED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {payment.transactionId || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}