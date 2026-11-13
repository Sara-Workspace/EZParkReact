const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7036/api';

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // בדיקת תקינות התשובה (כפי שנלמד: fetch לא זורק שגיאה על 404 או 500)
 if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(`Server error: ${response.status}`);
  }

  // טיפול בתשובות ריקות (כמו 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}