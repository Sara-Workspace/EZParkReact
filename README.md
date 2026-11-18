# EZPark – צד לקוח (React + TypeScript)

ממשק המשתמש של EZPark, אתר שיתופי להשכרת חניות פרטיות. הלקוח מדבר עם שרת ה-.NET: <https://github.com/Sara-Workspace/EZPark>

## טכנולוגיות
React 19 · TypeScript · Vite · Redux Toolkit · React Router 7 · Leaflet (מפות OpenStreetMap)

## דרישות
- Node.js 20 ומעלה
- שרת ה-EZPark רץ (ראו README של השרת)

## הרצה
```bash
npm install
npm run dev
```
האתר נפתח ב-`http://localhost:5173` (הכתובת שהשרת מאפשר ב-CORS).

### משתני סביבה
אין סודות בצד הלקוח. אפשר לשנות רק את כתובת השרת, בקובץ `.env.local` (מתעלמים ממנו ב-Git):
```
VITE_API_URL=https://localhost:7036/api
```
אם לא מוגדר, ברירת המחדל היא `https://localhost:7036/api`. לפריסה, `.env.production` מכיל את כתובת השרת המפורסם (כתובת ציבורית, לא סוד).

### סקריפטים
| פקודה | מה עושה |
|---|---|
| `npm run dev` | שרת פיתוח |
| `npm run build` | בדיקת טיפוסים ובנייה ל-`dist` |
| `npm run lint` | בדיקת ESLint |

## מבנה הפרויקט (`src`)
| תיקייה | תפקיד |
|---|---|
| `components/` | המסכים והרכיבים (התחברות, חיפוש + מפה, חניה פעילה, ארנק, ניהול, צ'אט) |
| `store/` | Redux Toolkit: `user`, `parkings`, `search`, `session`, `chat`. כל slice מפוצל ל-State / Reducers / Thunks / Slice |
| `hooks/` | Hooks משלנו: `useMyLocation`, `useVoiceInput`, `useChat`, `useWallet`, `useSpotHours`, `useSpotCheck` |
| `api/` | `apiFetch` (טוקן, שגיאות אחידות, טיפול ב-401), הזרמת צ'אט, Geocoding |
| `utils/` | ולידציה, פורמט כסף, המרת זמן |
| `types/` | ממשקי TypeScript לתשובות השרת |

## ניווט
`Layout` אחד לכל המסכים (תפריט עליון, צ'אט AI), `ProtectedRoute` למשתמש מחובר, `AdminRoute` למנהל, ונתיב 404.

## זרימת הבקשות
1. קומפוננטה שולחת action (`dispatch`) ← **thunk** קורא ל-`apiFetch` ← השרת.
2. ה-slice מעדכן את ה-Store לפי `pending / fulfilled / rejected`.
3. הקומפוננטה קוראת מה-Store עם `useAppSelector`.

קריאות שמשותפות לכמה מסכים (התחברות, הרשמה, שמירת חניה, "חניתי", סיום חניה, דירוג, לוחית רישוי) עוברות דרך thunks. פעולות שקשורות למסך אחד (ארנק, שעות זמינות, בדיקת חניה) עטופות ב-Custom Hooks.

## אבטחה
- הטוקן נשמר ב-`localStorage` ונשלח ב-`Authorization: Bearer`.
- הסתרת מסכים (`AdminRoute`) היא לשיפור חוויה בלבד. ההרשאות נאכפות בשרת.
- אין מפתחות או `node_modules` ב-GitHub (`.gitignore`).

## פריסה
קובץ `.github/workflows/main.yml` בונה ומפרסם אוטומטית לשרת האירוח (IIS), ופרטי ההתחברות שלו שמורים ב-GitHub Secrets. `public/web.config` מגדיר ניתוב של אפליקציית SPA.