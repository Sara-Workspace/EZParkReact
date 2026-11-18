// הצגת סכום בשקלים: 12.5 -> "12.50 ₪". מספר שלם מוצג בלי אגורות: 100 -> "100 ₪"
export function formatMoney(amount: number): string {
  const fixed = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${fixed} ₪`;
}

// 💰 העמלה של האתר: 10%. בעל החניה מקבל 90% (אותו חישוב כמו בשרת, ב-WalletService)
export const PLATFORM_FEE_RATE = 0.1;

// כמה בעל החניה מקבל מחניה שעלתה cost
export function ownerShare(cost: number): number {
  const fee = Math.round(cost * PLATFORM_FEE_RATE * 100) / 100;
  return Math.round((cost - fee) * 100) / 100;
}
