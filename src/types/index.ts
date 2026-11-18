export interface ParkingSpot {
  spotId: number;
  ownerId: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  evCharger: boolean;
  basePricePerHour: number;
  isActive: boolean;
  image?: string;
}

// חניה כפי שחוזרת מהחיפוש: כל הפרטים + מה שהאלגוריתם חישב
export interface SearchResult extends ParkingSpot {
  distanceKm: number;
  effectivePricePerHour: number;
  score: number;
}

// תשובת POST /ParkingSpots/{id}/hold
export interface HoldResult {
  spotId: number;
  heldUntilUtc: string;
  expiresInSeconds: number;
}

export interface Reservation {
  reservationID: number;
  spotID: number;
  driverID: number;
  startTime: string;
  endTime: string;
  useCharging: boolean;
  totalPrice: number;
  status: string;
  createdAt: string;
}

// יעד החיפוש אחרי המרת הכתובת לקואורדינטות
export interface Destination {
  address: string;
  latitude: number;
  longitude: number;
}

// תשובת בדיקת חניה (api/SpotChecks)
export interface SpotCheckResult {
  spotId: number;
  licensePlate: string;
  result: 'Paying' | 'OwnerCar' | 'OtherDriver' | 'Unknown';
  message: string;
  finePoints: number;
  spotAvailable: boolean;
}

// 🕐 שעות זמינות של חניה: חלון זמן אחד שחוזר כל שבוע (מגיע מ-api/SpotAvailability)
export interface SpotHours {
  availabilityID: number; // מזהה השורה (בשביל מחיקה)
  spotID: number;
  dayOfWeek: number;      // 0=ראשון ... 6=שבת
  startTime: string;      // "08:00:00"
  endTime: string;        // "16:00:00"
}

// 👛 הארנק (api/Wallet/me)
export interface WalletTransaction {
  type: 'TopUp' | 'Parking' | 'Earning' | 'PlatformFee' | 'Fine' | 'Withdrawal';
  amount: number;        // חיובי = נכנס, שלילי = יצא
  description: string;
  createdAt: string;
}

export interface Wallet {
  balance: number;       // היתרה בשקלים
  transactions: WalletTransaction[];
}
