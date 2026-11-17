// חניה שה-AI מצא (מגיעה מהשרת בסוף התשובה), בשביל כפתור "לפרטי החניה"
export interface ChatSpot {
  id: number;
  address: string;
  city: string;
  distanceKm: number;
  pricePerHour: number;
  evCharger: boolean;
}

// הודעה אחת בצ'אט
export interface ChatMessage {
  id: number;                    // מזהה ייחודי, בשביל ה-key ברשימה
  role: 'user' | 'assistant';    // מי כתב: user = המשתמש, assistant = עוזר ה-AI
  text: string;                  // תוכן ההודעה
  spots?: ChatSpot[];            // רק בהודעות של ה-AI: החניות שנמצאו (אם חיפש)
}

// מה נשמר ב-Store על הצ'אט
export interface ChatState {
  messages: ChatMessage[];  // כל השיחה, לפי הסדר
  loading: boolean;         // האם ה-AI עונה עכשיו
  error: string | null;     // הודעת שגיאה, או null כשאין
}

export const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};