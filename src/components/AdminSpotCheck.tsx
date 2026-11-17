import React, { useState } from 'react';
import { useSpotCheck } from '../hooks/useSpotCheck';
import SpotCheckResultBox from './SpotCheckResultBox';

// 👑 מנהל: שורה אחת לכל חניה בלוח הניהול (AdminDashboard), עם שני כפתורים נפרדים:
// 📷 "העלאת תמונת מצלמה" = מדמה מצלמה: רק שומר את התמונה, בלי קנס
// 🔍 "בדיקה"              = מדמה פקח: בודק את התמונה השמורה, ויכול לתת קנס
// הם נפרדים כדי שאפשר יהיה להעלות תמונה מראש (למשל לפני ההצגה) בלי שהקנס יינתן כבר אז
interface AdminSpotCheckProps {
  spotId: number;          // על איזו חניה מדובר
  title: string;           // הכתובת להצגה
  onChecked: () => void;   // מה לעשות אחרי בדיקה (לרענן את רשימת החניות)
}

function AdminSpotCheck({ spotId, title, onChecked }: AdminSpotCheckProps) {
  const [image, setImage] = useState<File | null>(null); // התמונה שהמנהל בחר
  const { loading, result, message, error, uploadCamera, adminCheck } = useSpotCheck(spotId, onChecked);

  // כשבוחרים קובץ: שומרים את הקובץ הראשון שנבחר (או null אם ביטלו)
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImage(e.target.files?.[0] ?? null);
  }

  function handleUpload() {
    if (image === null) return;
    uploadCamera(image);
  }

  // עיצוב משותף לשני הכפתורים
  const buttonStyle: React.CSSProperties = {
    padding: '8px 14px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 700,
    fontSize: '13px',
    cursor: loading ? 'not-allowed' : 'pointer',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '14px 0',
        borderBottom: '1px solid #eef4fb',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0a2540' }}>
        #{spotId} · {title}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '13px' }} />

        {/* שלב 1: המצלמה מצלמת (מושבת עד שבוחרים תמונה) */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={image === null || loading}
          style={{ ...buttonStyle, background: image === null ? '#cfdbea' : '#0a2540', color: 'white' }}
        >
          📷 העלאת תמונת מצלמה
        </button>

        {/* שלב 2: הפקח בודק את מה שהמצלמה צילמה */}
        <button
          type="button"
          onClick={adminCheck}
          disabled={loading}
          style={{ ...buttonStyle, background: '#0a6cf0', color: 'white' }}
        >
          {loading ? 'בודק...' : '🔍 בדיקה'}
        </button>
      </div>

      {message !== null && <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>{message}</span>}
      {error !== null && <span style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>{error}</span>}
      {result !== null && <SpotCheckResultBox result={result} />}
    </div>
  );
}

export default AdminSpotCheck;