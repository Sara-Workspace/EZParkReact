import React from 'react';
import InfoCard from './InfoCard';

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
        <InfoCard title="זמן שנותר להגעה">
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
        </InfoCard>

        <InfoCard title="קוד כניסה לשער">
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
        </InfoCard>
      </div>
    </div>
  );
}

export default NavigationScreen;