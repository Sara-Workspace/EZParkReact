import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatState } from './chatState';

// הזרמה: עוד חתיכה מהתשובה הגיעה, מוסיפים אותה לסוף ההודעה האחרונה (של ה-AI)
export const appendChunkReducer = (state: ChatState, action: PayloadAction<string>) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage !== undefined && lastMessage.role === 'assistant') {
    lastMessage.text += action.payload;
  }
};

// כפתור "שיחה חדשה": מוחקים את כל השיחה
export const clearChatReducer = (state: ChatState) => {
  state.messages = [];
  state.error = null;
};
