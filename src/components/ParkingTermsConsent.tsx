import { useState, type FormEvent } from 'react';

const NAVY = '#0a2540';
const BLUE = '#0a6cf0';
const SKY = '#eaf3ff';
const PAGE = '#f6faff';
const SUN = '#ffc83d';
const INK = '#14263d';
const MUTED = '#5a6b82';
const LINE = '#dfe8f3';

const HEAD = "'Rubik', 'Assistant', system-ui, sans-serif";
const BODY = "'Assistant', system-ui, sans-serif";

interface ParkingTermsConsentProps {
  spotAddress?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const PARKING_RULES = [
  {
    number: '01',
    title: 'עמידה קפדנית בזמני החניה',
    detail:
      'החניה מותרת אך ורק בטווח השעות שאושר בהזמנה. חריגה מעבר לשעת הסיום המוגדרת תגרור חיוב אוטומטי בתעריף חריגה וקנס עיכוב בגין חסימת חניה פרטית.',
  },
  {
    number: '02',
    title: 'איסור חניה ללא שריון ודיווח פעיל',
    detail:
      'אין להחנות את הרכב בחניה פרטית ללא ביצוע שריון מראש וסימון תחילת חניה באפליקציה. חניה ללא סימון פעיל תתועד ותחויב בקנס מלא.',
  },
  {
    number: '03',
    title: 'מדיניות קנסות ואכיפה אוטומטית',
    detail:
      'במקרה של חניה ללא אישור פעיל, חריגה משעת הפינוי או חניה במקום שגוי, חשבון המשתמש יחויב בקנס כספי/נקודות בהתאם לתקנון EZPark.',
  },
  {
    number: '04',
    title: 'אחריות ושמירה על רכוש פרטי',
    detail:
      'הנהג מתחייב להחנות בתוך סימוני החניה המוגדרים בלבד, לשמור על ניקיון המקום ולא לחסום גישה לרכבים סמוכים או לשער.',
  },
];

function ParkingTermsConsent({
  spotAddress = 'חניה פרטית רשומה במערכת EZPark',
  onConfirm,
  onCancel,
}: ParkingTermsConsentProps) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) return;
    onConfirm();
  };

  return (
    <div
      dir="rtl"
      style={{
        background: '#fff',
        border: `1px solid ${LINE}`,
        borderRadius: 24,
        boxShadow: '0 28px 60px rgba(10, 37, 64, 0.28)',
        overflow: 'hidden',
        fontFamily: BODY,
        color: INK,
      }}
    >
      <div
        style={{
          background: NAVY,
          color: '#fff',
          padding: '20px 26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.12)',
              color: SUN,
              fontSize: 12,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 999,
              marginBottom: 6,
            }}
          >
            תנאי חניה ואכיפה • EZPark
          </span>
          <h2 style={{ fontFamily: HEAD, margin: 0, fontSize: 20, fontWeight: 800 }}>
            הצהרת התחייבות לפני חניה
          </h2>
          <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 3 }}>
            {spotAddress}
          </div>
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: BLUE,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          P
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '20px 26px' }}>
        <div
          style={{
            background: PAGE,
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {PARKING_RULES.map((rule, index) => (
            <div
              key={rule.number}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                paddingBottom: index < PARKING_RULES.length - 1 ? 12 : 0,
                borderBottom: index < PARKING_RULES.length - 1 ? `1px solid ${LINE}` : 'none',
              }}
            >
              <span
                style={{
                  background: SKY,
                  color: BLUE,
                  fontFamily: HEAD,
                  fontWeight: 800,
                  fontSize: 12,
                  padding: '3px 9px',
                  borderRadius: 999,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {rule.number}
              </span>
              <div>
                <div style={{ fontFamily: HEAD, fontSize: 14, fontWeight: 700, color: NAVY }}>
                  {rule.title}
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 13, lineHeight: 1.55, color: MUTED }}>
                  {rule.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <label
          style={{
            marginTop: 16,
            padding: '12px 14px',
            borderRadius: 14,
            background: agreed ? SKY : '#fff',
            border: `1.5px solid ${agreed ? BLUE : LINE}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{
              width: 18,
              height: 18,
              marginTop: 2,
              accentColor: BLUE,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, lineHeight: 1.5 }}>
            קראתי ואני מסכים/ה לתנאי החניה, מתחייב/ת לפנות את החניה בזמן ולא להחנות ללא סימון פעיל באפליקציה, ומאשר/ת חיוב קנס במקרה של הפרה.
          </span>
        </label>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: '#fff',
                color: MUTED,
                border: `1px solid ${LINE}`,
                borderRadius: 999,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: BODY,
              }}
            >
              ביטול
            </button>
          )}

          <button
            type="submit"
            disabled={!agreed}
            style={{
              background: agreed ? BLUE : '#cbd5e1',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '10px 26px',
              fontSize: 14,
              fontWeight: 700,
              cursor: agreed ? 'pointer' : 'not-allowed',
              fontFamily: BODY,
              boxShadow: agreed ? '0 8px 20px rgba(10, 108, 240, 0.25)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            אישור והמשך לניווט ←
          </button>
        </div>
      </form>
    </div>
  );
}

export default ParkingTermsConsent;