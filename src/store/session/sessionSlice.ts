import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './sessionState';
import {
  setHoldReducer,
  clearHoldReducer,
  setReservationReducer,
  clearSessionReducer,
} from './sessionReducers';
import { loadActiveReservation } from './sessionThunks';

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setHold: setHoldReducer,
    clearHold: clearHoldReducer,
    setReservation: setReservationReducer,
    clearSession: clearSessionReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(loadActiveReservation.fulfilled, (state, action) => {
      if (action.payload !== null) {
        state.reservation = action.payload;
      } else if (state.reservation?.status === 'Active') {
        // השרת אומר שאין חניה פעילה (למשל שהמנהלת סגרה אותה): מנקים את המצב הישן
        state.reservation = null;
      }
    });
  },
});

export const { setHold, clearHold, setReservation, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;