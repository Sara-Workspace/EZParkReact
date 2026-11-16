import type { PayloadAction } from '@reduxjs/toolkit';
import type { ParkingSpot, Reservation } from '../../types';
import { initialState, type SessionState } from './sessionState';

// בחירת חניה והצלחה בשמירה (Hold)
export const setHoldReducer = (
  state: SessionState,
  action: PayloadAction<{ spot: ParkingSpot; heldUntilMs: number }>
) => {
  state.spot = action.payload.spot;
  state.heldUntilMs = action.payload.heldUntilMs;
  state.reservation = null;
};

// התחרטתי / החניה תפוסה: משחררים את הבחירה
export const clearHoldReducer = (state: SessionState) => {
  state.spot = null;
  state.heldUntilMs = null;
};

// לחצו "חניתי": ההזמנה התחילה
export const setReservationReducer = (state: SessionState, action: PayloadAction<Reservation>) => {
  state.reservation = action.payload;
};

// סיום מלא של התהליך
export const clearSessionReducer = () => {
  return initialState;
};