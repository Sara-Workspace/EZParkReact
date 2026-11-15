import { configureStore } from '@reduxjs/toolkit';
import parkingsReducer from './parkings/parkingsSlice';
import userReducer from './user/userSlice';
 
export const store = configureStore({
  reducer: {
    parkings: parkingsReducer,
    user: userReducer,

  },
});

// בכל שינוי ב-state של המשתמש שומרים עותק, כדי שישרוד רענון דף
store.subscribe(() => {
  try {
    localStorage.setItem('user', JSON.stringify(store.getState().user));
  } catch {
    // אם אי אפשר לשמור - לא קורה כלום
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;