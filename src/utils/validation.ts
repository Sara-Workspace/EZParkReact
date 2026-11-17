// ===== בדיקות שדות בטופס (בצד הלקוח) =====
// כל פונקציה מקבלת את מה שהמשתמש הקליד ומחזירה:
//   null    = הכל תקין
//   טקסט    = מה לא בסדר, בעברית ברורה (מוצג מתחת לשדה)
// אותם כללים כמו בשרת (ב-DTO), כדי שהמשתמש יראה את הבעיה עוד לפני ששולחים.
// השרת עדיין בודק שוב בכל מקרה: אסור לסמוך רק על הדפדפן.

// רק הספרות מתוך הטקסט (מוריד מקפים ורווחים): "050-123 4567" -> "0501234567"
export function onlyDigits(value: string): string {
  return value
    .split('')
    .filter((ch) => ch >= '0' && ch <= '9')
    .join('');
}

// האם יש בטקסט תו שהוא לא ספרה, מקף או רווח
function hasInvalidPhoneChars(value: string): boolean {
  return value.split('').some((ch) => !(ch >= '0' && ch <= '9') && ch !== '-' && ch !== ' ');
}

// שדה טקסט חובה עם אורך מינימלי ומקסימלי. fieldName = איך לקרוא לשדה בהודעה
export function validateText(value: string, fieldName: string, min: number, max: number): string | null {
  const text = value.trim();
  if (text === '') return `יש למלא ${fieldName}.`;
  if (text.length < min) return `${fieldName} חייב להכיל לפחות ${min} תווים.`;
  if (text.length > max) return `${fieldName} ארוך מדי (עד ${max} תווים).`;
  return null;
}

// אימייל: צריך @ אחד, משהו לפניו, ונקודה בחלק שאחריו (למשל name@gmail.com)
export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (email === '') return 'יש למלא כתובת אימייל.';
  if (email.includes(' ')) return 'בכתובת האימייל אסור שיהיו רווחים.';

  const parts = email.split('@');
  if (parts.length !== 2) return 'כתובת אימייל צריכה להכיל @ אחד, למשל name@gmail.com';

  const [beforeAt, afterAt] = parts;
  if (beforeAt === '') return 'חסר החלק שלפני ה-@ (למשל name@gmail.com).';
  if (!afterAt.includes('.') || afterAt.startsWith('.') || afterAt.endsWith('.')) {
    return 'חסר סוף תקין לכתובת, למשל gmail.com';
  }
  return null;
}

// טלפון נייד ישראלי: 10 ספרות שמתחילות ב-05 (מותר לכתוב עם מקפים)
export function validatePhone(value: string): string | null {
  if (value.trim() === '') return 'יש למלא מספר טלפון.';
  if (hasInvalidPhoneChars(value)) return 'מספר טלפון יכול להכיל רק ספרות (ומקף).';

  const digits = onlyDigits(value);
  if (!digits.startsWith('05')) return 'מספר נייד מתחיל ב-05, למשל 050-1234567';
  if (digits.length < 10) return `חסרות עוד ${10 - digits.length} ספרות (מספר נייד = 10 ספרות).`;
  if (digits.length > 10) return `יש ${digits.length - 10} ספרות מיותרות (מספר נייד = 10 ספרות).`;
  return null;
}

// סיסמה: לפחות 8 תווים (כמו בשרת)
export function validatePassword(value: string): string | null {
  if (value === '') return 'יש למלא סיסמה.';
  if (value.length < 8) return `חסרים עוד ${8 - value.length} תווים (סיסמה = לפחות 8 תווים).`;
  return null;
}

// מספר רישוי ישראלי: 7 או 8 ספרות (מותר לכתוב עם מקפים, למשל 12-345-67)
export function validatePlate(value: string): string | null {
  if (value.trim() === '') return 'יש למלא מספר רישוי.';
  if (hasInvalidPhoneChars(value)) return 'מספר רישוי יכול להכיל רק ספרות (ומקפים).';

  const digits = onlyDigits(value);
  if (digits.length < 7) return `חסרות עוד ${7 - digits.length} ספרות (מספר רישוי = 7 או 8 ספרות).`;
  if (digits.length > 8) return `יש ${digits.length - 8} ספרות מיותרות (מספר רישוי = 7 או 8 ספרות).`;
  return null;
}

// מחיר לשעה: מספר בין 1 ל-50 (כמו בשרת)
export function validatePrice(value: string): string | null {
  if (value.trim() === '') return 'יש למלא מחיר לשעה.';
  const price = Number(value);
  if (Number.isNaN(price)) return 'המחיר חייב להיות מספר.';
  if (price < 1) return 'המחיר המינימלי הוא נקודה אחת לשעה.';
  if (price > 50) return 'המחיר המקסימלי הוא 50 נקודות לשעה.';
  return null;
}

// קו רוחב / קו אורך: לא חובה, אבל אם ממלאים אחד - חייבים גם את השני
export function validateCoordinates(latitude: string, longitude: string): string | null {
  const hasLat = latitude.trim() !== '';
  const hasLng = longitude.trim() !== '';
  if (!hasLat && !hasLng) return null; // שניהם ריקים = השרת ימצא את המיקום לפי הכתובת
  if (!hasLat || !hasLng) return 'יש למלא גם קו רוחב וגם קו אורך, או להשאיר את שניהם ריקים.';

  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) return 'קו רוחב חייב להיות מספר בין 90- ל-90 (בישראל בערך 29 עד 33).';
  if (Number.isNaN(lng) || lng < -180 || lng > 180) return 'קו אורך חייב להיות מספר בין 180- ל-180 (בישראל בערך 34 עד 36).';
  return null;
}

// תמונה: רק jpg / jpeg / png / webp, ועד 5MB (כמו בשרת)
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_IMAGE_MB = 5;

export function validateImage(file: File | null, required: boolean): string | null {
  if (file === null) return required ? 'יש לבחור תמונה.' : null;

  const name = file.name.toLowerCase();
  if (!IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return 'אפשר להעלות רק תמונה מסוג jpg, jpeg, png או webp.';
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `התמונה גדולה מדי (${sizeMb}MB). הגודל המקסימלי הוא ${MAX_IMAGE_MB}MB.`;
  }
  return null;
}

// תגובה על חניה: בין 2 ל-500 תווים (כמו בשרת)
export function validateComment(value: string): string | null {
  const text = value.trim();
  if (text.length < 2) return 'יש לכתוב תגובה (לפחות 2 תווים).';
  if (text.length > 500) return `התגובה ארוכה מדי ב-${text.length - 500} תווים (עד 500).`;
  return null;
}
