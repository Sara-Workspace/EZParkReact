import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearHold, setReservation } from '../store/session/sessionSlice';
import { excludeSpot } from '../store/search/searchSlice';
import type { Reservation } from '../types';
import InfoCard from './InfoCard';
import Button from './Button';
import { useSpotCheck } from '../hooks/useSpotCheck';

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function NavigationScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { spot, heldUntilMs } = useAppSelector((state) => state.session);

  const [now, setNow] = useState<number>(Date.now());
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🤖 בדיקת "החניה תפוסה" עם ה-AI. ההוק נקרא כאן, לפני ה-return המוקדם למטה,
  // כי לפי כללי ה-Hooks אסור לקרוא להוק אחרי תנאי. אם עוד אין חניה, שולחים 0 (לא ישמש)
  const { result: occupiedResult, loading: checking, reportOccupied } = useSpotCheck(spot?.spotId ?? 0, () => {});

  // מרעננים את "עכשיו" כל שנייה; הזמן שנותר נגזר ממנו
  useEffect(() => {
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // נכנסו למסך בלי חניה שמורה (למשל אחרי רענון דף): חוזרים לחיפוש
  if (spot === null || heldUntilMs === null) {
    return <Navigate to="/search" replace />;
  }

  const secondsLeft = Math.max(0, Math.floor((heldUntilMs - now) / 1000));
  const expired = secondsLeft === 0;

  // שחרור השמירה בשרת. אם נכשל, השמירה תפוג לבד אחרי 5 דקות
  const releaseHold = async () => {
    try {
      await apiFetch<unknown>(`/ParkingSpots/${spot.spotId}/hold`, { method: 'DELETE' });
    } catch {
      // לא קריטי: ה-Hold ייעלם מעצמו
    }
  };

   const handleParked = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const reservation = await apiFetch<Reservation>(`/Reservations/start/${spot.spotId}`, {
        method: 'POST',
      });
      dispatch(setReservation(reservation));
      navigate('/parking-session');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';

      if (message.includes('409')) {
        // החניה שמורה כעת לנהגת אחרת (למשל אחרי שהשרת הופעל מחדש)
        dispatch(excludeSpot(spot.spotId));
        dispatch(clearHold());
        navigate('/search');
        return;
      }

      if (message.includes('400')) {
        setError('לא ניתן להתחיל חניה. ייתכן שיש לך כבר חניה פעילה, ואז צריך לסיים אותה קודם (הקישור בתפריט).');
        return;
      }

      setError('לא הצלחנו להתחיל את החניה. ייתכן שהשמירה פגה.');
    } finally {
      setBusy(false);
    }
  };

  // חזרה לחיפוש בלי החניה התפוסה
  const goSearchWithoutThisSpot = () => {
    dispatch(excludeSpot(spot.spotId)); // החיפוש הבא יוצג בלי החניה התפוסה
    dispatch(clearHold());
    navigate('/search');
  };

  // 🚗 "החניה תפוסה": קודם ה-AI בודק את תמונת המצלמה, ומציגים לנהג את התוצאה.
  // אם אין מצלמה בחניה (או שהבדיקה נכשלה), ממשיכים ישר לחיפוש כמו קודם
  const handleOccupied = async () => {
    if (busy || checking) return;
    setBusy(true);
    const checkResult = await reportOccupied(); // השרת גם משחרר את השמירה של הנהג
    if (checkResult === null) {
      await releaseHold();
      goSearchWithoutThisSpot();
      return;
    }
    setBusy(false);
  };

  const handleRegret = async () => {
    if (busy) return;
    setBusy(true);
    await releaseHold();
    dispatch(clearHold());
    navigate('/search');
  };

  const wazeUrl = `https://waze.com/ul?ll=${spot.latitude},${spot.longitude}&navigate=yes`;
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
  const linkStyle = {
    padding: '10px 16px',
    borderRadius: '12px',
    background: 'white',
    border: '1px solid #cbd5e1',
    color: '#0f172a',
    fontWeight: 700,
    fontSize: '12px',
    textDecoration: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          background: expired ? '#fef2f2' : '#ecfdf5',
          border: expired ? '1px solid #fecaca' : '1px solid #a7f3d0',
          padding: '24px',
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          {expired ? 'השמירה פגה ⏰' : 'החניה שוריינה עבורך! 🎉'}
        </h3>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#475569' }}>
          {spot.address}, {spot.city}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <InfoCard title="זמן שנותר להגעה">
          <div
            style={{
              fontSize: '36px',
              fontWeight: 900,
              fontFamily: 'monospace',
              color: expired ? '#dc2626' : '#4f46e5',
              margin: '12px 0',
            }}
          >
            {formatTime(secondsLeft)}
          </div>
        </InfoCard>

        <InfoCard title="ניווט לחניה">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0' }}>
            <a href={wazeUrl} target="_blank" rel="noreferrer" style={linkStyle}>
              פתחי ב-Waze
            </a>
            <a href={googleUrl} target="_blank" rel="noreferrer" style={linkStyle}>
              פתחי ב-Google Maps
            </a>
          </div>
        </InfoCard>
      </div>

      {error !== null && (
        <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700 }}>{error}</div>
      )}

      {/* 🤖 הבדיקה הסתיימה: הנהג רואה רק תודה. את הפרטים (מספר הרכב, קנס) רואים רק בעל החניה והמנהל */}
      {occupiedResult !== null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              background: '#eef2ff',
              color: '#3730a3',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            תודה על הדיווח! 🙏 בדקנו את החניה וטיפלנו בזה. בואי נמצא לך חניה אחרת
          </div>
          <Button label="חיפוש חניה אחרת 🔎" onClick={goSearchWithoutThisSpot} background="#4f46e5" color="white" />
        </div>
      ) : (
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {!expired && (
          <Button
            label={busy ? 'מעבד...' : 'חניתי ✅'}
            onClick={handleParked}
            background="#059669"
            color="white"
          />
        )}
        <Button
          label={checking ? 'בודק את החניה... 🤖' : 'החניה תפוסה 🚫'}
          onClick={handleOccupied}
          background="#d97706"
          color="white"
        />
        <Button label="התחרטתי" onClick={handleRegret} background="#e2e8f0" color="#0f172a" />
      </div>
      )}
    </div>
  );
}

export default NavigationScreen;