import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/api';

interface MeResponse {
  points: number;
}

// מביאה מהשרת את הנקודות העדכניות (לפי הטוקן)
export const refreshPoints = createAsyncThunk<number>('user/refreshPoints', async () => {
  const me = await apiFetch<MeResponse>('/Drivers/me');
  return me.points;
});