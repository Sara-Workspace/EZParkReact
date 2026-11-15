import type { PayloadAction } from '@reduxjs/toolkit';
import { emptyState, type UserState } from './userState';

// התחברות: מחליפים את כל פרטי המשתמש במה שהתקבל מהשרת
export const setUserReducer = (_state: UserState, action: PayloadAction<UserState>) => {
  return action.payload;
};

// התנתקות: חוזרים למצב ריק
export const logoutReducer = () => {
  return emptyState;
};

// הורדת נקודות (למשל בסיום חניה). לעולם לא יורדים מתחת ל-0
export const deductPointsReducer = (state: UserState, action: PayloadAction<number>) => {
  state.points = Math.max(0, state.points - action.payload);
};

// עדכון מספר הרישוי של הרכב הנוכחי
export const setLicensePlateReducer = (state: UserState, action: PayloadAction<string>) => {
  state.licensePlate = action.payload;
};