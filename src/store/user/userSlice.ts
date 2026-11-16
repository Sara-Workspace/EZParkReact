import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './userState';
import {
  setUserReducer,
  logoutReducer,
  deductPointsReducer,
  setLicensePlateReducer,
} from './userReducers';
import { refreshPoints } from './userThunks';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: setUserReducer,
    logout: logoutReducer,
    deductPoints: deductPointsReducer,
    setLicensePlate: setLicensePlateReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(refreshPoints.fulfilled, (state, action) => {
      state.points = action.payload;
    });
  },
});

export const { setUser, logout, deductPoints, setLicensePlate } = userSlice.actions;
export default userSlice.reducer;