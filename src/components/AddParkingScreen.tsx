import React from 'react';
import Button from './Button';

function AddParkingScreen() {
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
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
        הוספת חניה פרטית להשכרה
      </h3>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              marginBottom: '4px',
            }}
          >
            כתובת החניה
          </label>
          <div
            style={{
              background: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '12px',
            }}
          >
            רח' דיזנגוף 120, תל אביב-יפו
          </div>
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              marginBottom: '4px',
            }}
          >
            מחיר מבוקש לדקה
          </label>
          <div
            style={{
              background: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '12px',
            }}
          >
            0.42 ₪
          </div>
        </div>

        <Button
          label="פרסם חניה להשכרה כעת 🚗"
          background="#059669"
          color="white"
          fullWidth={true}
        />
      </div>
    </div>
  );
}

export default AddParkingScreen;