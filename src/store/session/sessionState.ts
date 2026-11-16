import type { ParkingSpot, Reservation } from '../../types';

export interface SessionState {
  spot: ParkingSpot | null;      // החניה שנבחרה
  heldUntilMs: number | null;    // מתי פג תוקף השמירה (זמן במילישניות)
  reservation: Reservation | null; // ההזמנה, אחרי שלחצו "חניתי"
}

export const initialState: SessionState = {
  spot: null,
  heldUntilMs: null,
  reservation: null,
};