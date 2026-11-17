import { useState } from 'react';
import { apiFetch } from '../api/api';
import type { SpotCheckResult } from '../types';

// הוק משלנו: כל הקריאות לשרת של "בדיקת חניה" (api/SpotChecks) נמצאות כאן.
// הקומפוננטות (בעל חניה / מנהל) לא שולחות בקשות בעצמן, הן רק קוראות להוק ומציגות את מה שהוא מחזיר.
// spotId   = על איזו חניה עובדים
// onChecked = מה לעשות אחרי בדיקה מוצלחת (לרענן את רשימת החניות, כי הבדיקה יכולה להפוך חניה ללא זמינה)
export function useSpotCheck(spotId: number, onChecked: () => void) {
  const [loading, setLoading] = useState(false);                          // האם בקשה בדרך (בשביל "בודק...")
  const [result, setResult] = useState<SpotCheckResult | null>(null);     // התוצאה של הבדיקה מהשרת
  const [message, setMessage] = useState<string | null>(null);            // הודעת הצלחה (אחרי העלאת תמונת מצלמה)
  const [error, setError] = useState<string | null>(null);                // הודעת שגיאה

  // אורזת את התמונה ב"טופס" (FormData), כי השרת מקבל אותה עם [FromForm] בשדה בשם Image
  function createImageForm(image: File) {
    const formData = new FormData();
    formData.append('Image', image);
    return formData;
  }

  // 🏠 בעל חניה: שולח תמונה, והשרת מיד בודק אותה (שלב אחד)
  async function ownerCheck(image: File) {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = await apiFetch<SpotCheckResult>(`/SpotChecks/${spotId}/owner-check`, {
        method: 'POST',
        body: createImageForm(image),
      });
      setResult(data);
      onChecked();
    } catch {
      setError('הבדיקה נכשלה. ודאי שבתמונה רואים את לוחית הרישוי.');
    } finally {
      setLoading(false); // קורה תמיד, גם אחרי הצלחה וגם אחרי שגיאה
    }
  }

  // 👑📷 מנהל, שלב 1: "המצלמה מצלמת". רק שומר את התמונה בשרת, בלי בדיקה ובלי קנס
  async function uploadCamera(image: File) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      await apiFetch<void>(`/SpotChecks/${spotId}/camera`, {
        method: 'PUT', // PUT כי זה מחליף את התמונה הקודמת של אותה חניה
        body: createImageForm(image),
      });
      setMessage('תמונת המצלמה נשמרה 📷');
    } catch {
      setError('העלאת התמונה נכשלה.');
    } finally {
      setLoading(false);
    }
  }

  // 👑🔍 מנהל, שלב 2: "הפקח בודק". השרת לוקח את תמונת המצלמה השמורה, וה-AI קורא את הלוחית
  async function adminCheck() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = await apiFetch<SpotCheckResult>(`/SpotChecks/${spotId}/admin-check`, {
        method: 'POST', // בלי body: התמונה כבר נמצאת בשרת
      });
      setResult(data);
      onChecked();
    } catch {
      setError('הבדיקה נכשלה. ודאי שהועלתה תמונת מצלמה לחניה ושרואים בה לוחית רישוי.');
    } finally {
      setLoading(false);
    }
  }

  // 🚗 נהג: הגיע לחניה והיא תפוסה. השרת לוקח את תמונת המצלמה השמורה, וה-AI בודק של מי הרכב.
  // מחזירה את התוצאה, או null אם הבדיקה לא הצליחה (למשל אין מצלמה בחניה)
  async function reportOccupied(): Promise<SpotCheckResult | null> {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = await apiFetch<SpotCheckResult>(`/SpotChecks/${spotId}/occupied`, {
        method: 'POST', // בלי body: התמונה נלקחת מהמצלמה של החניה
      });
      setResult(data);
      onChecked();
      return data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }

  // מה שההוק נותן לקומפוננטה: הערכים להצגה + הפעולות ללחיצה על כפתורים
  return { loading, result, message, error, ownerCheck, uploadCamera, adminCheck, reportOccupied };
}