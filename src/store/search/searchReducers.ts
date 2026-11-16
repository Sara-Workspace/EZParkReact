import type { PayloadAction } from '@reduxjs/toolkit';
import type { Destination } from '../../types';
import { initialState, type SearchState } from './searchState';

// יעד חדש: מתחילים חיפוש נקי
export const setDestinationReducer = (state: SearchState, action: PayloadAction<Destination>) => {
  state.destination = action.payload;
  state.excludeIds = [];
  state.results = [];
};

// "החניה תפוסה": מחריגים אותה מהחיפוש הבא
export const excludeSpotReducer = (state: SearchState, action: PayloadAction<number>) => {
  if (!state.excludeIds.includes(action.payload)) {
    state.excludeIds.push(action.payload);
  }
};

export const clearSearchReducer = () => {
  return initialState;
};