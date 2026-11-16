import type { ParkingSpot } from '../../types';
export type { ParkingSpot };

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