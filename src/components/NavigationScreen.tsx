import React from 'react';

function NavigationScreen() {
  return (
    <div
      style={{
        maxWidth: '896px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div
        style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          padding: '24px',
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
          החניה שוריינה עבורך בהצלחה! 🎉
        </h3>
        <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
          קוד הכניסה נוצר ופעיל כעת.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
            זמן שנותר להגעה
          </span>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#4f46e5',
              margin: '12px 0',
            }}
          >
            06:42
          </div>
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
            קוד כניסה לשער
          </span>
          <div
            style={{
              fontSize: '30px',
              fontWeight: 900,
              fontFamily: 'monospace',
              background: 'white',
              border: '1px solid #cbd5e1',
              padding: '8px 16px',
              borderRadius: '12px',
              margin: '8px 0',
            }}
          >
            7 2 8 4
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationScreen;