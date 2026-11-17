// הודעה אחת בצ'אט
export interface ChatMessage {
  id: number;                    // מזהה ייחודי, בשביל ה-key ברשימה
  role: 'user' | 'assistant';    // מי כתב: user = המשתמש, assistant = עוזר ה-AI
  text: string;                  // תוכן ההודעה
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
