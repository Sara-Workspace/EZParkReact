// עלות בשקלים: תעריף לדקה כפול דקות, מעוגל לאגורות, מינימום 1 ₪ (כמו ב-CompleteParking בשרת)
export function estimateCost(basePricePerHour: number, minutes: number): number {
  const exact = (minutes * basePricePerHour) / 60;
  return Math.max(1, Math.round(exact * 100) / 100);
}
