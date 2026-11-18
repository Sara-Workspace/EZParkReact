import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/api';
import type { Wallet } from '../../types';

// מביאה מהשרת את יתרת הארנק העדכנית בשקלים (לפי הטוקן).
// עובד לכל משתמש: נהג, בעל חניה או מנהל.
// (השדה ב-Store עדיין נקרא points מהשיטה הישנה, אבל עכשיו הוא שומר שקלים)
export const refreshPoints = createAsyncThunk<number>('user/refreshPoints', async () => {
  try {
    const wallet = await apiFetch<Wallet>('/Wallet/me');
    return wallet.balance;
  } catch {
    return 0;
  }
});
