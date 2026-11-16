import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/api';
import type { ParkingSpot } from './parkingsState';

// GET - הבאת הרשימה
export const fetchParkings = createAsyncThunk('parkings/fetch', async () => {
  return await apiFetch<ParkingSpot[]>('/ParkingSpots');
});

// POST - הוספה (FormData, כמו שכבר עשית ב-AddParkingScreen)
export const addParking = createAsyncThunk('parkings/add', async (formData: FormData) => {
  return await apiFetch<ParkingSpot>('/ParkingSpots', {
    method: 'POST',
    body: formData,
  });
});

// PUT - עדכון, ואחריו קריאה חוזרת מהשרת כדי לקבל את מה שנשמר בפועל
export const updateParking = createAsyncThunk('parkings/update', async (spot: ParkingSpot) => {
  await apiFetch<unknown>(`/ParkingSpots/${spot.spotId}`, {
    method: 'PUT',
    body: JSON.stringify(spot),
  });
  return await apiFetch<ParkingSpot>(`/ParkingSpots/${spot.spotId}`);
});

// DELETE - מחיקה. השרת לא מחזיר כלום, אז מחזירים את ה-id בעצמנו
export const deleteParking = createAsyncThunk('parkings/delete', async (spotId: number) => {
  await apiFetch<void>(`/ParkingSpots/${spotId}`, { method: 'DELETE' });
  return spotId;
});
// GET - החניות של המשתמשת המחוברת בלבד (השרת מזהה לפי האימייל בטוקן)
export const fetchMyParkings = createAsyncThunk('parkings/fetchMine', async () => {
  return await apiFetch<ParkingSpot[]>('/ParkingSpots/my');
});