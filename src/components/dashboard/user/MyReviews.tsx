'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { IReview } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function MyReviews() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get('/reviews/my');
      setReviews(res.data.data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">My Reviews</h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-slate-400">You have not written any reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {review.event?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  {'⭐'.repeat(review.rating)}
                  <span className="text-sm text-slate-500 ml-1">
                    {review.rating}/5
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-3">{review.comment}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}