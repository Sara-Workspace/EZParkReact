// components/NotFound.tsx

import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a' }}>404</h2>
      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px' }}>
        העמוד שחיפשת לא נמצא.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button label="חזור אחורה" onClick={() => navigate(-1)} background="#0f172a" color="white" />
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button label="לדף הבית" background="#4f46e5" color="white" />
        </Link>
      </div>
    </div>
  );
}

export default NotFound;