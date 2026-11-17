import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLicensePlate } from '../store/user/userSlice';
import ScreenSection from './ScreenSection';
import Button from './Button';

// מתחת למספר הזה מציגים התראה
const LOW_POINTS_LIMIT = 100;

function LicensePlateScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  // שדה קלט מבוקר: מתחילים מהמספר ששמור, אם יש
  const [plate, setPlate] = useState<string>(user.licensePlate ?? '');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // אין נקודות: לא מציגים טופס ולא ממשיכים לרשימת החניות
  if (user.points <= 0) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <ScreenSection title="אין נקודות זמינות">
          <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: 700, margin: '0 0 16px 0' }}>
            נגמרו לך הנקודות למימוש לחודש זה.
          </p>
          <p style={{ fontSize: '13px', color: '#5a6b82', margin: '0 0 16px 0' }}>
            הנקודות מתחדשות פעם בחודש. עד אז אפשר להרוויח נקודות על ידי השכרת חניה.
          </p>
          <Button label="חזרה לדף הבית" onClick={() => navigate('/home')} background="#0a6cf0" color="white" />
        </ScreenSection>
      </div>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
  };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanPlate = plate.trim();
    if (cleanPlate.length < 5 || cleanPlate.length > 12) {
      setError('מספר רישוי לא תקין (בין 5 ל-12 תווים)');
      return;
    }

    setSaving(true);
    setError(null);

    try {
     // הנתיב מזהה את המשתמש לפי הטוקן, ויוצר פרופיל נהג אם עדיין אין (גם אצל Owner)
      await apiFetch<unknown>('/Drivers/my-plate', {
        method: 'PUT',
        body: JSON.stringify({ licensePlate: cleanPlate }),
      });
      

      dispatch(setLicensePlate(cleanPlate));
      navigate('/search');
    } catch {
      setError('שמירת מספר הרישוי נכשלה. נסי שוב.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {user.points <= LOW_POINTS_LIMIT && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#b45309',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          ⚠️ שימי לב: נשארו לך {user.points} נקודות בלבד.
        </div>
      )}

      <ScreenSection title="באיזה רכב תחני היום?">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label htmlFor="license-plate" style={{ fontSize: '12px', fontWeight: 700, color: '#44566e' }}>
            מספר רישוי
          </label>
          <input
            id="license-plate"
            type="text"
            value={plate}
            onChange={handleChange}
            placeholder="לדוגמה: 12-345-67"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid #cfdbea',
              boxSizing: 'border-box',
            }}
          />

          {error !== null && (
            <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 700 }}>{error}</div>
          )}

          <Button
            label={saving ? 'שומר...' : 'המשך לחיפוש חניה ←'}
            background="#0a6cf0"
            color="white"
            fullWidth={true}
          />
        </form>
      </ScreenSection>
    </div>
  );
}

export default LicensePlateScreen;