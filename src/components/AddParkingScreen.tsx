import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api'; // ודאי שהנתיב תואם למיקום של api.ts אצלך
import Button from './Button';

function AddParkingScreen() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  // שדות הטופס המבוקרים לפי ParkingSpotCreateDTO
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [basePricePerHour, setBasePricePerHour] = useState<string>('25');
  const [latitude, setLatitude] = useState<string>('32.0853');
  const [longitude, setLongitude] = useState<string>('34.7818');
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

  // החזרה מוקדמת (Early Return) אם המשתמש המחובר אינו בעל חניה
  if (role !== 'Owner') {
    return (
      <div
        style={{
          maxWidth: '560px',
          margin: '40px auto',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          גישה לבעלי חניות בלבד 🅿️
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          רק משתמש המחובר כבעל חניה (Owner) יכול לפרסם חניה להשכרה.
        </p>
        <div>
          <Button
            label="מעבר להתחברות / הרשמה כבעל חניה"
            onClick={() => navigate('/login')}
            background="#059669"
            color="white"
          />
        </div>
      </div>
    );
  }

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
      formData.append('Latitude', latitude);
      formData.append('Longitude', longitude);
      formData.append('EvCharger', String(evCharger));

      if (imageFile !== null) {
        formData.append('ImageFile', imageFile);
      }

      await apiFetch('/ParkingSpots', {
        method: 'POST',
        body: formData,
      });

      // מעבר ללוח הבקרה לאחר פרסום מוצלח
      navigate('/dashboard');
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
    border: '1px solid #cbd5e1',
    background: 'white',
    fontSize: '13px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: '#334155',
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
      <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
        הוספת חניה פרטית להשכרה 🅿️
      </h3>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
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
            מחיר מבוקש לשעה (בשקלים)
          </label>
          <input
            id="spot-price"
            type="number"
            step="0.5"
            min="1"
            required
            value={basePricePerHour}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setBasePricePerHour(e.target.value)}
            style={inputStyle}
          />
          <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            תעריף מחושב לנהג: <strong>₪{pricePerMinutePreview} לדקה</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="spot-lat" style={labelStyle}>
              קו רוחב (Latitude)
            </label>
            <input
              id="spot-lat"
              type="number"
              step="any"
              required
              value={latitude}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLatitude(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="spot-lng" style={labelStyle}>
              קו אורך (Longitude)
            </label>
            <input
              id="spot-lng"
              type="number"
              step="any"
              required
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
            color: '#0f172a',
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