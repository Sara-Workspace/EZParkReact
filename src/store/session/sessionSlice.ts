import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './sessionState';
import {
  setHoldReducer,
  clearHoldReducer,
  setReservationReducer,
  clearSessionReducer,
} from './sessionReducers';

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setHold: setHoldReducer,
    clearHold: clearHoldReducer,
    setReservation: setReservationReducer,
    clearSession: clearSessionReducer,
  },
});

export const { setHold, clearHold, setReservation, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;