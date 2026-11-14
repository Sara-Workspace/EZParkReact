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

export interface ParkingsState {
  items: ParkingSpot[];
  loading: boolean;
  error: string | null;
}

export const initialState: ParkingsState = {
  items: [],
  loading: false,
  error: null,
};