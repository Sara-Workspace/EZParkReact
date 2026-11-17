import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './chatState';
import { appendChunkReducer, clearChatReducer, setSpotsReducer } from './chatReducers';
import { sendChatMessage } from './chatThunks';

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    appendChunk: appendChunkReducer,
    setSpots: setSpotsReducer,
    clearChat: clearChatReducer,
  },
  extraReducers: (builder) => {
    builder
      // השאלה יצאה: מציגים אותה, ומתחתיה הודעה ריקה של ה-AI שתתמלא חתיכה אחרי חתיכה
      .addCase(sendChatMessage.pending, (state, action) => {
        state.messages = [
          ...action.meta.arg.messages,
          { id: action.meta.arg.replyId, role: 'assistant', text: '' },
        ];
        state.loading = true;
        state.error = null;
      })
      // התשובה הגיעה במלואה
      .addCase(sendChatMessage.fulfilled, (state) => {
        state.loading = false;
      })
      // משהו השתבש: מוחקים את הודעת ה-AI אם היא נשארה ריקה, ומציגים שגיאה
      .addCase(sendChatMessage.rejected, (state) => {
        state.loading = false;
        state.messages = state.messages.filter((m) => m.text !== '');
        state.error = 'משהו השתבש. נסו שוב בעוד רגע.';
      });
  },
});

export const { appendChunk, setSpots, clearChat } = chatSlice.actions;
export default chatSlice.reducer;