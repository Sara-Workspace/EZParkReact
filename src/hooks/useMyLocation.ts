import { useState } from 'react';

// המיקום שהדפדפן מצא
export interface MyLocation {
  latitude: number;
  longitude: number;
}

// 📍 הוק משלנו: "איפה אני עכשיו?"
// הדפדפן (navigator.geolocation) שואל את המשתמש אם מותר לדעת את המיקום,
// ואם כן, מחזיר קו רוחב וקו אורך (latitude / longitude).
// במחשב המיקום מגיע לפי רשת ה-WiFi (פחות מדויק), ובטלפון לפי ה-GPS (מדויק).
export function useMyLocation() {
  // useState: רק המסך שמשתמש בהוק צריך לדעת את זה
  const [locating, setLocating] = useState<boolean>(false); // מחפשים מיקום כרגע?
  const [locationError, setLocationError] = useState<string | null>(null);

  // מבקשים מהדפדפן את המיקום.
  // onFound = מה לעשות כשהמיקום נמצא (המסך מחליט, למשל לחפש חניות סביבו)
  function findMyLocation(onFound: (location: MyLocation) => void) {
    // דפדפן ישן מאוד שלא יודע למצוא מיקום
    if (!navigator.geolocation) {
      setLocationError('הדפדפן הזה לא תומך באיתור מיקום. הקלידי כתובת.');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      // ✅ הצליח: מעבירים למסך את המיקום
      (position) => {
        setLocating(false);
        onFound({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      // ❌ נכשל: המשתמש סירב, או שלא הצלחנו למצוא מיקום
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('לא אישרת גישה למיקום. אפשר לאשר בסמל המנעול ליד הכתובת בדפדפן, או להקליד כתובת.');
        } else {
          setLocationError('לא הצלחנו למצוא את המיקום שלך. נסי שוב או הקלידי כתובת.');
        }
      },
      // מחכים עד 10 שניות, ומבקשים מיקום מדויק ככל האפשר
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return { locating, locationError, findMyLocation };
}