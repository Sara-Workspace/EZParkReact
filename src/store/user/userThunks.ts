import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/api';

interface MeResponse {
  points: number;
}

// מביאה מהשרת את הנקודות העדכניות (לפי הטוקן)
export const refreshPoints = createAsyncThunk<number>('user/refreshPoints', async () => {
  try {
    const me = await apiFetch<MeResponse>('/Drivers/me');
    return me.points;
  } catch {
    // למשתמש מסוג Owner בלבד ייתכן שעדיין לא נוצר פרופיל Driver
    return 0;
  }
});