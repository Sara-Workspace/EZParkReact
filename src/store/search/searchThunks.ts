import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch, getErrorMessage } from '../../api/api';
import type { SearchResult } from '../../types';

export interface SearchParams {
  latitude: number;
  longitude: number;
  excludeIds: number[];
  sortBy: 'smart' | 'distance' | 'price';
}

export const searchSpots = createAsyncThunk<SearchResult[], SearchParams, { rejectValue: string }>(
  'search/searchSpots',
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        latitude: String(params.latitude),
        longitude: String(params.longitude),
        radiusKm: '5',
        sortBy: params.sortBy,
      });
      // רשימה נשלחת כפרמטר חוזר: ExcludeIds=1&ExcludeIds=2
      params.excludeIds.forEach((id) => query.append('excludeIds', String(id)));

      return await apiFetch<SearchResult[]>(`/ParkingSpots/search?${query.toString()}`);
    } catch (err) {
      // ההודעה הברורה (למשל "אין חיבור לשרת...")
      return rejectWithValue(getErrorMessage(err, 'החיפוש נכשל. נסי שוב.'));
    }
  }
);