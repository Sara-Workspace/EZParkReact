import { useEffect, useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchSpots } from '../store/search/searchThunks';
import { setDestination } from '../store/search/searchSlice';
import { geocodeAddress } from '../api/geocode';
import ParkingCard from './ParkingCard';
import Button from './Button';

type SortBy = 'smart' | 'distance' | 'price';

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'smart', label: 'מומלץ' },
  { value: 'distance', label: 'הכי קרוב' },
  { value: 'price', label: 'הכי זול' },
];

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} מ'` : `${km.toFixed(1)} ק"מ`;
}

// בערך 12 דקות הליכה לק"מ
function formatWalkTime(km: number): string {
  return `${Math.max(1, Math.round(km * 12))} דק' הליכה`;
}

function SearchMapScreen() {
  const dispatch = useAppDispatch();
  const points = useAppSelector((state) => state.user.points);
  const { destination, excludeIds, results, loading, error } = useAppSelector((state) => state.search);

  const [addressInput, setAddressInput] = useState<string>(destination?.address ?? '');
  const [sortBy, setSortBy] = useState<SortBy>('smart');
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // חיפוש מחדש בכל שינוי ביעד, ברשימת ההחרגות או במיון
  useEffect(() => {
    if (points > 0 && destination !== null) {
      dispatch(
        searchSpots({
          latitude: destination.latitude,
          longitude: destination.longitude,
          excludeIds,
          sortBy,
        })
      );
    }
  }, [dispatch, points, destination, excludeIds, sortBy]);

  if (points <= 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>
        נגמרו לך הנקודות למימוש לחודש זה.
      </div>
    );
  }

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addressInput.trim() === '') {
      setGeoError('יש להזין כתובת יעד');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);
    try {
      const found = await geocodeAddress(addressInput.trim());
      if (found === null) {
        setGeoError('הכתובת לא נמצאה. נסי לכתוב רחוב, מספר ועיר.');
        return;
      }
      dispatch(setDestination(found));
    } catch {
      setGeoError('לא הצלחנו לאתר את הכתובת כרגע. נסי שוב.');
    } finally {
      setGeoLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <form
        onSubmit={handleSearch}
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="לאן נוסעים? לדוגמה: הרצל 14, תל אביב"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxSizing: 'border-box',
          }}
        />
        <Button label={geoLoading ? 'מחפש כתובת...' : 'חפשי חניה'} background="#4f46e5" color="white" />
      </form>

      {geoError !== null && (
        <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700 }}>{geoError}</div>
      )}

      {destination !== null && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>מיון:</span>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSortBy(option.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: sortBy === option.value ? 'none' : '1px solid #cbd5e1',
                background: sortBy === option.value ? '#4f46e5' : 'white',
                color: sortBy === option.value ? 'white' : '#334155',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {destination === null && (
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
          הזיני כתובת יעד כדי לראות חניות פנויות בסביבה.
        </div>
      )}

      {loading && <div style={{ padding: '24px', textAlign: 'center' }}>מחפש חניות...</div>}
      {error !== null && <div style={{ padding: '24px', color: 'red', textAlign: 'center' }}>{error}</div>}

      {destination !== null && !loading && error === null && results.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
          לא נמצאו חניות פנויות באזור הזה.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {results.map((spot) => (
          <ParkingCard
            key={spot.spotId}
            id={spot.spotId}
            title={`${spot.address}, ${spot.city}`}
            distance={formatDistance(spot.distanceKm)}
            walkTime={formatWalkTime(spot.distanceKm)}
            pricePerMin={(spot.effectivePricePerHour / 60).toFixed(2)}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchMapScreen;