import React from 'react';
import type { SpotCheckResult } from '../types';

// תיבה שמציגה את התוצאה של בדיקת חניה. משמשת גם את בעל החניה וגם את המנהל
interface SpotCheckResultBoxProps {
  result: SpotCheckResult; // מה שהשרת החזיר
}

function SpotCheckResultBox({ result }: SpotCheckResultBoxProps) {
  // הצבע לפי התוצאה: 🟡 צהוב כברירת מחדל (רכב של בעל החניה / רכב לא מוכר / כבר נקנס)
  let background = '#fef3c7';
  let color = '#92400e';

  if (result.result === 'Paying') {
    // 🟢 ירוק: הרכב שייך לנהג שהזמין את החניה, הכול תקין
    background = '#dcfce7';
    color = '#166534';
  } else if (result.finePoints > 0) {
    // 🔴 אדום: ניתן קנס עכשיו
    background = '#fee2e2';
    color = '#b91c1c';
  }

  const boxStyle: React.CSSProperties = {
    background,
    color,
    padding: '12px',
    borderRadius: '12px',
    fontSize: '13px',
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  return (
    <div style={boxStyle}>
      <span style={{ fontWeight: 700 }}>🔍 מספר הרכב שזוהה: {result.licensePlate}</span>
      {/* ההודעה בעברית מגיעה מוכנה מהשרת */}
      <span>{result.message}</span>
      {/* מוצג רק אם ניתן קנס */}
      {result.finePoints > 0 && <span style={{ fontWeight: 700 }}>💸 קנס: {result.finePoints} ₪</span>}
      {/* מוצג רק אם החניה הוסתרה מהחיפוש */}
      {!result.spotAvailable && <span>🚫 החניה לא מוצגת כרגע לנהגים בחיפוש</span>}
    </div>
  );
}

export default SpotCheckResultBox;