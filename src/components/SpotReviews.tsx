import { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import { parseServerUtc } from '../utils/time';

interface ReviewItem {
  reviewID: number;
  reservationID: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface SpotReviewsProps {
  spotId: number;
  compact?: boolean; // true = תקציר קטן לכרטיס (דירוג ממוצע + התגובה האחרונה)
}

function SpotReviews({ spotId, compact = false }: SpotReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [average, setAverage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [list, avg] = await Promise.all([
          apiFetch<ReviewItem[]>(`/Reviews/spot/${spotId}`),
          apiFetch<number>(`/Reviews/spot/${spotId}/average-rating`),
        ]);
        if (!cancelled) {
          setReviews([...list].sort((a, b) => b.reviewID - a.reviewID));
          setAverage(avg);
        }
      } catch {
        // אם הטעינה נכשלה, פשוט לא מציגים תגובות
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [spotId]);

  if (loading) return null;

  if (compact) {
    const latest = reviews[0];
    return (
      <div style={{ background: '#f6faff', border: '1px solid #dfe8f3', borderRadius: '14px', padding: '10px 12px' }}>
        {latest === undefined ? (
          <div style={{ fontSize: '12px', color: '#5a6b82' }}>עדיין אין תגובות על החניה</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 700 }}>
              <span style={{ color: '#b45309' }}>⭐ {average.toFixed(1)}</span>
              <span style={{ color: '#5a6b82' }}>{reviews.length} תגובות</span>
            </div>
            <p
              style={{
                margin: '6px 0 0 0',
                fontSize: '12px',
                color: '#2a3b52',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              “{latest.comment}”
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#f6faff',
        border: '1px solid #dfe8f3',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>תגובות על החניה</h4>
        {reviews.length > 0 && (
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#b45309' }}>
            ⭐ {average.toFixed(1)} ({reviews.length})
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p style={{ fontSize: '12px', color: '#5a6b82', margin: 0 }}>עדיין אין תגובות על החניה הזו.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.reviewID}
            style={{ background: 'white', border: '1px solid #dfe8f3', borderRadius: '12px', padding: '10px 12px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#5a6b82' }}>
              <span>{'⭐'.repeat(review.rating)}</span>
              <span>{new Date(parseServerUtc(review.createdAt)).toLocaleDateString('he-IL')}</span>
            </div>
            <p style={{ fontSize: '13px', margin: '6px 0 0 0', color: '#0a2540' }}>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SpotReviews;