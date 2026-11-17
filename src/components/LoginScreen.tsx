import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api'; // התאימי לנתיב המדויק של api.ts אצלך (כמו ב-AdminDashboard)
import Button from './Button';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/user/userSlice';

interface AuthResponse {
  token?: string;
  role?: 'Admin' | 'Owner' | 'Driver';
  isAdmin?: boolean;
  userId?: number;
  user?: {
    userId?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    points?: number;
    licensePlate?: string | null;
  };
}

function LoginScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerRole, setRegisterRole] = useState<'Driver' | 'Owner'>('Driver');

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
  };

  const saveAuthAndNavigate = (data: AuthResponse, fallbackEmail: string) => {
    if (!data.token) return false;

    const resolvedRole = data.role ?? registerRole;
    const isAdminUser = Boolean(data.isAdmin || resolvedRole === 'Admin');
    const resolvedUserId = data.user?.userId ?? data.userId;
    const resolvedEmail = data.user?.email ?? fallbackEmail;

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', resolvedRole);
    localStorage.setItem('isAdmin', JSON.stringify(isAdminUser));
    localStorage.setItem('userEmail', resolvedEmail);

    if (resolvedUserId !== undefined) {
      localStorage.setItem('userId', resolvedUserId.toString());
    }

    // שמירת פרטי המשתמש ב-Store המרכזי, כדי שכל המסכים יוכלו להציג אותם
    dispatch(
      setUser({
        userId: resolvedUserId ?? null,
        role: resolvedRole,
        firstName: data.user?.firstName ?? '',
        lastName: data.user?.lastName ?? '',
        points: data.user?.points ?? 0,
        licensePlate: data.user?.licensePlate ?? null,
      })
    );

    if (isAdminUser) {
      navigate('/admin');
    } else if (resolvedRole === 'Owner') {
      navigate('/dashboard');
    } else {
      navigate('/home')
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') return;
    if (mode !== 'login' && password.length < 8) {
      setError('הסיסמה חייבת להכיל לפחות 8 תווים.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        const data = await apiFetch<AuthResponse>('/Auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        saveAuthAndNavigate(data, email);
      } else {
        const endpoint = registerRole === 'Driver' ? '/Drivers' : '/Owners';

        const payload =
          registerRole === 'Driver'
            ? {
                firstName,
                lastName,
                email,
                phone,
                passwordHash: password,
              }
            : {
                firstName,
                lastName,
                email,
                phone,
                bankDetails,
                passwordHash: password,
              };

        const data = await apiFetch<AuthResponse>(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        const loggedInImmediately = saveAuthAndNavigate(data, email);
        if (!loggedInImmediately) {
          setMode('login');
          setSuccessMsg('המשתמש נוצר בהצלחה! כעת ניתן להתחבר עם האימייל והסיסמה.');
        }
      }
    } catch {
      setError(
        mode === 'login'
          ? 'אימייל או סיסמה שגויים'
          : 'יצירת המשתמש נכשלה. ודא שהאימייל לא רשום כבר במערכת ושכל הפרטים תקינים.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #cfdbea',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '4px',
  };

  return (
    <div style={{ maxWidth: '460px', margin: '48px auto', padding: '0 16px' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid #dfe8f3',
          boxShadow: '0 10px 25px rgba(10, 37, 64, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: '#0a6cf0',
              borderRadius: '16px',
              margin: '0 auto 12px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
            }}
          >
            🅿️
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0a2540', margin: '0 0 4px 0' }}>
            חניה בקליק • פארקי
          </h2>
          <p style={{ fontSize: '12px', color: '#5a6b82', margin: 0 }}>
            {mode === 'login' ? 'יש להתחבר למערכת כדי להמשיך' : 'יצירת חשבון חדש במערכת'}
          </p>
        </div>

        {/* מעבר בין התחברות להרשמה */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#eef4fb',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              background: mode === 'login' ? 'white' : 'transparent',
              color: mode === 'login' ? '#0a6cf0' : '#5a6b82',
            }}
          >
            התחברות
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              background: mode === 'register' ? 'white' : 'transparent',
              color: mode === 'register' ? '#0a6cf0' : '#5a6b82',
            }}
          >
            הרשמת משתמש חדש
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRegisterRole('Driver')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '12px',
                    border: registerRole === 'Driver' ? '2px solid #0a6cf0' : '1px solid #cfdbea',
                    background: registerRole === 'Driver' ? '#eaf3ff' : 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🚗 נהג חדש
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('Owner')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '12px',
                    border: registerRole === 'Owner' ? '2px solid #059669' : '1px solid #cfdbea',
                    background: registerRole === 'Owner' ? '#ecfdf5' : 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🅿️ בעל חניה חדש
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label htmlFor="reg-first" style={labelStyle}>שם פרטי</label>
                  <input
                    id="reg-first"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    placeholder="שרה"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="reg-last" style={labelStyle}>שם משפחה</label>
                  <input
                    id="reg-last"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    placeholder="כהן"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-phone" style={labelStyle}>טלפון</label>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  placeholder="050-0000000"
                  style={inputStyle}
                />
              </div>

              {registerRole === 'Owner' && (
                <div>
                  <label htmlFor="reg-bank" style={labelStyle}>פרטי חשבון בנק להעברות</label>
                  <input
                    id="reg-bank"
                    type="text"
                    required
                    value={bankDetails}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBankDetails(e.target.value)}
                    placeholder="בנק הפועלים, סניף 123, חשבון 456789"
                    style={inputStyle}
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label htmlFor="auth-email" style={labelStyle}>דוא"ל</label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="auth-password" style={labelStyle}>סיסמה</label>
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
             {mode !== 'login' && (
              <span style={{ display: 'block', fontSize: '11px', color: '#5a6b82', marginTop: '4px' }}>
                הסיסמה חייבת להכיל לפחות 8 תווים
              </span>
            )}
          </div>

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

          {successMsg !== null && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#059669',
                padding: '10px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {successMsg}
            </div>
          )}

          <Button
            label={
              loading
                ? 'מעבד נתונים...'
                : mode === 'login'
                  ? 'התחבר למערכת'
                  : 'צור חשבון חדש'
            }
            background={mode === 'login' ? '#0a6cf0' : '#059669'}
            color="white"
            fullWidth={true}
          />
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;