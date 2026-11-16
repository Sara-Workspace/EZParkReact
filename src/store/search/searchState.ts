import type { Destination, SearchResult } from '../../types';

export interface SearchState {
  destination: Destination | null;
  excludeIds: number[];
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

export const initialState: SearchState = {
  destination: null,
  excludeIds: [],
  results: [],
  loading: false,
  error: null,
};