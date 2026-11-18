import type { ChatSpot } from '../store/chat/chatState';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://ezpark.tryasp.net/api';

// מה שהשרת מצפה לקבל על כל הודעה (ChatMessageDTO בשרת)
interface ChatMessageForServer {
  role: 'user' | 'assistant';
  text: string;
}

// שולח את השיחה לשרת (POST /api/Chat/stream) וקורא את התשובה בחתיכות (הזרמה).
// על כל חתיכת טקסט שמגיעה קוראים ל-onChunk, וכך התשובה מופיעה על המסך מילה אחרי מילה.
// בסוף, אם ה-AI מצא חניות, השרת שולח אותן בהודעה נפרדת, ואז קוראים ל-onSpots.
// לא משתמשים כאן ב-apiFetch, כי הוא מחכה לתשובה שלמה (response.json()), ואנחנו רוצים לקרוא תוך כדי
export async function streamChat(
  messages: ChatMessageForServer[],
  onChunk: (text: string) => void,
  onSpots: (spots: ChatSpot[]) => void
): Promise<void> {
  // הטוקן (כרטיס הכניסה) מצורף כמו ב-apiFetch, כי הצ'אט בשרת מסומן [Authorize]
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Server error: ${response.status}`);
  }

  // reader = "צינור" שממנו קוראים את התשובה חתיכה אחרי חתיכה, בזמן שהיא עוד מגיעה
  const reader = response.body.getReader();
  const decoder = new TextDecoder(); // הופך בתים לטקסט (כולל עברית)
  let buffer = '';                   // כאן נאספות חתיכות שעוד לא הגיעו במלואן

  while (true) {
    const { done, value } = await reader.read();
    if (done) break; // השרת סיים לשלוח

    buffer += decoder.decode(value, { stream: true });

    // השרת שולח הודעות שכל אחת מסתיימת בשורה ריקה (\n\n), למשל:
    // data: {"text":"מצאתי"}
    // מוציאים מה-buffer כל הודעה שלמה, ומשאירים בו את מה שעוד לא הסתיים
    let end = buffer.indexOf('\n\n');
    while (end !== -1) {
      const message = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);

      // השרת הודיע על תקלה באמצע התשובה
      if (message.startsWith('event: error')) {
        throw new Error('התשובה נקטעה. נסו שוב.');
      }

      if (message.startsWith('data: ')) {
        const data = message.slice('data: '.length);

        if (data === '[DONE]') return; // "סיימתי"

        // JSON.parse הופך את הקודים המוזרים (שראינו ב-Swagger) בחזרה לעברית רגילה.
        // יש שני סוגי הודעות: { text: "..." } = חתיכת טקסט, { spots: [...] } = החניות שנמצאו
        const parsed = JSON.parse(data) as { text?: string; spots?: ChatSpot[] };
        if (parsed.text !== undefined) onChunk(parsed.text);
        if (parsed.spots !== undefined) onSpots(parsed.spots);
      }

      end = buffer.indexOf('\n\n');
    }
  }
}