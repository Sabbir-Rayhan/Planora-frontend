'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddReviewForm({ eventId }: { eventId: string }) {
  const { isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  if (!isAuthenticated) return null;
  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-green-700 font-medium">
          ✅ Review submitted successfully!
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/reviews', {
        eventId,
        rating,
        comment,
      });
      toast.success('Review submitted!');
      setSubmitted(true);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-slate-50 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Write a Review
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="space-y-1">
          <Label>Rating</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl transition-transform hover:scale-110"
              >
                {star <= rating ? '⭐' : '☆'}
              </button>
            ))}
            <span className="text-sm text-slate-500 self-center ml-2">
              {rating}/5
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-1">
          <Label>Comment</Label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] resize-none bg-white"
            placeholder="Share your experience about this event..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
}