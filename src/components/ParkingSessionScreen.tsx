import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiFetch, getErrorMessage, getErrorStatus } from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setReservation, clearSession } from '../store/session/sessionSlice';
import { clearSearch } from '../store/search/searchSlice';
import { refreshPoints } from '../store/user/userThunks';
import { estimateCost, cashbackBonus } from '../store/session/sessionSelectors';
import { parseServerUtc } from '../utils/time';
import type { ParkingSpot, Reservation } from '../types';
import InfoCard from './InfoCard';
import Button from './Button';

function formatElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

function ParkingSessionScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reservation = useAppSelector((state) => state.session.reservation);

  const [recovering, setRecovering] = useState<boolean>(reservation === null);
  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [reviewSent, setReviewSent] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // אחרי רענון דף ה-Store ריק: מחפשים בשרת הזמנה פעילה של המשתמש
  useEffect(() => {
    if (reservation !== null) return;
    let cancelled = false;

    const recover = async () => {
      try {
        const mine = await apiFetch<Reservation[]>('/Reservations/my');
        const active = mine
          .filter((r) => r.status === 'Active')
          .sort((a, b) => b.reservationID - a.reservationID)[0];
        if (!cancelled && active !== undefined) {
          dispatch(setReservation(active));
        }
      } catch {
        // אין מה לשחזר
      } finally {
        if (!cancelled) setRecovering(false);
      }
    };

    recover();
    return () => {
      cancelled = true;
    };
  }, [dispatch, reservation]);

  // פרטי החניה (כתובת ותעריף) לפי מזהה החניה שבהזמנה
  const spotId = reservation?.spotID;
  useEffect(() => {
    if (spotId === undefined) return;
    let cancelled = false;

    apiFetch<ParkingSpot>(`/ParkingSpots/${spotId}`)
      .then((data) => {
        if (!cancelled) setSpot(data);
      })
      .catch(() => {
        // בלי פרטי החניה עדיין אפשר לסיים חניה
      });

    return () => {
      cancelled = true;
    };
  }, [spotId]);

  // הטיימר רץ רק כל עוד החניה פעילה
  const isActive = reservation?.status === 'Active';
  useEffect(() => {
    if (!isActive) return;
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, [isActive]);

  if (recovering) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>טוען את החניה הפעילה...</div>;
  }
  if (reservation === null) {
    return <Navigate to="/home" replace />;
  }

  const startMs = parseServerUtc(reservation.startTime);
  const elapsedSeconds = Math.max(0, Math.floor((now - startMs) / 1000));
  const liveMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
  const liveCost = spot !== null ? estimateCost(spot.basePricePerHour, liveMinutes) : null;
  const placeName = spot !== null ? `${spot.address}, ${spot.city}` : `חניה #${reservation.spotID}`;

  const handleComplete = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const done = await apiFetch<Reservation>(`/Reservations/${reservation.reservationID}/complete`, {
        method: 'POST',
      });
      dispatch(setReservation(done)); // הסטטוס הופך ל-Completed והמסך עובר לסיכום
      dispatch(refreshPoints());
    } catch (err) {
      setError(getErrorMessage(err, 'סיום החניה נכשל. נסי שוב.'));
    } finally {
      setBusy(false);
    }
  };

  const handleReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim().length < 2) {
      setReviewError('יש לכתוב תגובה (לפחות 2 תווים).');
      return;
    }

    setBusy(true);
    setReviewError(null);
    try {
      await apiFetch<unknown>('/Reviews', {
        method: 'POST',
        body: JSON.stringify({
          reservationID: reservation.reservationID,
          rating,
          comment: comment.trim(),
        }),
      });
      setReviewSent(true);
    } catch (err) {
      setReviewError(
        getErrorStatus(err) === 403
          ? 'כרגע אפשר להשאיר תגובה רק מחשבון שנכנס כנהג.'
          : getErrorMessage(err, 'שליחת התגובה נכשלה. נסי שוב.')
      );
    } finally {
      setBusy(false);
    }
  };

  const handleFinish = () => {
    dispatch(clearSession());
    dispatch(clearSearch());
    navigate('/home');
  };

  // ===== מסך סיכום: החניה הסתיימה =====
  if (reservation.status === 'Completed') {
    const endMs = parseServerUtc(reservation.endTime);
    const totalMinutes = Math.max(1, Math.ceil((endMs - startMs) / 60000));
    const bonus = cashbackBonus(reservation.totalPrice);

    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0a2540', margin: 0 }}>
            החניה הסתיימה בהצלחה ✅
          </h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#44566e' }}>{placeName}</p>
        </div>

        <InfoCard title="פרטי ההזמנה">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', margin: '12px 0' }}>
            <div><strong>מיקום:</strong> {placeName}</div>
            <div><strong>משעה:</strong> {formatClock(startMs)} <strong>עד:</strong> {formatClock(endMs)}</div>
            <div><strong>משך:</strong> {totalMinutes} דקות</div>
            <div><strong>עלות:</strong> {reservation.totalPrice} נקודות</div>
            <div><strong>בונוס 10%:</strong> +{bonus} נקודות</div>
          </div>
        </InfoCard>

        <InfoCard title="איך הייתה החניה?">
          {reviewSent ? (
            <p style={{ color: '#059669', fontWeight: 700, margin: '12px 0' }}>תודה! התגובה נשמרה.</p>
          ) : (
            <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '12px 0' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      border: value <= rating ? '2px solid #f59e0b' : '1px solid #cfdbea',
                      background: value <= rating ? '#fffbeb' : 'white',
                    }}
                  >
                    ⭐ {value}
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="כתבי כאן תגובה על החניה..."
                rows={3}
                maxLength={500}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cfdbea', boxSizing: 'border-box' }}
              />
              {/* מונה תווים: כמה כתבו מתוך 500 */}
              <span style={{ fontSize: '11px', color: '#5a6b82' }}>{comment.trim().length}/500 תווים (לפחות 2)</span>
              {reviewError !== null && (
                <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 700 }}>{reviewError}</div>
              )}
              <Button label={busy ? 'שולח...' : 'שלחי תגובה'} background="#0a6cf0" color="white" />
            </form>
          )}
        </InfoCard>

        <div>
          <Button
            label={reviewSent ? 'סיום וחזרה לדף הבית' : 'דלגי וחזרי לדף הבית'}
            onClick={handleFinish}
            background="#0a2540"
            color="white"
          />
        </div>
      </div>
    );
  }

  // ===== מסך חניה פעילה =====
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#eaf3ff', border: '1px solid #b3d2ff', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0a2540', margin: 0 }}>החניה פעילה 🅿️</h3>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#44566e' }}>{placeName}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <InfoCard title="זמן חניה">
          <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', color: '#0a6cf0', margin: '12px 0' }}>
            {formatElapsed(elapsedSeconds)}
          </div>
          <div style={{ fontSize: '12px', color: '#5a6b82' }}>התחלה: {formatClock(startMs)}</div>
        </InfoCard>

        <InfoCard title="עלות משוערת">
          <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', color: '#059669', margin: '12px 0' }}>
            {liveCost !== null ? `${liveCost} נק'` : '—'}
          </div>
          <div style={{ fontSize: '12px', color: '#5a6b82' }}>העלות הסופית תחושב בסיום</div>
        </InfoCard>
      </div>

      {error !== null && <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700 }}>{error}</div>}

      <div>
        <Button
          label={busy ? 'מסיימת...' : 'סיום חניה 🏁'}
          onClick={handleComplete}
          background="#dc2626"
          color="white"
        />
      </div>
    </div>
  );
}

export default ParkingSessionScreen;