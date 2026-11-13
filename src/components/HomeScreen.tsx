
import { useNavigate } from 'react-router-dom';
import Button from './Button';


function HomeScreen() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'לא מחובר';

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '16px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '576px', margin: '0 auto 40px auto' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            background: '#4f46e5',
            borderRadius: '24px',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            color: 'white',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          🅿️
        </div>
        <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a' }}>
          ברוכים הבאים לחניה בקליק • פארקי
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
          פלטפורמה חכמה למציאת חניות פרטיות והשכרת החניה שלך
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* כרטיס 1: חיפוש חניה */}
        <div
          style={{
            background: '#0f172a',
            color: 'white',
            padding: '24px',
            borderRadius: '24px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              אני מחפש חניה פנויה
            </h3>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '24px' }}>
              אתר חניות פרטיות קרובות ליעד במפה, השווה מחירים והזמן בלחיצת כפתור.
            </p>
          </div>
          <Button
            label="התחל בחיפוש חניה במפה ←"
            onClick={() => navigate('/search')}
            background="#4f46e5"
            color="white"
            fullWidth={true}
          />
        </div>

        {/* כרטיס 2: הוספת חניה */}
        <div
          style={{
            background: '#0f172a',
            color: 'white',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              יש לי חניה להשכיר (פארקי)
            </h3>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '24px' }}>
              הפוך את החניה הפרטית למקור הכנסה נוסף בזמנים שאינך משתמש בה.
            </p>
          </div>
          <Button
            label="הוסף חניה חדשה להשכרה ←"
            onClick={() => navigate('/add-parking')}
            background="#059669"
            color="white"
            fullWidth={true}
          />
        </div>
      </div>

      {/* אזור התחברות */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>התחברות למערכת</h4>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            מחובר כעת: <span style={{ fontFamily: 'monospace', color: '#4f46e5' }}>{userEmail}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button label="החלף חשבון / התחבר מחדש" onClick={() => navigate('/login')} background="#0f172a" color="white" />
          <Button
            label="לוח בקרה והכנסות"
            onClick={() => navigate('/dashboard')}
            background="#eef2ff"
            color="#4338ca"
          />
        </div>
      </div>

     
    </div>
  );
}

export default HomeScreen;