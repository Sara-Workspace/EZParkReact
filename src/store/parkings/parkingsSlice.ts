import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './parkingsState';
import { fetchParkings, fetchMyParkings, addParking, updateParking, deleteParking } from './parkingsThunks';

const parkingsSlice = createSlice({
  name: 'parkings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------- GET ----------
      .addCase(fetchParkings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchParkings.rejected, (state) => {
        state.loading = false;
        state.error = 'נכשל בטעינת רשימת החניות מהשרת';
      })
      // ---------- GET (החניות שלי) ----------
      .addCase(fetchMyParkings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyParkings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyParkings.rejected, (state) => {
        state.loading = false;
        state.error = 'נכשל בטעינת החניות שלך מהשרת';
      })
      // ---------- POST ----------
      .addCase(addParking.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // ---------- PUT ----------
      .addCase(updateParking.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.spotId === action.payload.spotId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // ---------- DELETE ----------
      .addCase(deleteParking.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.spotId !== action.payload);
      });
  },
});

export default parkingsSlice.reducer;