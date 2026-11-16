import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './searchState';
import { setDestinationReducer, excludeSpotReducer, clearSearchReducer } from './searchReducers';
import { searchSpots } from './searchThunks';

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDestination: setDestinationReducer,
    excludeSpot: excludeSpotReducer,
    clearSearch: clearSearchReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSpots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSpots.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchSpots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'שגיאה בחיפוש';
      });
  },
});

export const { setDestination, excludeSpot, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;