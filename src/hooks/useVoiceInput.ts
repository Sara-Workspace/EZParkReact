import { useState } from 'react';

// 🎤 הוק משלנו: "מדברים במקום לכתוב"
// הדפדפן (Chrome / Edge) יודע להפוך דיבור לטקסט בעצמו (Web Speech API),
// בדיוק כמו שהוא יודע למצוא מיקום ב-useMyLocation.
// הדפדפן שואל את המשתמש אם מותר להשתמש במיקרופון, מקשיב עד שיש הפסקה בדיבור,
// ומחזיר את מה שנאמר כטקסט. השרת לא משתנה: הבוט ממשיך לקבל טקסט רגיל.
export function useVoiceInput() {
  // useState: רק המסך שמשתמש בהוק צריך לדעת את זה
  const [listening, setListening] = useState<boolean>(false); // מקשיבים כרגע?
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // מתחילים להקשיב.
  // onText = מה לעשות עם הטקסט שזוהה (המסך מחליט, למשל לשים אותו בתיבת הכתיבה)
  function startListening(onText: (text: string) => void) {
    // ב-Chrome ו-Edge הכלי נקרא webkitSpeechRecognition, ובדפדפנים אחרים SpeechRecognition.
    // any: ל-TypeScript אין עדיין הגדרה מוכנה לכלי הזה
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // דפדפן שלא יודע לזהות דיבור (למשל Firefox)
    if (!SpeechRecognition) {
      setVoiceError('הדפדפן הזה לא תומך בהקלטה. נסו ב-Chrome, או כתבו את ההודעה.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'he-IL'; // מזהים עברית
    recognition.interimResults = false; // רוצים רק את התוצאה הסופית
    recognition.maxAlternatives = 1; // מספיקה לנו האפשרות הכי טובה

    // ✅ זוהה טקסט: מעבירים אותו למסך
    recognition.onresult = (event: any) => {
      const text: string = event.results[0][0].transcript;
      onText(text);
    };

    // ❌ משהו נכשל: הודעה ברורה לפי סוג השגיאה
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceError('לא אישרת גישה למיקרופון. אפשר לאשר בסמל המנעול ליד הכתובת בדפדפן, או לכתוב את ההודעה.');
      } else if (event.error === 'no-speech') {
        setVoiceError('לא שמעתי כלום. לחצו על 🎤 ודברו מיד אחרי זה.');
      } else if (event.error === 'audio-capture') {
        setVoiceError('לא נמצא מיקרופון במחשב. חברו מיקרופון או כתבו את ההודעה.');
      } else if (event.error === 'network') {
        setVoiceError('אין חיבור לשירות זיהוי הדיבור. בדקו את האינטרנט, או כתבו את ההודעה.');
      } else {
        setVoiceError('לא הצלחנו להקליט. נסו שוב או כתבו את ההודעה.');
      }
    };

    // ההקלטה הסתיימה (הצליחה או נכשלה): מפסיקים להציג "מקשיב"
    recognition.onend = () => {
      setListening(false);
    };

    setListening(true);
    setVoiceError(null);
    recognition.start();
  }

  return { listening, voiceError, startListening };
}
