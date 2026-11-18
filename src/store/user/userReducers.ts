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

// הורדה מיתרת הארנק (למשל בסיום חניה). היתרה יכולה לרדת למינוס, כמו בשרת
export const deductPointsReducer = (state: UserState, action: PayloadAction<number>) => {
  state.points = state.points - action.payload;
};

// עדכון מספר הרישוי של הרכב הנוכחי
export const setLicensePlateReducer = (state: UserState, action: PayloadAction<string>) => {
  state.licensePlate = action.payload;
};