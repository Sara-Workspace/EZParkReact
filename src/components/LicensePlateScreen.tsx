import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, getErrorMessage } from '../api/api';
import FieldMessage from './FieldMessage';
import { validatePlate } from '../utils/validation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLicensePlate } from '../store/user/userSlice';
import ScreenSection from './ScreenSection';
import Button from './Button';
import { formatMoney } from '../utils/money';

// מתחת לסכום הזה (בשקלים) מציגים התראה
const LOW_POINTS_LIMIT = 20;

function LicensePlateScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  // שדה קלט מבוקר: מתחילים מהמספר ששמור, אם יש
  const [plate, setPlate] = useState<string>(user.licensePlate ?? '');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // הופך ל-true אחרי הניסיון הראשון להמשיך. רק מאז מסמנים את השדה באדום
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // בדיקת המספר בכל הקלדה: 7 או 8 ספרות
  const plateError = validatePlate(plate);

  // אין כסף בארנק: לא מציגים טופס ולא ממשיכים לרשימת החניות
  if (user.points <= 0) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <ScreenSection title="הארנק ריק">
          <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: 700, margin: '0 0 16px 0' }}>
            אין מספיק כסף בארנק. היתרה שלך: {formatMoney(user.points)}
          </p>
          <p style={{ fontSize: '13px', color: '#5a6b82', margin: '0 0 16px 0' }}>
            טוענים את הארנק ב-PayPal תוך דקה, ואז אפשר לחפש חניה.
          </p>
          <Button label="לטעינת הארנק 👛" onClick={() => navigate('/wallet')} background="#0a6cf0" color="white" />
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
    setShowErrors(true);
    if (plateError !== null) return; // ההודעה כבר מוצגת מתחת לשדה

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
    } catch (err) {
      setError(getErrorMessage(err, 'שמירת מספר הרישוי נכשלה. נסי שוב.'));
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
          ⚠️ שימי לב: נשארו לך {formatMoney(user.points)} בארנק בלבד.
        </div>
      )}

      <ScreenSection title="באיזה רכב תחני היום?">
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          {/* בזמן ההקלדה: כמה ספרות חסרות */}
          <FieldMessage
            error={plateError}
            show={showErrors}
            hint={plate.trim() === '' ? '7 או 8 ספרות, מותר עם מקפים' : plateError ?? '✓ מספר תקין'}
          />

          {error !== null && (
            <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 700, whiteSpace: 'pre-line' }}>{error}</div>
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