import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useAppDispatch } from '../store/hooks';
import { setHold } from '../store/session/sessionSlice';
import { excludeSpot } from '../store/search/searchSlice';
import type { ParkingSpot, HoldResult } from '../types';
import SpotReviews from './SpotReviews';
import Button from './Button';

function DetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // שליפת פרטי החניה הבודדת
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchSpotDetails = async () => {
      try {
        const data = await apiFetch<ParkingSpot>(`/ParkingSpots/${id}`);
        if (cancelled) return;
        setSpot(data);
        document.title = `פארקי - ${data.address}, ${data.city}`;
      } catch {
        if (!cancelled) setError('החניה לא נמצאה בשרת');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSpotDetails();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // שמירת החניה ל-5 דקות (Hold) ומעבר למסך הניווט
  const handleReserve = async () => {
    if (spot === null || reserving) return;

    setReserving(true);
    setActionError(null);
    try {
      const hold = await apiFetch<HoldResult>(`/ParkingSpots/${spot.spotId}/hold`, {
        method: 'POST',
      });

      // מחשבים את זמן הפקיעה לפי השניות שהשרת החזיר (ולא לפי תאריך, כדי להימנע מבעיות אזור זמן)
      dispatch(setHold({ spot, heldUntilMs: Date.now() + hold.expiresInSeconds * 1000 }));
      navigate('/navigation');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('409')) {
        // החניה נתפסה במקביל על ידי נהג אחר
        dispatch(excludeSpot(spot.spotId));
        setActionError('החניה נתפסה על ידי נהג אחר. חזרי לרשימה ובחרי חניה אחרת.');
         } else if (message.includes('400')) {
        setActionError('חסר מספר רישוי. חזרי למסך הרישוי והזיני מספר.');
      } else {
        setActionError('לא הצלחנו לשמור את החניה. נסי שוב.');
      }
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>טוען פרטי חניה...</div>;
  if (error || !spot) {
    return <div style={{ padding: '24px', color: 'red', textAlign: 'center' }}>{error || 'חניה לא נמצאה'}</div>;
  }

  const pricePerMin = (spot.basePricePerHour / 60).toFixed(2);

  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button label="← חזרה לרשימה" onClick={() => navigate('/search')} background="#e2e8f0" color="#0f172a" />
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
          {spot.address}, {spot.city} (חניה #{spot.spotId})
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <SpotReviews spotId={spot.spotId} />
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700 }}>פרטי החניה והמחיר</h4>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>מחיר לשעה:</strong> ₪{spot.basePricePerHour}</p>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>מחיר לדקה:</strong> ₪{pricePerMin}</p>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>עמדת טעינה:</strong> {spot.evCharger ? 'קיימת ⚡' : 'ללא'}</p>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            החניה תישמר עבורך ל-5 דקות. החיוב יתחיל רק כשתלחצי "חניתי".
          </p>
          {actionError !== null && (
            <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 700 }}>{actionError}</div>
          )}
          <Button
            label={reserving ? 'שומר את החניה...' : 'בחרי חניה וניווט ←'}
            onClick={handleReserve}
            background="#4f46e5"
            color="white"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}

export default DetailsScreen;