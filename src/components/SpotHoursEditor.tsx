import React, { useState } from 'react';
import { useSpotHours } from '../hooks/useSpotHours';

// שמות הימים לפי המספר שהשרת שולח (0=ראשון ... 6=שבת)
const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

// "08:00:00" -> "08:00" (בלי השניות, יותר נוח לקריאה)
function shortTime(time: string): string {
  return time.slice(0, 5);
}

// 🕐 בעל החניה קובע באילו ימים ושעות החניה מושכרת.
// החניה מופיעה לנהגים באתר רק בזמנים האלה. יום / שעה שלא נכתבו כאן = החניה לא מופיעה.
// מופיע בתוך כל כרטיס חניה במסך "החניות שלי" (MySpotsScreen)
interface SpotHoursEditorProps {
  spotId: number;
}

function SpotHoursEditor({ spotId }: SpotHoursEditorProps) {
  const { hours, loading, error, addHours, removeHours } = useSpotHours(spotId);

  // useState: הטופס שייך רק לקומפוננטה הזאת
  const [open, setOpen] = useState<boolean>(false);            // האם האזור פתוח
  const [selectedDays, setSelectedDays] = useState<number[]>([]); // הימים שסומנו
  const [start, setStart] = useState<string>('08:00');
  const [end, setEnd] = useState<string>('16:00');

  // סימון / ביטול סימון של יום
  function toggleDay(day: number) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // שהדף לא יתרענן
    await addHours(selectedDays, start, end);
    setSelectedDays([]);
  }

  return (
    <div style={{ background: '#f6faff', border: '1px solid #dfe8f3', borderRadius: '12px', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '14px' }}>🕐 ימים ושעות שהחניה מושכרת</span>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: '#0a6cf0', fontWeight: 700, cursor: 'pointer' }}
        >
          {open ? 'סגירה' : 'עריכה'}
        </button>
      </div>

      {/* בלי שעות בכלל: החניה לא מופיעה לנהגים */}
      {hours.length === 0 && (
        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#b45309', fontWeight: 700 }}>
          ⚠️ עדיין לא הוגדרו שעות, ולכן החניה לא מופיעה לנהגים באתר.
        </p>
      )}

      {/* רשימת השעות, מסודרת לפי יום (השרת כבר ממיין) */}
      {hours.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {hours.map((h) => (
            <span
              key={h.availabilityID}
              style={{
                background: 'white',
                border: '1px solid #cfdbea',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '12px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
              }}
            >
              {DAY_NAMES[h.dayOfWeek]} {shortTime(h.startTime)}–{shortTime(h.endTime)}
              {open && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => removeHours(h.availabilityID)}
                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 }}
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* טופס הוספה: בוחרים ימים, שעת התחלה ושעת סיום */}
      {open && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {DAY_NAMES.map((name, day) => (
              <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} />
                {name}
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '13px' }}>
            משעה
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            עד שעה
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0a6cf0',
                color: 'white',
                fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'שומר...' : '+ הוספה'}
            </button>
          </div>
        </form>
      )}

      {error !== null && (
        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#dc2626', fontWeight: 700 }}>{error}</p>
      )}
    </div>
  );
}

export default SpotHoursEditor;
