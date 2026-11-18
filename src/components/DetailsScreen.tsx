import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch, getErrorMessage, getErrorStatus } from '../api/api';
import { useAppDispatch } from '../store/hooks';
import { setHold } from '../store/session/sessionSlice';
import { excludeSpot } from '../store/search/searchSlice';
import type { ParkingSpot, HoldResult } from '../types';
import SpotReviews from './SpotReviews';
import Button from './Button';
import ParkingTermsConsent from './ParkingTermsConsent';

const SERVER_ORIGIN = 'http://ezpark.tryasp.net';

function resolveSpotImageUrl(image?: string | null): string | null {
  if (!image || image.trim() === '') return null;
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image;
  }
  const cleanPath = image.startsWith('/') ? image : `/images/${image}`;
  return `${SERVER_ORIGIN}${cleanPath}`;
}

function DetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchSpotDetails = async () => {
      try {
        const data = await apiFetch<ParkingSpot>(`/ParkingSpots/${id}`);
        if (cancelled) return;
        setSpot(data);
        setImgFailed(false);
        document.title = `פארקי - ${data.address}, ${data.city}`;
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'החניה לא נמצאה בשרת'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSpotDetails();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleReserve = async () => {
    if (spot === null || reserving) return;

    setShowTermsModal(false);
    setReserving(true);
    setActionError(null);
    try {
      const hold = await apiFetch<HoldResult>(`/ParkingSpots/${spot.spotId}/hold`, {
        method: 'POST',
      });

      dispatch(setHold({ spot, heldUntilMs: Date.now() + hold.expiresInSeconds * 1000 }));
      navigate('/navigation');
    } catch (err) {
      if (getErrorStatus(err) === 409) {
        // 409 = החניה שמורה לנהג אחר: מורידים אותה מהחיפוש
        dispatch(excludeSpot(spot.spotId));
        setActionError('החניה נתפסה על ידי נהג אחר. חזרי לרשימה ובחרי חניה אחרת.');
      } else {
        // כל השאר: ההודעה הברורה מהשרת, למשל "יש להזין מספר רישוי רכב לפני תפיסת חניה."
        // או "החניה לא זמינה בשעה הזאת לפי השעות שבעל החניה קבע."
        setActionError(getErrorMessage(err, 'לא הצלחנו לשמור את החניה. נסי שוב.'));
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
  const imageUrl = resolveSpotImageUrl(spot.image);

  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#f6faff', border: '1px solid #dfe8f3', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button label="← חזרה לרשימה" onClick={() => navigate('/search')} background="#dfe8f3" color="#0a2540" />
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
          {spot.address}, {spot.city} (חניה #{spot.spotId})
        </h3>
      </div>

      {imageUrl !== null && !imgFailed && (
        <div
          style={{
            background: '#f6faff',
            border: '1px solid #dfe8f3',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={imageUrl}
            alt={`תמונת חניה - ${spot.address}, ${spot.city}`}
            onError={() => setImgFailed(true)}
            style={{
              maxWidth: '100%',
              maxHeight: '240px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '12px',
              display: 'block',
            }}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: '#f6faff', border: '1px solid #dfe8f3', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>פרטי החניה והמחיר</h4>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>מחיר לשעה:</strong> {spot.basePricePerHour} ₪</p>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>מחיר לדקה:</strong> {pricePerMin} ₪</p>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>עמדת טעינה:</strong> {spot.evCharger ? 'קיימת ⚡' : 'ללא'}</p>
        </div>

        <div style={{ background: '#f6faff', border: '1px solid #dfe8f3', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: '#5a6b82', margin: 0 }}>
            החניה תישמר עבורך ל-5 דקות. החיוב יתחיל רק כשתלחצי "חניתי".
          </p>
          {actionError !== null && (
            <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 700 }}>{actionError}</div>
          )}
          <Button
            label={reserving ? 'שומר את החניה...' : 'בחרי חניה וניווט ←'}
            onClick={() => setShowTermsModal(true)}
            background="#0a6cf0"
            color="white"
            fullWidth={true}
          />
        </div>
      </div>

      {showTermsModal && (
        <div
          onClick={() => setShowTermsModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 37, 64, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <ParkingTermsConsent
              spotAddress={`${spot.address}, ${spot.city} (חניה #${spot.spotId})`}
              onConfirm={handleReserve}
              onCancel={() => setShowTermsModal(false)}
            />
          </div>
        </div>
      )}

      <SpotReviews spotId={spot.spotId} />
    </div>
  );
}

export default DetailsScreen;