import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendChatMessage } from '../store/chat/chatThunks';
import { clearChat } from '../store/chat/chatSlice';

// הוק משלנו לצ'אט: עוטף את ה-Store, כדי שהקומפוננטה רק תציג ולא תדע איך Redux עובד
export function useChat() {
  const dispatch = useAppDispatch();
  const { messages, loading, error } = useAppSelector((state) => state.chat);

  // שליחת שאלה חדשה
  function sendMessage(text: string) {
    const question = text.trim();
    if (question === '' || loading) return;

    const now = Date.now();
    dispatch(
      sendChatMessage({
        messages: [...messages, { id: now, role: 'user', text: question }],
        replyId: now + 1, // מזהה שונה להודעת התשובה
      })
    );
  }

  // "שיחה חדשה"
  function startNewChat() {
    dispatch(clearChat());
  }

  return { messages, loading, error, sendMessage, startNewChat };
}
