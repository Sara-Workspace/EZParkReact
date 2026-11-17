import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyParkings, updateParking } from '../store/parkings/parkingsThunks';
import type { ParkingSpot } from '../types';
import SpotReviews from './SpotReviews';
import InfoCard from './InfoCard';
import Button from './Button';

const MAX_HOURLY_PRICE = 50;

function MySpotsScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.parkings);
 

  const [priceDrafts, setPriceDrafts] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ id: number; type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    dispatch(fetchMyParkings());
  }, [dispatch]);

    const mySpots = items; // השרת כבר החזיר רק את החניות שלה

  const getPriceInput = (spot: ParkingSpot): string =>
    priceDrafts[spot.spotId] !== undefined ? priceDrafts[spot.spotId] : String(spot.basePricePerHour);

  const handleToggleAvailability = async (spot: ParkingSpot) => {
    if (savingId !== null) return;
    setSavingId(spot.spotId);
    setFeedback(null);

    try {
      await dispatch(
        updateParking({
          ...spot,
          isActive: !spot.isActive,
        })
      ).unwrap();

      setFeedback({
        id: spot.spotId,
        type: 'ok',
        text: !spot.isActive ? 'החניה סומנה כזמינה להזמנות ✅' : 'החניה סומנה כלא זמינה ⏸️',
      });
    } catch {
      setFeedback({
        id: spot.spotId,
        type: 'err',
        text: 'עדכון הזמינות נכשל. ודאי שיש לך הרשאת בעלת חניה.',
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleSavePrice = async (spot: ParkingSpot) => {
    if (savingId !== null) return;
    const parsedPrice = Number(getPriceInput(spot));

  if (!Number.isFinite(parsedPrice) || parsedPrice < 1 || parsedPrice > MAX_HOURLY_PRICE) {
      setFeedback({
        id: spot.spotId,
        type: 'err',
        text: `מחיר מקסימלי: ${MAX_HOURLY_PRICE} נקודות לשעה (הזיני ערך בין 1 ל-${MAX_HOURLY_PRICE}).`,
      });
      return;
    }

    setSavingId(spot.spotId);
    setFeedback(null);

    try {
      await dispatch(
        updateParking({
          ...spot,
          basePricePerHour: parsedPrice,
        })
      ).unwrap();

      setFeedback({
        id: spot.spotId,
        type: 'ok',
        text: `המחיר עודכן ל-${parsedPrice} נקודות לשעה ✅`,
      });
    } catch {
      setFeedback({
        id: spot.spotId,
        type: 'err',
        text: `השרת דחה את העדכון (מקסימום ${MAX_HOURLY_PRICE} נק'/שעה).`,
      });
    } finally {
      setSavingId(null);
    }
  };

  if (loading && items.length === 0) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>טוען את החניות שלך...</div>;
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>החניות שלי 🅿️</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#475569' }}>
            ניהול זמינות ומחיר לשעה (עד {MAX_HOURLY_PRICE} נק׳/שעה)
          </p>
        </div>
        <Button
          label="+ הוספת חניה חדשה"
          onClick={() => navigate('/add-parking')}
          background="#4f46e5"
          color="white"
        />
      </div>

      {error !== null && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '12px', fontWeight: 700 }}>
          {error}
        </div>
      )}

      {mySpots.length === 0 ? (
        <InfoCard title="עדיין אין לך חניות רשומות">
          <p style={{ fontSize: '14px', color: '#475569', margin: '12px 0' }}>
            הוסיפי חניה פרטית כדי להתחיל לצבור נקודות מנהגים שחונים אצלך.
          </p>
          <Button
            label="הוספת חניה ראשונה"
            onClick={() => navigate('/add-parking')}
            background="#0f172a"
            color="white"
          />
        </InfoCard>
      ) : (
        mySpots.map((spot) => {
          const isSaving = savingId === spot.spotId;
          const spotFeedback = feedback?.id === spot.spotId ? feedback : null;

          return (
            <InfoCard key={spot.spotId} title={`${spot.address}, ${spot.city}`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                {/* שורת סטטוס וזמינות */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: spot.isActive ? '#dcfce7' : '#f1f5f9',
                        color: spot.isActive ? '#166534' : '#475569',
                      }}
                    >
                      {spot.isActive ? '● זמינה להזמנות' : '○ לא זמינה'}
                    </span>
                    {spot.evCharger && (
                      <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 700 }}>⚡ עמדת טעינה</span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleToggleAvailability(spot)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      background: spot.isActive ? '#fee2e2' : '#dcfce7',
                      color: spot.isActive ? '#b91c1c' : '#15803d',
                    }}
                  >
                    {isSaving ? 'מעדכן...' : spot.isActive ? 'סמני כלא זמינה' : 'הפכי לזמינה'}
                  </button>
                </div>

                {/* שורת עריכת מחיר לשעה */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    מחיר לשעה (נק׳):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={MAX_HOURLY_PRICE}
                    step="1"
                    value={getPriceInput(spot)}
                    onChange={(e) =>
                      setPriceDrafts((prev) => ({ ...prev, [spot.spotId]: e.target.value }))
                    }
                    style={{
                      width: '90px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}
                  />
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSavePrice(spot)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      background: '#0f172a',
                      color: 'white',
                    }}
                  >
                    שמירת מחיר
                  </button>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    (מקסימום {MAX_HOURLY_PRICE} נק׳ לשעה)
                    </span>
                </div>

                {spotFeedback !== null && (
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: spotFeedback.type === 'ok' ? '#059669' : '#dc2626',
                    }}
                  >
                    {spotFeedback.text}
                  </div>
                )}
                <SpotReviews spotId={spot.spotId} />
              </div>
            </InfoCard>
          );
        })
      )}
    </div>
  );
}

export default MySpotsScreen;