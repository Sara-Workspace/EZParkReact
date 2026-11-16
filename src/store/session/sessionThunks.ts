import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/api';
import type { Reservation } from '../../types';

// מחפשת בשרת הזמנה פעילה של המשתמשת (או null אם אין)
export const loadActiveReservation = createAsyncThunk<Reservation | null>(
  'session/loadActiveReservation',
  async () => {
    const mine = await apiFetch<Reservation[]>('/Reservations/my');
    const active = mine
      .filter((r) => r.status === 'Active')
      .sort((a, b) => b.reservationID - a.reservationID)[0];
    return active ?? null;
  }
);