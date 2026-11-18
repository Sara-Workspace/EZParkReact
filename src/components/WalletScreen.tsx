import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useWallet } from '../hooks/useWallet';
import { formatMoney } from '../utils/money';
import FieldMessage from './FieldMessage';
import ErrorBox from './ErrorBox';

// סכומי טעינה מהירים
const QUICK_AMOUNTS = [20, 50, 100, 200];

// שמות התנועות בעברית
const TYPE_LABELS: Record<string, string> = {
  TopUp: 'טעינה',
  Parking: 'חניה',
  Earning: 'הכנסה מחניה',
  Fine: 'קנס',
  Withdrawal: 'משיכה',
};

// הזמנות PayPal שכבר טיפלנו בהן. בזמן פיתוח React מריץ useEffect פעמיים (StrictMode),
// וככה לא שולחים לשרת את אותו תשלום פעמיים
const handledOrders = new Set<string>();

// "2026-11-18T08:30:00Z" -> "18.11 · 10:30"
function formatDate(value: string): string {
  const date = new Date(value.endsWith('Z') ? value : `${value}Z`);
  return `${date.getDate()}.${date.getMonth() + 1} · ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 👛 מסך הארנק: היתרה, טעינה ב-PayPal, משיכה (לבעל חניה) והתנועות האחרונות
function WalletScreen() {
  const role = useAppSelector((state) => state.user.role);
  const { wallet, loading, error, message, redirecting, setError, startTopUp, finishTopUp, withdraw } = useWallet();

  // כשחוזרים מ-PayPal הכתובת נראית כך: /wallet?paypal=return&token=<מספר ההזמנה>
  const [searchParams, setSearchParams] = useSearchParams();

  // useState: הטפסים שייכים רק למסך הזה
  const [amountInput, setAmountInput] = useState<string>('50');
  const [withdrawInput, setWithdrawInput] = useState<string>('');

  // בדיקת הסכום לטעינה (כמו בשרת: בין 10 ל-1,000)
  const amount = Number(amountInput);
  const amountError =
    amountInput.trim() === '' || Number.isNaN(amount)
      ? 'כתבי סכום במספרים.'
      : amount < 10
        ? 'הסכום המינימלי לטעינה הוא 10 ₪.'
        : amount > 1000
          ? 'הסכום המקסימלי לטעינה הוא 1,000 ₪.'
          : null;

  // חזרנו מ-PayPal: מבקשים מהשרת להשלים את הטעינה, ומנקים את הכתובת
  useEffect(() => {
    const status = searchParams.get('paypal');
    const orderId = searchParams.get('token');

    if (status === 'return' && orderId !== null && !handledOrders.has(orderId)) {
      handledOrders.add(orderId);
      finishTopUp(orderId);
    }
    if (status === 'cancel') {
      setError('ביטלת את התשלום ב-PayPal. לא ירד ממך כסף.');
    }
    if (status !== null) {
      setSearchParams({}); // מנקים את הכתובת, כדי שרענון הדף לא ינסה שוב
    }
  }, []);

  function handleTopUp() {
    if (amountError !== null) return;
    startTopUp(amount);
  }

  function handleWithdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = Number(withdrawInput);
    if (Number.isNaN(value) || value < 1) return;
    withdraw(value);
    setWithdrawInput('');
  }

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>טוען את הארנק...</div>;
  }

  const balance = wallet?.balance ?? 0;
  const cardStyle = { background: 'white', border: '1px solid #dfe8f3', borderRadius: '20px', padding: '20px' };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* היתרה */}
      <div style={{ background: '#0a2540', color: 'white', borderRadius: '24px', padding: '24px' }}>
        <div style={{ fontSize: '14px', color: '#b3d2ff' }}>היתרה בארנק</div>
        <div style={{ fontSize: '40px', fontWeight: 900, color: balance < 0 ? '#fca5a5' : 'white' }}>{formatMoney(balance)}</div>
        {balance <= 0 && (
          <div style={{ fontSize: '14px', color: '#fde68a', fontWeight: 700 }}>
            כדי לחנות צריך יתרה חיובית. טעני את הארנק 👇
          </div>
        )}
      </div>

      {message !== null && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '10px 12px', borderRadius: '12px', fontWeight: 700 }}>
          {message}
        </div>
      )}
      <ErrorBox message={error} />

      {/* טעינה ב-PayPal */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#0a2540' }}>💳 טעינת הארנק</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmountInput(String(value))}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: amount === value ? 'none' : '1px solid #cfdbea',
                background: amount === value ? '#0a6cf0' : 'white',
                color: amount === value ? 'white' : '#0a2540',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {value} ₪
            </button>
          ))}
        </div>
        <label htmlFor="topup-amount" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
          או סכום אחר (₪)
        </label>
        <input
          id="topup-amount"
          type="number"
          min={10}
          max={1000}
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          style={{ width: '140px', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cfdbea' }}
        />
        <FieldMessage error={amountError} show={true} hint="בין 10 ל-1,000 ₪" />

        {/* מעבר לדף התשלום של PayPal, ואחרי התשלום חוזרים לכאן */}
        <button
          type="button"
          onClick={handleTopUp}
          disabled={amountError !== null || redirecting}
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '14px',
            borderRadius: '999px',
            border: 'none',
            background: amountError !== null || redirecting ? '#8fa1b8' : '#ffc439',
            color: '#0a2540',
            fontWeight: 800,
            fontSize: '16px',
            cursor: amountError !== null ? 'not-allowed' : redirecting ? 'wait' : 'pointer',
          }}
        >
          {redirecting ? 'עוברים ל-PayPal...' : `טעינת ${amountError === null ? formatMoney(amount) : ''} עם PayPal`}
        </button>
        <p style={{ fontSize: '12px', color: '#5a6b82', margin: '8px 0 0 0' }}>
          תעברי לדף של PayPal, תשלמי, ותחזרי לכאן אוטומטית. סביבת בדיקות (Sandbox): משלמים עם חשבון הבדיקה, ולא יורד כסף אמיתי.
        </p>
      </div>

      {/* משיכה: רק לבעל חניה */}
      {role === 'Owner' && (
        <form onSubmit={handleWithdraw} style={cardStyle}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0a2540' }}>🏦 משיכת כסף</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#5a6b82' }}>
            על כל חניה אצלך נכנסים לארנק 90% מהמחיר. אפשר למשוך אותם לחשבון שלך.
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label htmlFor="withdraw-amount" style={{ fontSize: '13px', fontWeight: 700 }}>סכום (₪)</label>
            <input
              id="withdraw-amount"
              type="number"
              min={1}
              value={withdrawInput}
              onChange={(e) => setWithdrawInput(e.target.value)}
              style={{ width: '120px', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cfdbea' }}
            />
            <button
              type="submit"
              disabled={withdrawInput === '' || Number(withdrawInput) < 1}
              style={{ padding: '8px 18px', borderRadius: '999px', border: 'none', background: '#0a2540', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              משיכה
            </button>
          </div>
        </form>
      )}

      {/* התנועות האחרונות */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#0a2540' }}>📒 תנועות אחרונות</h3>
        {wallet === null || wallet.transactions.length === 0 ? (
          <p style={{ margin: 0, fontSize: '14px', color: '#5a6b82' }}>עדיין אין תנועות.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {wallet.transactions.map((t, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef4fb', paddingBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{TYPE_LABELS[t.type] ?? t.type}</div>
                  <div style={{ fontSize: '12px', color: '#5a6b82' }}>{t.description} · {formatDate(t.createdAt)}</div>
                </div>
                <div style={{ fontWeight: 800, color: t.amount >= 0 ? '#059669' : '#dc2626' }}>
                  {t.amount >= 0 ? '+' : ''}{formatMoney(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletScreen;
