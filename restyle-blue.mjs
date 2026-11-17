// הרצה מתיקיית הפרויקט:  node restyle-blue.mjs
// עובד גם על הפרויקט המקורי (אינדיגו) וגם אחרי ההרצה הקודמת (ירוק).
// מעביר את כל המסכים לכחול־לבן בסגנון Pango, בלי לגעת בלוגיקה.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(root, p), s, 'utf8');

// ───── פלטה חדשה ─────
const PRIMARY = '#0a6cf0'; // כחול ראשי
const PRIMARY_DARK = '#0856c2';
const NAVY = '#0a2540'; // כחול עמוק
const SKY = '#eaf3ff'; // תכלת בהיר

// ישן (מקורי או ירוק) → חדש
const COLOR_MAP = {
  // ראשי
  '#4f46e5': PRIMARY, '#1f7a4d': PRIMARY,
  '#4338ca': PRIMARY_DARK, '#165c3a': PRIMARY_DARK,
  '#3730a3': '#0a3d8f',
  // תכלת בהיר
  '#eef2ff': SKY, '#e8f3ea': SKY,
  '#e0e7ff': '#d4e6ff', '#cfe3d4': '#d4e6ff',
  '#c7d2fe': '#b3d2ff', '#b7d6c0': '#b3d2ff',
  // כהה
  '#0f172a': NAVY, '#12372a': NAVY,
  // אפורים כחלחלים
  '#64748b': '#5a6b82', '#5b6b63': '#5a6b82',
  '#475569': '#44566e', '#3f4f47': '#44566e',
  '#334155': '#2a3b52', '#2c3b34': '#2a3b52',
  '#94a3b8': '#8fa1b8', '#94a39a': '#8fa1b8',
  '#cbd5e1': '#cfdbea', '#cdd9d1': '#cfdbea',
  '#e2e8f0': '#dfe8f3', '#e4e8e1': '#dfe8f3',
  '#f1f5f9': '#eef4fb', '#eef3ec': '#eef4fb',
  '#f8fafc': '#f6faff', '#f4f8f3': '#f6faff',
  // קישור פעיל בתפריט הכהה
  '#38bdf8': '#7cc0ff', '#f2b134': '#7cc0ff',
};

// ───── מסכים (LandingScreen מוחלף בקובץ נפרד) ─────
const skip = new Set(['LandingScreen.tsx']);
const compDir = path.join(root, 'src/components');
let changed = 0;
for (const f of fs.readdirSync(compDir)) {
  if (!f.endsWith('.tsx') || skip.has(f)) continue;
  const p = path.join('src/components', f);
  const before = read(p);
  const after = before
    .replace(/#[0-9a-fA-F]{6}\b/g, (m) => COLOR_MAP[m.toLowerCase()] ?? m)
    .replace(/rgba\((15,\s*23,\s*42|18,\s*55,\s*42),/g, 'rgba(10, 37, 64,');
  if (after !== before) { write(p, after); changed++; }
}

// ───── כפתור משותף: צורת כדור ─────
write('src/components/Button.tsx', read('src/components/Button.tsx').replace("borderRadius: '12px'", "borderRadius: '999px'"));

// ───── תפריט עליון ─────
write('src/components/Layout.tsx', read('src/components/Layout.tsx')
  .replace('חניה בקליק • פארקי', 'EZPark • חניה בקליק')
  .replace('EZPark • חניה בקליק', 'EZPark • חניה בקליק'));

// ───── סגנון גלובלי ─────
write('src/index.css', `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Assistant', 'Heebo', system-ui, sans-serif;
  background: #f6faff;
  color: #14263d;
  direction: rtl;
}

h1, h2, h3 {
  font-family: 'Rubik', 'Assistant', system-ui, sans-serif;
  font-weight: 700;
}

button, input, select, textarea {
  font-family: inherit;
}
`);

// ───── index.html: פונטים, שפה, כותרת ─────
let html = read('index.html');
html = html.replace(
  /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^>]*>/,
  '<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Rubik:wght@500;600;700;800&display=swap" rel="stylesheet">'
);
html = html.replace('<html lang="en">', '<html lang="he" dir="rtl">').replace('<title>my-app</title>', '<title>EZPark | חניה בקליק</title>');
write('index.html', html);

console.log(`בוצע: עודכנו ${changed} מסכים. אל תשכחי להחליף גם את LandingScreen.tsx בגרסה החדשה.`);
