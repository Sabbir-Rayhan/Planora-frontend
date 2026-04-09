'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required').refine((val) => {
    return new Date(val) >= new Date(new Date().toDateString());
  }, 'Date cannot be in the past'),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(1, 'Venue is required'),
  eventType: z.enum(['PUBLIC', 'PRIVATE']),
  fee: z.coerce.number().min(0),
});

type TEventForm = z.infer<typeof eventSchema>;

export default function CreateEventModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TEventForm>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: { eventType: 'PUBLIC', fee: 0 },
  });

  const onSubmit = async (data: TEventForm) => {
    setLoading(true);
    try {
      await axiosInstance.post('/events', {
        ...data,
        isPaid: data.fee > 0,
      });
      toast.success('Event created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Create New Event
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label className="dark:text-slate-300">Title</Label>
            <Input
              placeholder="Event title"
              {...register('title')}
              className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
            {errors.title && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="dark:text-slate-300">Description</Label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm min-h-20 resize-none bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Event description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="dark:text-slate-300">Date</Label>
              <Input
                type="date"
                min={today}
                {...register('date')}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
              {errors.date && (
                <p className="text-red-500 dark:text-red-400 text-sm">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="dark:text-slate-300">Time</Label>
              <Input
                type="time"
                {...register('time')}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
              {errors.time && (
                <p className="text-red-500 dark:text-red-400 text-sm">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="dark:text-slate-300">Venue</Label>
            <Input
              placeholder="Event venue"
              {...register('venue')}
              className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
            {errors.venue && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.venue.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="dark:text-slate-300">Event Type</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                {...register('eventType')}
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="dark:text-slate-300">Fee (৳)</Label>
              <Input
                type="number"
                min="0"
                placeholder="0 for free"
                {...register('fee')}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}