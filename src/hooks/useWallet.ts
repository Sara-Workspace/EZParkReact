import { useEffect, useState } from 'react';
import { apiFetch, getErrorMessage } from '../api/api';
import { useAppDispatch } from '../store/hooks';
import { refreshPoints } from '../store/user/userThunks';
import type { Wallet } from '../types';
import { formatMoney } from '../utils/money';

// הוק משלנו: כל הקריאות לשרת של הארנק (api/Wallet) נמצאות כאן.
// המסך רק מציג ולוחץ על כפתורים.
export function useWallet() {
  const dispatch = useAppDispatch();
  const [wallet, setWallet] = useState<Wallet | null>(null);  // היתרה + התנועות
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // הודעת הצלחה
  const [redirecting, setRedirecting] = useState<boolean>(false); // עוברים עכשיו ל-PayPal

  async function loadWallet() {
    try {
      setWallet(await apiFetch<Wallet>('/Wallet/me'));
    } catch (err) {
      setError(getErrorMessage(err, 'טעינת הארנק נכשלה.'));
    } finally {
      setLoading(false);
    }
  }

  // טוענים פעם אחת כשהמסך נפתח
  useEffect(() => {
    loadWallet();
  }, []);

  // אחרי כל שינוי ביתרה: מעדכנים גם את היתרה שבתפריט העליון
  function applyWallet(updated: Wallet, successText: string) {
    setWallet(updated);
    setMessage(successText);
    setError(null);
    dispatch(refreshPoints());
  }

  // ===== טעינה, שלב 1: השרת פותח הזמנה ב-PayPal, והדפדפן עובר לדף התשלום של PayPal =====
  async function startTopUp(amount: number) {
    setError(null);
    setMessage(null);
    setRedirecting(true);
    try {
      const order = await apiFetch<{ orderId: string; approveUrl: string }>('/Wallet/topup/create', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      // עוברים לאתר של PayPal. אחרי התשלום PayPal מחזיר אותנו ל-/wallet?paypal=return&token=...
      window.location.href = order.approveUrl;
    } catch (err) {
      setError(getErrorMessage(err, 'לא הצלחנו לפתוח את התשלום ב-PayPal.'));
      setRedirecting(false);
    }
  }

  // ===== טעינה, שלב 2: חזרנו מ-PayPal. השרת בודק מול PayPal שבאמת שולם, ומוסיף ליתרה =====
  // orderId = מה ש-PayPal שם בכתובת (token=...)
  async function finishTopUp(orderId: string) {
    setError(null);
    try {
      const updated = await apiFetch<Wallet>('/Wallet/topup/capture', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      });
      applyWallet(updated, `הארנק נטען בהצלחה ✅ היתרה עכשיו: ${formatMoney(updated.balance)}`);
    } catch (err) {
      setError(getErrorMessage(err, 'התשלום לא הושלם. נסי שוב.'));
    }
  }

  // ===== משיכה (בעל חניה) =====
  async function withdraw(amount: number) {
    setError(null);
    setMessage(null);
    try {
      const updated = await apiFetch<Wallet>('/Wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      applyWallet(updated, `משכת ${formatMoney(amount)} ✅`);
    } catch (err) {
      setError(getErrorMessage(err, 'המשיכה נכשלה.'));
    }
  }

  return { wallet, loading, error, message, redirecting, setError, setMessage, startTopUp, finishTopUp, withdraw };
}
