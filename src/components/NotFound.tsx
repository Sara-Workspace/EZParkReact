// components/NotFound.tsx

import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0a2540' }}>404</h2>
      <p style={{ fontSize: '16px', color: '#5a6b82', marginBottom: '24px' }}>
        העמוד שחיפשת לא נמצא.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button label="חזור אחורה" onClick={() => navigate(-1)} background="#0a2540" color="white" />
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <Button label="לדף הבית" background="#0a6cf0" color="white" />
        </Link>
      </div>
    </div>
  );
}

export default NotFound;