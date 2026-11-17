import React, { useState } from 'react';
import { useSpotCheck } from '../hooks/useSpotCheck';
import SpotCheckResultBox from './SpotCheckResultBox';

// 🏠 בעל חניה: רואה רכב זר בחניה שלו, מצלם אותו ושולח לבדיקה.
// מופיע בתוך כל כרטיס חניה במסך "החניות שלי" (MySpotsScreen)
interface OwnerSpotCheckProps {
  spotId: number;          // על איזו חניה מדובר
  onChecked: () => void;   // מה לעשות אחרי בדיקה (לרענן את רשימת החניות)
}

function OwnerSpotCheck({ spotId, onChecked }: OwnerSpotCheckProps) {
  const [image, setImage] = useState<File | null>(null); // התמונה שבעל החניה בחר
  const { loading, result, error, ownerCheck } = useSpotCheck(spotId, onChecked);

  // כשבוחרים קובץ: שומרים את הקובץ הראשון שנבחר (או null אם ביטלו)
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImage(e.target.files?.[0] ?? null);
  }

  // שליחת הטופס: preventDefault כדי שהדף לא יתרענן, ואז שולחים לבדיקה
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (image === null) return;
    ownerCheck(image);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderTop: '1px solid #dfe8f3',
        paddingTop: '14px',
        textAlign: 'right',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#2a3b52' }}>
        🚗 יש רכב זר בחניה? צלמי אותו והמערכת תבדוק של מי הוא
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* accept="image/*" = אפשר לבחור רק תמונות */}
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '13px' }} />

        {/* הכפתור מושבת כשלא נבחרה תמונה, או כשבדיקה כבר בדרך */}
        <button
          type="submit"
          disabled={image === null || loading}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: image === null || loading ? 'not-allowed' : 'pointer',
            background: image === null ? '#cfdbea' : '#0a6cf0',
            color: 'white',
          }}
        >
          {loading ? 'בודק...' : 'בדיקת רכב'}
        </button>
      </div>

      {error !== null && <span style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>{error}</span>}
      {result !== null && <SpotCheckResultBox result={result} />}
    </form>
  );
}

export default OwnerSpotCheck;