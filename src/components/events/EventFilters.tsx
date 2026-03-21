'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [eventType, setEventType] = useState(searchParams.get('eventType') || '');
  const [isPaid, setIsPaid] = useState(searchParams.get('isPaid') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (eventType) params.set('eventType', eventType);
    if (isPaid) params.set('isPaid', isPaid);
    router.push(`/events?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setEventType('');
    setIsPaid('');
    router.push('/events');
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-end">
      {/* Search */}
      <div className="flex-1">
        <label className="text-sm font-medium text-slate-600 mb-1 block">
          Search
        </label>
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
        />
      </div>

      {/* Event Type */}
      <div>
        <label className="text-sm font-medium text-slate-600 mb-1 block">
          Type
        </label>
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
        <label className="text-sm font-medium text-slate-600 mb-1 block">
          Fee
        </label>
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
        <Button onClick={applyFilters}>Search</Button>
        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}