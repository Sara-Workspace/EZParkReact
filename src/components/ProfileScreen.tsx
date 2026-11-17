import { useEffect, useState, type FormEvent } from 'react';
import { apiFetch, getErrorMessage } from '../api/api';
import FieldMessage from './FieldMessage';
import { validatePhone, validatePlate, validateText } from '../utils/validation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, setLicensePlate } from '../store/user/userSlice';
import InfoCard from './InfoCard';


interface DriverProfile {
  driverID?: number;
  driverId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensePlate?: string | null;
  paymentMethodID?: number;
}

interface OwnerProfile {
  ownerID?: number;
  ownerId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bankDetails?: string;
}

function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const storedUserId = Number(localStorage.getItem('userId') || user.userId || 0);
  const isOwner = user.role === 'Owner';

  const [recordId, setRecordId] = useState<number>(storedUserId);
  const [email, setEmail] = useState<string>(localStorage.getItem('userEmail') ?? '');
  const [firstName, setFirstName] = useState<string>(user.firstName ?? '');
  const [lastName, setLastName] = useState<string>(user.lastName ?? '');
  const [phone, setPhone] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<string>('');
  const [paymentMethodId, setPaymentMethodId] = useState<number>(1);
  const [plate, setPlate] = useState<string>(user.licensePlate ?? '');

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  // הופך ל-true אחרי הניסיון הראשון לשמור. רק מאז מסמנים שדות באדום
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // ===== בדיקת השדות (אותם כללים כמו בשרת) =====
  const firstNameError = validateText(firstName, 'שם פרטי', 2, 50);
  const lastNameError = validateText(lastName, 'שם משפחה', 2, 50);
  const phoneError = validatePhone(phone);
  const bankError = isOwner ? validateText(bankDetails, 'פרטי חשבון בנק', 5, 100) : null;
  // מספר רישוי בפרופיל לא חובה, אבל אם כתבו - חייב להיות תקין
  const plateError = !isOwner && plate.trim() !== '' ? validatePlate(plate) : null;

  const hasErrors = [firstNameError, lastNameError, phoneError, bankError, plateError]
    .some((fieldError) => fieldError !== null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setFeedback(null);

        if (isOwner) {
          const data = await apiFetch<OwnerProfile>(`/Owners/${storedUserId}`);
          setRecordId(data.ownerID ?? data.ownerId ?? storedUserId);
          setEmail(data.email ?? '');
          setFirstName(data.firstName ?? '');
          setLastName(data.lastName ?? '');
          setPhone(data.phone ?? '');
          setBankDetails(data.bankDetails ?? '');
        } else {
          const data = await apiFetch<DriverProfile>('/Drivers/me');
          setRecordId(data.driverID ?? data.driverId ?? storedUserId);
          setEmail(data.email ?? '');
          setFirstName(data.firstName ?? '');
          setLastName(data.lastName ?? '');
          setPhone(data.phone ?? '');
          setPaymentMethodId(data.paymentMethodID ?? 1);
          if (data.licensePlate) {
            setPlate(data.licensePlate);
          }
        }
      } catch (err) {
        setFeedback({
          type: 'err',
          text: getErrorMessage(err, 'לא ניתן היה לטעון את פרטי הפרופיל מהשרת.'),
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isOwner, storedUserId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;

    // יש שדה לא תקין: מסמנים באדום ולא שולחים לשרת
    setShowErrors(true);
    if (hasErrors) {
      setFeedback({ type: 'err', text: 'יש לתקן את השדות המסומנים באדום.' });
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);

      if (isOwner) {
        const updated = await apiFetch<OwnerProfile>(`/Owners/${recordId}`, {
          method: 'PUT',
          body: JSON.stringify({
            ownerID: recordId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            bankDetails: bankDetails.trim(),
          }),
        });

        dispatch(
          setUser({
            ...user,
            firstName: updated.firstName,
            lastName: updated.lastName,
          })
        );
      } else {
        const updated = await apiFetch<DriverProfile>(`/Drivers/${recordId}`, {
          method: 'PUT',
          body: JSON.stringify({
            driverID: recordId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            paymentMethodID: paymentMethodId,
          }),
        });

        if (plate.trim().length > 0 && plate.trim() !== (user.licensePlate ?? '')) {
          await apiFetch('/Drivers/my-plate', {
            method: 'PUT',
            body: JSON.stringify({ licensePlate: plate.trim() }),
          });
          dispatch(setLicensePlate(plate.trim()));
        }

        dispatch(
          setUser({
            ...user,
            firstName: updated.firstName,
            lastName: updated.lastName,
            licensePlate: plate.trim() || user.licensePlate,
          })
        );
      }

      // עדכון גם ב-localStorage לשמירה ברענון דף
      const savedRaw = localStorage.getItem('user');
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw) as Record<string, unknown>;
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...parsed,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            licensePlate: plate.trim() || parsed.licensePlate,
          })
        );
      }

      setFeedback({
        type: 'ok',
        text: isOwner ? 'פרטי בעל החניה עודכנו בהצלחה ✅' : 'פרטי המשתמש עודכנו בהצלחה ✅',
      });
    } catch (err) {
      // ההודעה הברורה מהשרת (למשל "מספר הטלפון לא תקין")
      setFeedback({ type: 'err', text: getErrorMessage(err, 'שגיאה בעדכון הפרטים. נסי שוב.') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>טוען פרטי פרופיל...</div>;
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #cfdbea',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#2a3b52',
    marginBottom: '6px',
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <InfoCard title={isOwner ? 'עדכון פרטי בעל חניה 🏠' : 'עדכון פרטי משתמש 👤'}>
        {/* noValidate: במקום הבועות של הדפדפן, מופיעות ההודעות שלנו מתחת לשדות */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
          <div>
            <label style={labelStyle}>אימייל (לא ניתן לשינוי)</label>
            <input
              type="email"
              value={email}
              disabled
              style={{ ...inputStyle, background: '#eef4fb', color: '#5a6b82', cursor: 'not-allowed' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label htmlFor="prof-first" style={labelStyle}>שם פרטי</label>
              <input
                id="prof-first"
                type="text"
                required
                minLength={2}
                maxLength={50}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />
              <FieldMessage error={firstNameError} show={showErrors} />
            </div>

            <div>
              <label htmlFor="prof-last" style={labelStyle}>שם משפחה</label>
              <input
                id="prof-last"
                type="text"
                required
                minLength={2}
                maxLength={50}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
              />
              <FieldMessage error={lastNameError} show={showErrors} />
            </div>
          </div>

          <div>
            <label htmlFor="prof-phone" style={labelStyle}>טלפון</label>
            <input
              id="prof-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
            {/* בזמן ההקלדה: כמה ספרות חסרות */}
            <FieldMessage
              error={phoneError}
              show={showErrors}
              hint={phone === '' ? 'מספר נייד, 10 ספרות' : phoneError ?? '✓ מספר תקין'}
            />
          </div>

          {isOwner ? (
            <div>
              <label htmlFor="prof-bank" style={labelStyle}>פרטי חשבון בנק (לקבלת תשלומים)</label>
              <input
                id="prof-bank"
                type="text"
                required
                maxLength={100}
                placeholder="לדוגמה: בנק לאומי (10), סניף 800, חשבון 123456"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                style={inputStyle}
              />
              <FieldMessage error={bankError} show={showErrors} />
            </div>
          ) : (
            <div>
              <label htmlFor="prof-plate" style={labelStyle}>לוחית רישוי ברירת מחדל</label>
              <input
                id="prof-plate"
                type="text"
                placeholder="לדוגמה: 12-345-67"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                style={inputStyle}
              />
              <FieldMessage
                error={plateError}
                show={showErrors}
                hint={plate.trim() === '' ? 'לא חובה. 7 או 8 ספרות' : plateError ?? '✓ מספר תקין'}
              />
            </div>
          )}

          {feedback !== null && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                background: feedback.type === 'ok' ? '#ecfdf5' : '#fef2f2',
                color: feedback.type === 'ok' ? '#059669' : '#dc2626',
                border: `1px solid ${feedback.type === 'ok' ? '#a7f3d0' : '#fecaca'}`,
                whiteSpace: 'pre-line', // כמה הודעות מהשרת - כל אחת בשורה
              }}
            >
              {feedback.text}
            </div>
          )}

          <div style={{ marginTop: '4px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: saving ? 'not-allowed' : 'pointer',
                background: '#0a6cf0',
                color: 'white',
              }}
            >
              {saving ? 'שומר שינויים...' : 'שמירת פרטים'}
            </button>
          </div>
        </form>
      </InfoCard>
    </div>
  );
}

export default ProfileScreen;