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