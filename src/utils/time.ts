// השרת שולח לפעמים זמנים בלי Z בסוף (זמן UTC). בלי התיקון הדפדפן יפרש אותם כשעון מקומי
export function parseServerUtc(value: string): number {
  const trimmed = value.replace(/(\.\d{3})\d+/, '$1'); // השרת שולח 7 ספרות אחרי הנקודה
  const hasZone = /(Z|[+-]\d{2}:\d{2})$/.test(trimmed);
  return new Date(hasZone ? trimmed : `${trimmed}Z`).getTime();
}