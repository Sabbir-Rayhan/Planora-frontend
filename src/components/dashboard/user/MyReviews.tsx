'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { IReview } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Star, Edit2, Trash2, X, Check } from 'lucide-react';

export default function MyReviews() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

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

  const handleEditStart = (review: IReview) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSave = async (reviewId: string) => {
    try {
      await axiosInstance.patch(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      });
      toast.success('Review updated!');
      setEditingId(null);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <p className="text-slate-400">Loading reviews...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">My Reviews</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No reviews yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Join events and share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-700">
                    {(review as any).event?.title || 'Event'}
                  </CardTitle>
                  {editingId !== review.id && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(review)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingId === review.id ? (
                  <div className="space-y-3">
                    {/* Edit Rating */}
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditRating(star)}
                            className="text-xl"
                          >
                            {star <= editRating ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Edit Comment */}
                    <textarea
                      className="w-full border rounded-md px-3 py-2 text-sm min-h-15 resize-none"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditSave(review.id)}
                      >
                        <Check className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-lg">
                            {star <= review.rating ? '⭐' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{review.comment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}