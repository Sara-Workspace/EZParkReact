import React, { useState, FormEvent } from 'react';
import Button from './Button';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const API_BASE_URL = 'https://localhost:7036/api/Auth';

function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [role, setRole] = useState<'driver' | 'owner'>('driver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. שליחת בקשת POST להתחברות לפי תפקיד המשתמש
      const response = await fetch(`${API_BASE_URL}/${role}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('אימייל או סיסמה שגויים');
      }

      const data = await response.json();

      // 2. שמירת ה-JWT Token והתפקיד ב-localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userId', data.userId.toString());

      onLoginSuccess(email);
      onClose();
    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות לשרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        background: 'rgba(2, 6, 23, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          maxWidth: '448px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center' }}>התחברות למערכת</h2>

        {/* בחירת סוג משתמש */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={() => setRole('driver')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '12px',
              border: role === 'driver' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
              background: role === 'driver' ? '#eef2ff' : 'white',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🚗 נהג
          </button>
          <button
            type="button"
            onClick={() => setRole('owner')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '12px',
              border: role === 'owner' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
              background: role === 'owner' ? '#eef2ff' : 'white',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🅿️ בעל חניה
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>דוא"ל</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@parking.co.il"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>סיסמה</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '12px', margin: 0 }}>{error}</p>}

          <Button
            label={loading ? 'מתחבר...' : 'התחבר'}
            background="#4f46e5"
            color="white"
            fullWidth={true}
          />
        </form>

        <Button
          label="ביטול"
          onClick={onClose}
          background="#f1f5f9"
          color="#0f172a"
          fullWidth={true}
        />
      </div>
    </div>
  );
}

export default AuthModal;