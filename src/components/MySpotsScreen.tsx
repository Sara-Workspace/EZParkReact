import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyParkings, updateParking } from '../store/parkings/parkingsThunks';
import type { ParkingSpot } from '../types';
import SpotReviews from './SpotReviews';
import InfoCard from './InfoCard';
import Button from './Button';
import OwnerSpotCheck from './OwnerSpotCheck';

const MAX_HOURLY_PRICE = 50;

interface SpotEditDraft {
  address: string;
  city: string;
  basePricePerHour: string;
  evCharger: boolean;
}

function MySpotsScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.parkings);

  const [editingSpotId, setEditingSpotId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<SpotEditDraft>({
    address: '',
    city: '',
    basePricePerHour: '25',
    evCharger: false,
  });
  const [savingId, setSavingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ id: number; type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    dispatch(fetchMyParkings());
  }, [dispatch]);

  const mySpots = items;

  const startEditing = (spot: ParkingSpot) => {
    setEditingSpotId(spot.spotId);
    setFeedback(null);
    setEditDraft({
      address: spot.address,
      city: spot.city,
      basePricePerHour: String(spot.basePricePerHour),
      evCharger: spot.evCharger,
    });
  };

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

  const handleSaveSpotDetails = async (spot: ParkingSpot) => {
    if (savingId !== null) return;

    const trimmedAddress = editDraft.address.trim();
    const trimmedCity = editDraft.city.trim();
    const parsedPrice = Number(editDraft.basePricePerHour);

    if (trimmedAddress.length < 2 || trimmedCity.length < 2) {
      setFeedback({
        id: spot.spotId,
        type: 'err',
        text: 'יש להזין כתובת ועיר תקינות (לפחות 2 תווים).',
      });
      return;
    }

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
          address: trimmedAddress,
          city: trimmedCity,
          basePricePerHour: parsedPrice,
          evCharger: editDraft.evCharger,
        })
      ).unwrap();

      setEditingSpotId(null);
      setFeedback({
        id: spot.spotId,
        type: 'ok',
        text: 'פרטי החניה עודכנו בהצלחה ✅',
      });
    } catch {
      setFeedback({
        id: spot.spotId,
        type: 'err',
        text: 'שמירת פרטי החניה נכשלה. נסי שוב.',
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
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0a2540' }}>החניות שלי 🅿️</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#44566e' }}>
            ניהול זמינות ועריכת פרטי חניה (עד {MAX_HOURLY_PRICE} נק׳/שעה)
          </p>
        </div>
        <Button
          label="+ הוספת חניה חדשה"
          onClick={() => navigate('/add-parking')}
          background="#0a6cf0"
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
          <p style={{ fontSize: '14px', color: '#44566e', margin: '12px 0' }}>
            הוסיפי חניה פרטית כדי להתחיל לצבור נקודות מנהגים שחונים אצלך.
          </p>
          <Button
            label="הוספת חניה ראשונה"
            onClick={() => navigate('/add-parking')}
            background="#0a2540"
            color="white"
          />
        </InfoCard>
      ) : (
        mySpots.map((spot) => {
          const isSaving = savingId === spot.spotId;
          const isEditing = editingSpotId === spot.spotId;
          const spotFeedback = feedback?.id === spot.spotId ? feedback : null;

          return (
            <InfoCard key={spot.spotId} title={`${spot.address}, ${spot.city}`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                {/* שורת סטטוס, מחיר ופעולות */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: spot.isActive ? '#dcfce7' : '#eef4fb',
                        color: spot.isActive ? '#166534' : '#44566e',
                      }}
                    >
                      {spot.isActive ? '● זמינה להזמנות' : '○ לא זמינה'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#2a3b52' }}>
                      {spot.basePricePerHour} נק׳/שעה
                    </span>
                    {spot.evCharger && (
                      <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 700 }}>⚡ עמדת טעינה</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => (isEditing ? setEditingSpotId(null) : startEditing(spot))}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cfdbea',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        background: 'white',
                        color: '#0a2540',
                      }}
                    >
                      {isEditing ? 'ביטול עריכה' : '✏️ עריכת פרטים'}
                    </button>

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
                </div>

                {/* טופס עריכת פרטי חניה */}
                {isEditing && (
                  <div
                    style={{
                      background: '#f6faff',
                      border: '1px solid #cfdbea',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          כתובת (רחוב ומספר)
                        </label>
                        <input
                          type="text"
                          value={editDraft.address}
                          onChange={(e) => setEditDraft((d) => ({ ...d, address: e.target.value }))}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cfdbea', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          עיר
                        </label>
                        <input
                          type="text"
                          value={editDraft.city}
                          onChange={(e) => setEditDraft((d) => ({ ...d, city: e.target.value }))}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cfdbea', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          מחיר לשעה (1–{MAX_HOURLY_PRICE} נק׳)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={MAX_HOURLY_PRICE}
                          step="0.5"
                          value={editDraft.basePricePerHour}
                          onChange={(e) => setEditDraft((d) => ({ ...d, basePricePerHour: e.target.value }))}
                          style={{ width: '110px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cfdbea' }}
                        />
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginTop: '16px' }}>
                        <input
                          type="checkbox"
                          checked={editDraft.evCharger}
                          onChange={(e) => setEditDraft((d) => ({ ...d, evCharger: e.target.checked }))}
                        />
                        עמדת טעינה חשמלית ⚡
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveSpotDetails(spot)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: isSaving ? 'not-allowed' : 'pointer',
                          background: '#0a6cf0',
                          color: 'white',
                        }}
                      >
                        {isSaving ? 'שומר...' : 'שמירת שינויים'}
                      </button>
                    </div>
                  </div>
                )}

                <OwnerSpotCheck spotId={spot.spotId} onChecked={() => dispatch(fetchMyParkings())} />

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