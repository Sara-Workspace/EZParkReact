
import type { Parking, Rental, Tab } from './types';

export const parkings: Parking[] = [
  {
    id: 1,
    title: "חניון הרצל 14",
    distance: "200 מ'",
    walkTime: "3 דק' הליכה",
    rating: 4.8,
    pricePerMin: 0.4,
    isCovered: true,
  },
  {
    id: 2,
    title: "חניה פרטית ברוטשילד",
    distance: "350 מ'",
    walkTime: "5 דק' הליכה",
    rating: 4.5,
    pricePerMin: 0.35,
    isCovered: false,
  },
  {
    id: 3,
    title: "חניון שוק הכרמל",
    distance: "500 מ'",
    walkTime: "7 דק' הליכה",
    rating: 4.2,
    pricePerMin: 0.28,
    isCovered: false,
  },
  {
    id: 4,
    title: "חניה מקורה בדיזנגוף",
    distance: "650 מ'",
    walkTime: "9 דק' הליכה",
    rating: 4.6,
    pricePerMin: 0.45,
    isCovered: true,
  },
];

export const rentals: Rental[] = [
  {
    id: 1,
    plateNumber: "12-345-67",
    timeAgo: "לפני שעתיים",
    durationMin: 90,
    type: "השכרה רגילה",
    totalEarnings: 36.0,
  },
  {
    id: 2,
    plateNumber: "89-012-34",
    timeAgo: "אתמול",
    durationMin: 120,
    type: "השכרה רגילה",
    totalEarnings: 48.0,
  },
  {
    id: 3,
    plateNumber: "55-678-90",
    timeAgo: "לפני 3 ימים",
    durationMin: 45,
    type: "השכרה קצרה",
    totalEarnings: 18.9,
  },
];
export const tabs: Tab[] = [
  { id: 1, label: '1. בית' },
  { id: 2, label: '2. מפה' },
  { id: 3, label: '3. תשלום' },
  { id: 4, label: '4. ניווט' },
  { id: 5, label: '5. הוספה' },
  { id: 6, label: '6. ניהול' },
];