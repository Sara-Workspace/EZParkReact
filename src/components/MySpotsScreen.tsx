import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchParkings, updateParking, deleteParking } from '../store/parkings/parkingsThunks';
import type { ParkingSpot } from '../store/parkings/parkingsState';
import ScreenSection from './ScreenSection';
import Button from './Button';

function MySpotsScreen() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.parkings);

  // מזהה המשתמש המחובר - נשמר ב-localStorage בעת ההתחברות
  const userId = Number(localStorage.getItem('userId'));

  // מצב עריכת מחיר: איזו חניה נערכת כרגע, והערך בשדה
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchParkings());
  }, [dispatch]);

  // ערך נגזר: רק החניות של המשתמש המחובר (לא נשמר ב-state)
  const mySpots = items.filter((spot) => spot.ownerId === userId);

  const getMessage = (err: unknown) =>
    (err as { message?: string }).message ?? 'שגיאה לא ידועה';

  const handleToggleActive = async (spot: ParkingSpot) => {
    try {
      setActionError(null);
      await dispatch(updateParking({ ...spot, isActive: !spot.isActive })).unwrap();
    } catch (err) {
      setActionError(`עדכון הזמינות נכשל: ${getMessage(err)}`);
    }
  };

  const handleStartEdit = (spot: ParkingSpot) => {
    setEditingId(spot.spotId);
    setEditPrice(String(spot.basePricePerHour));
  };

  const handleSavePrice = async (spot: ParkingSpot) => {
    const newPrice = Number(editPrice);
    if (Number.isNaN(newPrice) || newPrice <= 0) {
      setActionError('יש להזין מחיר גדול מ-0');
      return;
    }
    try {
      setActionError(null);
      await dispatch(updateParking({ ...spot, basePricePerHour: newPrice })).unwrap();
      setEditingId(null);
    } catch (err) {
      setActionError(`עדכון המחיר נכשל: ${getMessage(err)}`);
    }
  };

  const handleDelete = async (spotId: number) => {
    if (!window.confirm('האם למחוק את החניה לצמיתות?')) return;
    try {
      setActionError(null);
      await dispatch(deleteParking(spotId)).unwrap();
    } catch (err) {
      setActionError(`מחיקת החניה נכשלה: ${getMessage(err)}`);
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>טוען את החניות שלך...</div>;
  if (error !== null) return <div style={{ padding: '24px', color: '#dc2626', textAlign: 'center' }}>{error}</div>;

  const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'right' };
  const thStyle: CSSProperties = { padding: '10px 12px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 700 };
  const tdStyle: CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #f1f5f9' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>החניות שלי 🅿️</h2>

      {actionError !== null && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
          {actionError}
        </div>
      )}

      <ScreenSection title={`החניות שברשותי (${mySpots.length})`}>
        {mySpots.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>מזהה</th>
                  <th style={thStyle}>כתובת ועיר</th>
                  <th style={thStyle}>מחיר לשעה</th>
                  <th style={thStyle}>סטטוס</th>
                  <th style={thStyle}>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {mySpots.map((spot) => (
                  <tr key={spot.spotId}>
                    <td style={tdStyle}>#{spot.spotId}</td>
                    <td style={tdStyle}>{spot.address}, {spot.city}</td>
                    <td style={tdStyle}>
                      {editingId === spot.spotId ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="number"
                            min="1"
                            step="0.5"
                            value={editPrice}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPrice(e.target.value)}
                            style={{ width: '80px', padding: '6px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                          <Button label="שמור" onClick={() => handleSavePrice(spot)} background="#059669" color="white" />
                          <Button label="ביטול" onClick={() => setEditingId(null)} background="#e2e8f0" color="#0f172a" />
                        </div>
                      ) : (
                        <>₪{spot.basePricePerHour}</>
                      )}
                    </td>
                    <td style={tdStyle}>{spot.isActive ? 'זמינה ✅' : 'לא זמינה ❌'}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <Button
                          label={spot.isActive ? 'סמן כלא זמינה' : 'סמן כזמינה'}
                          onClick={() => handleToggleActive(spot)}
                          background="#e0e7ff"
                          color="#4338ca"
                        />
                        <Button label="ערוך מחיר" onClick={() => handleStartEdit(spot)} background="#f1f5f9" color="#0f172a" />
                        <Button label="מחק" onClick={() => handleDelete(spot.spotId)} background="#fee2e2" color="#dc2626" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>עדיין לא הוספת חניות. אפשר להוסיף דרך "הוספת חניה".</p>
        )}
      </ScreenSection>
    </div>
  );
}

export default MySpotsScreen;