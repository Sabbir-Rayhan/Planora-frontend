'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function EventFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [eventType, setEventType] = useState(searchParams.get('eventType') || '');
  const [isPaid, setIsPaid] = useState(searchParams.get('isPaid') || '');

  // Sync state when URL changes (e.g., AI search bar updates)
  useEffect(() => {
    setEventType(searchParams.get('eventType') || '');
    setIsPaid(searchParams.get('isPaid') || '');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (eventType) params.set('eventType', eventType);
    else params.delete('eventType');
    if (isPaid) params.set('isPaid', isPaid);
    else params.delete('isPaid');
    // ✅ Preserves the 'search' param from AI search bar
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setEventType('');
    setIsPaid('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('eventType');
    params.delete('isPaid');
    // ✅ Keeps 'search' param if present
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-end">
      {/* Event Type */}
      <div>
        <label className="text-sm font-medium text-slate-600 mb-1 block">Type</label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Types</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>

      {/* Payment */}
      <div>
        <label className="text-sm font-medium text-slate-600 mb-1 block">Fee</label>
        <select
          value={isPaid}
          onChange={(e) => setIsPaid(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All</option>
          <option value="false">Free</option>
          <option value="true">Paid</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}