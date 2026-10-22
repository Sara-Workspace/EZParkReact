export interface Parking {
  id: number;
  title: string;
  distance: string;
  walkTime: string;
  rating: number;
  pricePerMin: number;
  isCovered: boolean;
}

export interface Rental {
  id: number;
  plateNumber: string;
  timeAgo: string;
  durationMin: number;
  type: string;
  totalEarnings: number;
}
export interface Tab {
  id: number;
  label: string;
}