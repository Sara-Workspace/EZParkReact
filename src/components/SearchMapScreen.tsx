import { useEffect, useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchSpots } from '../store/search/searchThunks';
import { setDestination } from '../store/search/searchSlice';
import { geocodeAddress } from '../api/geocode';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import type { ParkingSpot } from '../types';
import ParkingCard from './ParkingCard';
import SpotsMap from './SpotsMap';
import Button from './Button';
import { useMyLocation, type MyLocation } from '../hooks/useMyLocation';

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

// "רח' טרומפלדור 32" -> "טרומפלדור": מסירים קידומת "רח'/רחוב" ומספר בית בסוף
function streetOf(address: string): string {
  return address
    .replace(/^(רח'|רחוב)\s+/, '')
    .replace(/\s*\d+[א-תa-zA-Z]?\s*([-/]\s*\d+)?\s*$/, '')
    .trim();
}

function SearchMapScreen() {
  const dispatch = useAppDispatch();
  const points = useAppSelector((state) => state.user.points);
  const { destination, excludeIds, results, loading, error } = useAppSelector((state) => state.search);
  const licensePlate = useAppSelector((state) => state.user.licensePlate);

  const [addressInput, setAddressInput] = useState<string>(destination?.address ?? '');
  const [sortBy, setSortBy] = useState<SortBy>('smart');
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, { latitude: number; longitude: number }>>({});

  // 📍 "המיקום שלי": ההוק שואל את הדפדפן איפה המשתמש נמצא עכשיו.
  // חייב להיות כאן למעלה, לפני ה-return-ים המוקדמים (כלל של הוקים: תמיד באותו סדר)
  const { locating, locationError, findMyLocation } = useMyLocation();

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

  // הצעות לחיפוש: כל רחוב (בלי מספר בית) מופיע פעם אחת
  useEffect(() => {
    let cancelled = false;

    apiFetch<ParkingSpot[]>('/ParkingSpots')
      .then((allSpots) => {
        if (cancelled) return;

        const groups = new Map<string, ParkingSpot[]>();
        allSpots
          .filter((s) => s.latitude !== 0 && s.longitude !== 0)
          .forEach((s) => {
            const key = `${streetOf(s.address)}, ${s.city}`;
            groups.set(key, [...(groups.get(key) ?? []), s]);
          });

        const result: Record<string, { latitude: number; longitude: number }> = {};
        groups.forEach((group, key) => {
          result[key] = {
            latitude: group.reduce((sum, s) => sum + s.latitude, 0) / group.length,
            longitude: group.reduce((sum, s) => sum + s.longitude, 0) / group.length,
          };
        });
        setSuggestions(result);
      })
      .catch(() => {
        // בלי הצעות עדיין אפשר להקליד כתובת ידנית
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // בלי מספר רישוי שמור אי אפשר להמשיך: חוזרים למסך ההזנה
  if (!licensePlate) {
    return <Navigate to="/license-plate" replace />;
  }

  if (points <= 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>
        נגמרו לך הנקודות למימוש לחודש זה.
      </div>
    );
  }

  // 📍 לחיצה על "המיקום שלי": כשהמיקום נמצא, הוא הופך ליעד החיפוש,
  // בדיוק כמו כתובת שהוקלדה. ה-useEffect למעלה רואה שהיעד השתנה ומחפש חניות סביבו
  const handleMyLocation = () => {
    setGeoError(null);
    findMyLocation((location: MyLocation) => {
      setAddressInput('המיקום שלי 📍');
      dispatch(
        setDestination({
          address: 'המיקום שלי',
          latitude: location.latitude,
          longitude: location.longitude,
        })
      );
    });
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addressInput.trim() === '') {
      setGeoError('יש להזין כתובת יעד');
      return;
    }

    // כבר חיפשנו לפי "המיקום שלי" - אין כתובת אמיתית לחפש, אז לא עושים כלום
    if (addressInput === 'המיקום שלי 📍') return;

    const known = suggestions[addressInput.trim()];
    if (known !== undefined) {
      setGeoError(null);
      dispatch(
        setDestination({
          address: addressInput.trim(),
          latitude: known.latitude,
          longitude: known.longitude,
        })
      );
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
          background: '#f6faff',
          border: '1px solid #dfe8f3',
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
          list="address-suggestions"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '12px',
            border: '1px solid #cfdbea',
            boxSizing: 'border-box',
          }}
        />
        <datalist id="address-suggestions">
          {Object.keys(suggestions).map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
<Button label={geoLoading ? 'מחפש כתובת...' : 'חפשי חניה'} background="#0a6cf0" color="white" />
        {/* 📍 כפתור "המיקום שלי". type="button" כדי שלא ישלח את הטופס (לא יחפש לפי הכתובת שבתיבה) */}
        <button
          type="button"
          onClick={handleMyLocation}
          disabled={locating}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid #0a6cf0',
            background: 'white',
            color: '#0a6cf0',
            fontWeight: 700,
            cursor: locating ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
          }}
        >
          {locating ? 'מאתר מיקום...' : '📍 המיקום שלי'}
        </button>
      </form>

      {geoError !== null && (
        <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700 }}>{geoError}</div>
      )}

      {/* שגיאה של "המיקום שלי" (למשל: המשתמש לא אישר גישה למיקום) */}
      {locationError !== null && (
        <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700 }}>{locationError}</div>
      )}

      {destination !== null && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#5a6b82' }}>מיון:</span>
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
                border: sortBy === option.value ? 'none' : '1px solid #cfdbea',
                background: sortBy === option.value ? '#0a6cf0' : 'white',
                color: sortBy === option.value ? 'white' : '#2a3b52',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {destination === null && (
        <div style={{ padding: '24px', textAlign: 'center', color: '#5a6b82' }}>
          הזיני כתובת יעד כדי לראות חניות פנויות בסביבה.
        </div>
      )}

      {loading && <div style={{ padding: '24px', textAlign: 'center' }}>מחפש חניות...</div>}
      {error !== null && <div style={{ padding: '24px', color: 'red', textAlign: 'center' }}>{error}</div>}

      {/* מפת החניות האינטראקטיבית */}
      {destination !== null && !loading && error === null && (
        <SpotsMap destination={destination} spots={results} />
      )}

      {destination !== null && !loading && error === null && results.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', color: '#5a6b82' }}>
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