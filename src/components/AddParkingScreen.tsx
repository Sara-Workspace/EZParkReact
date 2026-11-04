import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. ייבוא ההוק
import Button from './Button';
import FormField from './FormField';

function AddParkingScreen() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // מניעת טעינת עמוד
    // לאחר שמירת הטופס -> מעבר ללוח הבקרה
    navigate('/dashboard'); 
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>הוספת חניה פרטית להשכרה</h3>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="כתובת החניה" value="רח' דיזנגוף 120, תל אביב-יפו" />
        <FormField label="מחיר מבוקש לדקה" value="0.42 ₪" />

        <Button
          label="פרסם חניה להשכרה כעת 🚗"
          background="#059669"
          color="white"
          fullWidth={true}
        />
      </div>
    </form>
  );
}

export default AddParkingScreen;