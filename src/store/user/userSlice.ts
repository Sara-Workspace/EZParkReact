import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './userState';
import {
  setUserReducer,
  logoutReducer,
  deductPointsReducer,
  setLicensePlateReducer,
} from './userReducers';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: setUserReducer,
    logout: logoutReducer,
    deductPoints: deductPointsReducer,
    setLicensePlate: setLicensePlateReducer,
  },
});

export const { setUser, logout, deductPoints, setLicensePlate } = userSlice.actions;
export default userSlice.reducer;