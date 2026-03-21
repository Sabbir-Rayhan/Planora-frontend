import { IReview } from '@/types';

async function getReviews(eventId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/event/${eventId}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.data;
  } catch {
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}

export default async function EventReviews({ eventId }: { eventId: string }) {
  const { reviews, averageRating, totalReviews } = await getReviews(eventId);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Reviews</h2>
        <div className="text-sm text-slate-500">
          {totalReviews} reviews · ⭐ {averageRating} avg
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-slate-400">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: IReview) => (
            <div
              key={review.id}
              className="bg-slate-50 rounded-lg p-4 border"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-700">
                  {review.user?.name}
                </p>
                <div className="flex items-center gap-1">
                  {'⭐'.repeat(review.rating)}
                  <span className="text-sm text-slate-500 ml-1">
                    {review.rating}/5
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}