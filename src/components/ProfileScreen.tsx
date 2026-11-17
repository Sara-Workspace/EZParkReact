import { useEffect, useState, type FormEvent } from 'react';
import { apiFetch } from '../api/api';
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
      } catch {
        setFeedback({
          type: 'err',
          text: 'לא ניתן היה לטעון את פרטי הפרופיל מהשרת.',
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

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setFeedback({ type: 'err', text: 'שם פרטי ושם משפחה חייבים להכיל לפחות 2 תווים.' });
      return;
    }

    if (phone.trim().length < 7) {
      setFeedback({ type: 'err', text: 'יש להזין מספר טלפון תקין.' });
      return;
    }

    if (isOwner && bankDetails.trim().length === 0) {
      setFeedback({ type: 'err', text: 'פרטי חשבון בנק הם שדה חובה לבעל חניה.' });
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
      const msg = (err as { message?: string }).message ?? 'שגיאה בעדכון הפרטים';
      setFeedback({ type: 'err', text: msg });
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
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