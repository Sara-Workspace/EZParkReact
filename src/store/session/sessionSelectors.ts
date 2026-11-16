// עלות בנקודות: תעריף לדקה כפול דקות, מעוגל כלפי מעלה, מינימום 1 (כמו ב-CompleteParking)
export function estimateCost(basePricePerHour: number, minutes: number): number {
  const exact = Number(((minutes * basePricePerHour) / 60).toFixed(6));
  return Math.max(1, Math.ceil(exact));
}

// בונוס 10%: השרת מעגל "לזוגי הקרוב" (Math.Round ב-C#), ולכן חצי מעוגל למספר הזוגי
export function cashbackBonus(cost: number): number {
  const whole = Math.floor(cost / 10);
  const rest = cost % 10;
  if (rest < 5) return whole;
  if (rest > 5) return whole + 1;
  return whole % 2 === 0 ? whole : whole + 1;
}