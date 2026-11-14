import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchParkings } from '../store/parkings/parkingsThunks';
import ParkingCard from './ParkingCard';

function SearchMapScreen() {
  const dispatch = useAppDispatch();
  const { items: allSpots, loading, error } = useAppSelector((state) => state.parkings);

  // ערך נגזר: מציגים לנהג רק חניות זמינות
  const spots = allSpots.filter((spot) => spot.isActive);

  // שליפת הנתונים בטעינת הקומפוננטה - דרך ה-Store ולא fetch ישיר
  useEffect(() => {
    dispatch(fetchParkings());
  }, [dispatch]);

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>טוען חניות מהשרת...</div>;
  if (error) return <div style={{ padding: '24px', color: 'red', textAlign: 'center' }}>{error}</div>;

  const firstSpot = spots[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e293b',
            width: '320px',
          }}
        >
          {firstSpot ? `${firstSpot.address}, ${firstSpot.city}` : 'רחוב הרצל 14, תל אביב-יפו'}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              padding: '8px 12px',
              background: '#4f46e5',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            הכל ({spots.length})
          </span>
          <span
            style={{
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          >
            עמדת טעינה ⚡
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div
          style={{
            height: '420px',
            background: '#e2e8f0',
            border: '1px solid #cbd5e1',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#475569',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '8px',
              borderRadius: '12px',
              width: 'fit-content',
            }}
          >
            📍 מפת חניות אינטראקטיבית
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {firstSpot && (
              <div
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                ₪{(firstSpot.basePricePerHour / 60).toFixed(2)} / דקה • {firstSpot.address}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
            חניות זמינות בשרת
          </h4>

          {/* 5. לולאת map להצגת כרטיסי החניות מה-DB */}
          {spots.map((spot) => (
            <ParkingCard
              key={spot.spotId}
              id={spot.spotId}
              title={`${spot.address}, ${spot.city}`}
              distance="300 מ'"
              walkTime="4 דק' הליכה"
              rating={4.8}
              pricePerMin={(spot.basePricePerHour / 60).toFixed(2)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchMapScreen;