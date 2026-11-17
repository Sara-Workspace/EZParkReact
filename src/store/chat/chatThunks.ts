import { createAsyncThunk } from '@reduxjs/toolkit';
import { streamChat } from '../../api/chat';
import type { ChatMessage } from './chatState';
import { appendChunk } from './chatSlice';

// כמה הודעות אחרונות שולחים לשרת בכל שאלה (כדי לא לבזבז את המכסה של Gemini על שיחות ארוכות)
const MAX_HISTORY = 10;

// מה מעבירים ל-thunk
interface SendChatArgs {
  messages: ChatMessage[];  // כל השיחה, כולל השאלה החדשה בסוף
  replyId: number;          // מזהה להודעת התשובה של ה-AI (שעוד ריקה)
}

// שליחת שאלה לעוזר ה-AI.
// pending  ← השאלה והודעה ריקה של ה-AI נכנסות למסך (ב-chatSlice)
// בזמן ההזרמה ← כל חתיכה נכנסת להודעה הריקה עם dispatch(appendChunk)
// fulfilled / rejected ← סיום, או שגיאה
export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async ({ messages }: SendChatArgs, { dispatch }) => {
    // לשרת שולחים רק role ו-text (בלי id), ורק את ההודעות האחרונות
    const history = messages.slice(-MAX_HISTORY).map((m) => ({ role: m.role, text: m.text }));

    await streamChat(history, (chunk) => {
      dispatch(appendChunk(chunk));
    });
  }
);
