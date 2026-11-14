import { configureStore } from '@reduxjs/toolkit';
import parkingsReducer from './parkings/parkingsSlice';
 
export const store = configureStore({
  reducer: {
    parkings: parkingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;