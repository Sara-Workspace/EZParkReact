const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7036/api';

// ===== שגיאה מהשרת =====
// במקום "Server error: 400" שומרים 2 דברים:
// status  = הקוד (400, 404, 409...), כדי שמסכים יוכלו להחליט מה לעשות (למשל 409 = החניה נתפסה)
// message = הודעה ברורה בעברית, בדרך כלל זו שהשרת עצמו כתב (למשל "כתובת המייל כבר רשומה במערכת.")
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// הודעה כללית לכל קוד, למקרה שהשרת לא שלח הודעה משלו
function defaultMessageFor(status: number): string {
  if (status === 0) return 'אין חיבור לשרת. ודאי שהשרת פועל ושיש חיבור לאינטרנט.';
  if (status === 400) return 'חלק מהפרטים לא תקינים. בדקי את השדות ונסי שוב.';
  if (status === 401) return 'צריך להתחבר מחדש.';
  if (status === 403) return 'אין לך הרשאה לבצע את הפעולה הזאת.';
  if (status === 404) return 'מה שחיפשת לא נמצא.';
  if (status === 409) return 'הפעולה מתנגשת עם מצב קיים (למשל: כבר תפוס או כבר רשום).';
  return 'אירעה שגיאה בשרת. נסי שוב בעוד רגע.';
}

// קריאת ההודעה מתוך תשובת השגיאה של השרת. השרת שולח אחד מ-3 מבנים:
// 1. { title: "..." }                       ← השומר (GlobalExceptionFilter) כשיש כלל עסקי
// 2. { errors: { Email: ["..."], ... } }     ← בדיקות ה-DTO ([Required], [EmailAddress]...)
// 3. { message: "..." }                     ← תשובות שהקונטרולר בונה בעצמו (למשל Conflict)
async function readServerMessage(response: Response): Promise<string | null> {
  try {
    const body = await response.json();

    // מבנה 2: כל ההודעות של כל השדות, בשורות נפרדות
    if (body.errors) {
      const messages: string[] = [];
      Object.values(body.errors).forEach((fieldMessages) => {
        (fieldMessages as string[]).forEach((m) => messages.push(m));
      });
      if (messages.length > 0) return messages.join('\n');
    }

    if (typeof body.message === 'string') return body.message; // מבנה 3
    if (typeof body.title === 'string') return body.title;     // מבנה 1
    return null;
  } catch {
    return null; // התשובה ריקה או לא JSON
  }
}

// פונקציית עזר למשלוח בקשות fetch עם הטוקן מ-localStorage
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  // בסיס הכותרות - אם יש טוקן בזיכרון, נצמיד Authorization: Bearer <token>
  const headers: Record<string, string> = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // אם לא מדובר בהעלאת קובץ (FormData), נוסיף Content-Type של JSON
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    // fetch זורק שגיאה רק כשאין תשובה בכלל: השרת כבוי, אין אינטרנט, או חסימת CORS
    throw new ApiError(0, defaultMessageFor(0));
  }

  // בדיקת תקינות התשובה (כפי שנלמד: fetch לא זורק שגיאה על 404 או 500)
  if (!response.ok) {
    // 401 עם טוקן = ההתחברות פגה, ושולחים להתחברות מחדש.
    // 401 בלי טוקן (למשל סיסמה שגויה במסך ההתחברות) - לא מעבירים דף, רק מציגים את ההודעה
    if (response.status === 401 && token) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    const serverMessage = await readServerMessage(response);
    // בשגיאה 500 לא מציגים פרטים פנימיים
    const message = response.status >= 500 || serverMessage === null
      ? defaultMessageFor(response.status)
      : serverMessage;

    throw new ApiError(response.status, message);
  }

  // טיפול בתשובות ריקות (כמו 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}

// הקוד של השגיאה (400, 409...), או 0 אם לא ידוע
export function getErrorStatus(err: unknown): number {
  return err instanceof ApiError ? err.status : 0;
}

// ההודעה הברורה לשגיאה, לשימוש ב-catch של כל מסך.
// עובד גם עם שגיאות שעברו דרך Redux (unwrap), שם השגיאה הופכת לאובייקט רגיל עם message.
// fallback = מה להציג אם אין הודעה בכלל
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message !== '') return err.message;

  const maybeMessage = (err as { message?: unknown } | null)?.message;
  if (typeof maybeMessage === 'string' && maybeMessage !== '') return maybeMessage;

  return fallback;
}
