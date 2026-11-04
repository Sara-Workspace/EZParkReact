import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. ייבוא ההוקים
import Button from './Button';

function DetailsScreen() {
  const { id } = useParams(); // קבלת ה-ID מהכתובת
  const navigate = useNavigate(); // הפעלת הניווט

  useEffect(() => {
    document.title = `פארקי - פרטי חניה מספר ${id}`; // עדכון כותרת הטאב עם useEffect
  }, [id]);

  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          label="← חזרה למפה"
          onClick={() => navigate(-1)} // חזרה שלב אחד אחורה בהיסטוריה
          background="#e2e8f0"
          color="#0f172a"
        />
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>רח' הרצל 14, תל אביב-יפו (חניה #{id})</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* ... תצוגת מחיר ופירוט ... */}

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
          <Button
            label="אשר הזמנה ותשלום מאובטח 💳"
            onClick={() => navigate('/navigation')} // ניווט למסך הניווט והקוד
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