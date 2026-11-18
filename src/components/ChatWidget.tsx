import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useVoiceInput } from '../hooks/useVoiceInput';

// Gemini מסמן לפעמים טקסט מודגש עם ** (למשל **הרצל 10**). מורידים את הכוכביות כדי שלא יופיעו על המסך
function cleanText(text: string): string {
  return text.replaceAll('**', '');
}

// 💬 חלון הצ'אט עם עוזר ה-AI: כפתור עגול בפינת המסך, שפותח חלון שיחה.
// מופיע בכל המסכים של משתמש מחובר (נוסף ב-Layout)
function ChatWidget() {
  const { messages, loading, error, sendMessage, startNewChat } = useChat();
  const { listening, voiceError, startListening } = useVoiceInput();
  const navigate = useNavigate();

  // useState ולא Redux: רק הקומפוננטה הזאת צריכה לדעת אם החלון פתוח ומה כתוב בתיבה
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  // לחיצה על חניה שה-AI מצא: עוברים למסך פרטי החניה (משם מזמינים כרגיל), וסוגרים את החלון
  function openSpot(spotId: number) {
    navigate(`/parking/${spotId}`);
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // שהדף לא יתרענן
    sendMessage(input);
    setInput('');
  }

  // 🎤 לחיצה על המיקרופון: מקשיבים, והטקסט שזוהה נכנס לתיבת הכתיבה.
  // לא שולחים לבד, כדי שאפשר יהיה לבדוק ולתקן לפני "שליחה"
  function handleVoice() {
    startListening((text) => {
      // אם כבר היה משהו כתוב בתיבה, מוסיפים אחריו
      if (input.trim() === '') {
        setInput(text);
      } else {
        setInput(input + ' ' + text);
      }
    });
  }

  // ===== סגור: רק כפתור עגול בפינה =====
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: '#0a6cf0',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          zIndex: 1000,
        }}
      >
        💬
      </button>
    );
  }

  // ===== פתוח: חלון השיחה =====
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: 'min(360px, calc(100vw - 32px))',
        height: 'min(520px, calc(100vh - 48px))',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      {/* כותרת: שם, "שיחה חדשה" וסגירה */}
      <div
        style={{
          background: '#0a2540',
          color: 'white',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700 }}>🤖 עוזר החניות</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={startNewChat}
            disabled={loading}
            style={{
              background: '#2a3b52',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            שיחה חדשה
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* אזור ההודעות.
          column-reverse = "נקודת ההתחלה" של הגלילה למטה: כשמגיעה הודעה חדשה, החלון נשאר למטה לבד,
          ועדיין אפשר לגלול למעלה ולראות את כל השיחה */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          background: '#f6faff',
        }}
      >
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {messages.length === 0 && (
            <p style={{ color: '#5a6b82', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
              שלום! כתבו לי איפה אתם צריכים חניה, למשל:
              <br />
              "אני צריך חניה ליד הרצל 10 בתל אביב"
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-start' : 'flex-end',
                gap: '6px',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', // שומר על ירידות השורה מהתשובה
                  background: message.role === 'user' ? '#0a6cf0' : 'white',
                  color: message.role === 'user' ? 'white' : '#0a2540',
                  border: message.role === 'user' ? 'none' : '1px solid #dfe8f3',
                }}
              >
                {/* הודעת AI ריקה = התשובה עוד לא התחילה להגיע */}
                {message.text === '' ? 'מחפש חניות... 🔎' : cleanText(message.text)}
              </div>

              {/* החניות שה-AI מצא: כפתור לכל אחת, שמוביל למסך פרטי החניה */}
              {message.spots !== undefined &&
                message.spots.map((spot) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => openSpot(spot.id)}
                    style={{
                      maxWidth: '85%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #b3d2ff',
                      background: '#eaf3ff',
                      color: '#0a3d8f',
                      fontSize: '13px',
                      fontWeight: 700,
                      textAlign: 'right',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    📍 {spot.address}, {spot.city} · {spot.pricePerHour} ₪/שעה {spot.evCharger && '· ⚡'} · לפרטים ←
                  </button>
                ))}
            </div>
          ))}

          {error !== null && (
            <p style={{ color: '#dc2626', fontSize: '13px', textAlign: 'center', margin: 0 }}>{error}</p>
          )}

          {/* שגיאה בהקלטה (מיקרופון, דפדפן וכו') */}
          {voiceError !== null && (
            <p style={{ color: '#dc2626', fontSize: '13px', textAlign: 'center', margin: 0 }}>{voiceError}</p>
          )}
        </div>
      </div>

      {/* תיבת הכתיבה (Controlled Input) */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid #dfe8f3' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? 'מקשיב... דברו עכשיו 🎙️' : 'כתבו הודעה או לחצו על 🎤'}
          maxLength={2000}
          disabled={loading || listening}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #cfdbea',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        />
        {/* 🎤 כפתור הקלטה. בזמן ההקלטה הוא אדום */}
        <button
          type="button"
          onClick={handleVoice}
          disabled={loading || listening}
          title="הקלטה במקום כתיבה"
          style={{
            width: '42px',
            borderRadius: '10px',
            border: 'none',
            background: listening ? '#dc2626' : '#eaf3ff',
            color: listening ? 'white' : '#0a6cf0',
            fontSize: '18px',
            cursor: loading || listening ? 'default' : 'pointer',
          }}
        >
          {listening ? '⏺' : '🎤'}
        </button>
        <button
          type="submit"
          disabled={loading || listening || input.trim() === ''}
          style={{
            padding: '0 16px',
            borderRadius: '10px',
            border: 'none',
            background: loading || input.trim() === '' ? '#8fa1b8' : '#0a6cf0',
            color: 'white',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          שליחה
        </button>
      </form>
    </div>
  );
}

export default ChatWidget;