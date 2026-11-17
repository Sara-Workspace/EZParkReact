import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { addParking } from '../store/parkings/parkingsThunks';
import Button from './Button';

function AddParkingScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // שדות הטופס המבוקרים לפי ParkingSpotCreateDTO
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [basePricePerHour, setBasePricePerHour] = useState<string>('25');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [evCharger, setEvCharger] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // מצבי שליחת הבקשה
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // חישוב נגזר בזמן רינדור: תצוגה מקדימה של המחיר לדקה
  const numericHourlyPrice = Number(basePricePerHour);
  const pricePerMinutePreview =
    !Number.isNaN(numericHourlyPrice) && numericHourlyPrice > 0
      ? (numericHourlyPrice / 60).toFixed(2)
      : '0.00';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setImageFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (address.trim() === '' || city.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      // בניית FormData בהתאמה ל-[FromForm] ParkingSpotCreateDTO
      const formData = new FormData();
      formData.append('Address', address);
      formData.append('City', city);
      formData.append('BasePricePerHour', basePricePerHour);
            // מיקום אופציונלי: אם השדות ריקים, השרת מאתר אותו לפי הכתובת
      if (latitude.trim() !== '' && longitude.trim() !== '') {
        formData.append('Latitude', latitude);
        formData.append('Longitude', longitude);
      }
     if (numericHourlyPrice > 50) {
      setError('המחיר המקסימלי הוא 50 נקודות לשעה.');
      return;
    }
      formData.append('EvCharger', String(evCharger));

      if (imageFile !== null) {
        formData.append('ImageFile', imageFile);
      }

      // unwrap() גורם ל-dispatch לזרוק שגיאה אם הבקשה נכשלה, כדי שה-catch יעבוד
      await dispatch(addParking(formData)).unwrap();

      // מעבר ללוח הבקרה לאחר פרסום מוצלח
     navigate('/my-spots');
    } catch {
      setError('שמירת החניה נכשלה. ודא שכל הערכים תקינים ושאתה מחובר כבעל חניה.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #cfdbea',
    background: 'white',
    fontSize: '13px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: '#2a3b52',
    marginBottom: '4px',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0a2540', margin: 0 }}>
        הוספת חניה פרטית להשכרה 🅿️
      </h3>

      <div
        style={{
          background: '#f6faff',
          border: '1px solid #dfe8f3',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="spot-address" style={labelStyle}>
              כתובת החניה (רחוב ומספר)
            </label>
            <input
              id="spot-address"
              type="text"
              required
              value={address}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
              placeholder="רח' דיזנגוף 120"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="spot-city" style={labelStyle}>
              עיר
            </label>
            <input
              id="spot-city"
              type="text"
              required
              value={city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
              placeholder="תל אביב-יפו"
              style={inputStyle}
            />
          </div>
        </div>

    <div>
  <label htmlFor="spot-price" style={labelStyle}>
    מחיר מבוקש לשעה (בנקודות)
  </label>
  <input
    id="spot-price"
    type="number"
    step="0.5"
    min="1"
    max="50"
    required
    value={basePricePerHour}
    onChange={(e: ChangeEvent<HTMLInputElement>) => setBasePricePerHour(e.target.value)}
    style={inputStyle}
  />
  <span style={{ display: 'block', fontSize: '11px', color: '#5a6b82', marginTop: '4px' }}>
    מחיר מקסימלי: <strong>50 נקודות לשעה</strong> • תעריף מחושב לנהג:{' '}
    <strong>{pricePerMinutePreview} נק׳ לדקה</strong>
  </span>
</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="spot-lat" style={labelStyle}>
             קו רוחב (אופציונלי)(Latitude)
            </label>
            <input
              id="spot-lat"
              type="number"
              step="any"
              value={latitude}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLatitude(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="spot-lng" style={labelStyle}>
             קו אורך (אופציונלי)(Longitude)
            </label>
            <input
              id="spot-lng"
              type="number"
              step="any"
              value={longitude}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLongitude(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label htmlFor="spot-image" style={labelStyle}>
            תמונת החניה (אופציונלי)
          </label>
          <input
            id="spot-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={inputStyle}
          />
        </div>

        <label
          htmlFor="spot-ev"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0a2540',
            cursor: 'pointer',
          }}
        >
          <input
            id="spot-ev"
            type="checkbox"
            checked={evCharger}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEvCharger(e.target.checked)}
          />
          קיימת עמדת טעינה לרכב חשמלי ⚡
        </label>

        {error !== null && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '10px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}

        <Button
          label={loading ? 'שומר חניה בשרת...' : 'פרסם חניה להשכרה כעת 🚗'}
          background="#059669"
          color="white"
          fullWidth={true}
        />
      </div>
    </form>
  );
}

export default AddParkingScreen;