import { useEffect, useState } from 'react';
import { apiFetch, getErrorMessage } from '../api/api';
import type { SpotHours } from '../types';

// הוק משלנו: שעות הזמינות של חניה אחת (api/SpotAvailability).
// הקומפוננטה רק מציגה וקוראת לפונקציות, וכל הקריאות לשרת נמצאות כאן.
export function useSpotHours(spotId: number) {
  const [hours, setHours] = useState<SpotHours[]>([]);       // כל חלונות הזמינות של החניה
  const [loading, setLoading] = useState<boolean>(false);     // בקשה בדרך?
  const [error, setError] = useState<string | null>(null);

  // טעינת השעות מהשרת
  async function loadHours() {
    try {
      const data = await apiFetch<SpotHours[]>(`/SpotAvailability/spot/${spotId}`);
      setHours(data);
    } catch (err) {
      setError(getErrorMessage(err, 'טעינת שעות הזמינות נכשלה.'));
    }
  }

  // טוענים פעם אחת כשהמסך נפתח (ושוב אם החניה השתנתה)
  useEffect(() => {
    loadHours();
  }, [spotId]);

  // הוספת שעות לכמה ימים בבת אחת (למשל ראשון עד חמישי, 08:00 עד 16:00).
  // days = מספרי הימים שנבחרו, start/end = "08:00" (כמו שמגיע מתיבת שעה)
  async function addHours(days: number[], start: string, end: string) {
    setError(null);

    // בדיקות פשוטות לפני ששולחים לשרת (השרת בודק שוב בכל מקרה)
    if (days.length === 0) {
      setError('בחרי לפחות יום אחד.');
      return;
    }
    if (start === '' || end === '' || end <= start) {
      setError('שעת הסיום חייבת להיות אחרי שעת ההתחלה.');
      return;
    }

    setLoading(true);
    try {
      // שורה אחת לכל יום שנבחר. השרת מצפה לשעה בפורמט "08:00:00", לכן מוסיפים ":00"
      for (const day of days) {
        await apiFetch<SpotHours>('/SpotAvailability', {
          method: 'POST',
          body: JSON.stringify({
            spotID: spotId,
            dayOfWeek: day,
            startTime: `${start}:00`,
            endTime: `${end}:00`,
          }),
        });
      }
    } catch (err) {
      // למשל: "השעות האלה חופפות לשעות שכבר הוגדרו לאותו יום."
      setError(getErrorMessage(err, 'השמירה נכשלה. נסי שוב.'));
    } finally {
      await loadHours(); // מרעננים, כדי לראות בדיוק מה נשמר
      setLoading(false);
    }
  }

  // מחיקת חלון זמינות אחד
  async function removeHours(availabilityId: number) {
    setLoading(true);
    setError(null);
    try {
      await apiFetch<void>(`/SpotAvailability/${availabilityId}`, { method: 'DELETE' });
      await loadHours();
    } catch (err) {
      setError(getErrorMessage(err, 'המחיקה נכשלה.'));
    } finally {
      setLoading(false);
    }
  }

  return { hours, loading, error, addHours, removeHours };
}
