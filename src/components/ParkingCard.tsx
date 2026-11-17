
import { useNavigate } from 'react-router-dom'; // 1. ייבוא ההוק

interface ParkingCardProps {
  id: number;
  title: string;
  distance: string;
  walkTime: string;
  pricePerMin: string;
}

function ParkingCard({ id, title, distance, walkTime, pricePerMin }: ParkingCardProps) {
  const navigate = useNavigate(); // 2. הפעלת ההוק

  return (
    <div
      onClick={() => navigate(`/parking/${id}`)} // 3. ניווט דינמי עם פרמטר id
      style={{
        cursor: 'pointer', // הפיכת הסמן ליד בלחיצה
        background: 'white',
        border: '1px solid #dfe8f3',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: '#eaf3ff', color: '#0a6cf0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
          {id}
        </div>
        <div>
          <h5 style={{ fontSize: '12px', fontWeight: 700 }}>{title}</h5>
          <p style={{ fontSize: '10px', color: '#5a6b82' }}>{distance} • {walkTime} • {walkTime}</p>
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#0a6cf0' }}>₪{pricePerMin}</span>
        <span style={{ display: 'block', fontSize: '9px', color: '#8fa1b8' }}>לדקה</span>
      </div>
    </div>
  );
}

export default ParkingCard;