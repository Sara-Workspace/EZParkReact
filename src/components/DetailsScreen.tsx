import React from 'react';
import Button from './Button';

function DetailsScreen() {
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
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button label="← חזרה למפה" background="#e2e8f0" color="#0f172a" />
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
          רח' הרצל 14, תל אביב-יפו
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>מחיר לדקה</span>
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#4f46e5' }}>₪0.40</span>
          <p style={{ fontSize: '12px', color: '#475569', marginTop: '16px' }}>
            חניה מקורה תת-קרקעית עם שער חשמלי אוטומטי.
          </p>
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: '#eef2ff',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>הערכת זמן (120 דקות)</span>
              <span style={{ fontWeight: 700 }}>₪48.00</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#059669',
                fontWeight: 700,
              }}
            >
              <span>הנחת מנוי</span>
              <span>-₪5.00</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #c7d2fe',
                paddingTop: '8px',
                fontSize: '14px',
                fontWeight: 900,
              }}
            >
              <span>סך הכל:</span>
              <span style={{ color: '#4f46e5' }}>₪43.00</span>
            </div>
          </div>

          <Button
            label="אשר הזמנה ותשלום מאובטח 💳"
            background="#4f46e5"
            color="white"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}

export default DetailsScreen;