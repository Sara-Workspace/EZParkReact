import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './Button';

interface ParkingSpot {
  spotId: number;
  ownerId: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  evCharger: boolean;
  basePricePerHour: number;
  isActive: boolean;
  image?: string;
}

const API_BASE_URL = 'https://localhost:7036/api';

function DetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState<boolean>(false);

  // 1. שליפת פרטי חניה בודדת בטעינת הרכיב
  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ParkingSpots/${id}`);
        if (!response.ok) {
          throw new Error('החניה לא נמצאה בשרת');
        }
        const data: ParkingSpot = await response.json();
        setSpot(data);
        document.title = `פארקי - ${data.address}, ${data.city}`;
      } catch (err: any) {
        setError(err.message || 'שגיאה בטעינת נתוני החניה');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpotDetails();
    }
  }, [id]);

  // 2. ביצוע הזמנת חניה מול ה-Backend בבקשת POST
  const handleReserve = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('יש להתחבר כמערכת לפני ביצוע הזמנה');
      return;
    }

    setReserving(true);
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + 60 * 60 * 1000); // ברירת מחדל: שעה מהיום

      const reservationDto = {
        spotID: Number(id),
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
        useCharging: spot?.evCharger || false,
      };

      const response = await fetch(`${API_BASE_URL}/Reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reservationDto),
      });

      if (!response.ok) {
        throw new Error('ביצוע ההזמנה נכשל. ודא כי הנך מחובר כנהג.');
      }

      // מעבר לעמוד הניווט לאחר הצלחה
      navigate('/navigation');
    } catch (err: any) {
      alert(err.message || 'שגיאה בביצוע ההזמנה');
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>טוען פרטי חניה...</div>;
  if (error || !spot) return <div style={{ padding: '24px', color: 'red', textAlign: 'center' }}>{error || 'חניה לא נמצאה'}</div>;

  const pricePerMin = (spot.basePricePerHour / 60).toFixed(2);

  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          label="← חזרה למפה"
          onClick={() => navigate(-1)}
          background="#e2e8f0"
          color="#0f172a"
        />
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
          {spot.address}, {spot.city} (חניה #{spot.spotId})
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* תצוגת פרטי החניה */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700 }}>פרטי הדירות והמחיר</h4>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>מחיר לשעה:</strong> ₪{spot.basePricePerHour}</p>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>מחיר לדקה:</strong> ₪{pricePerMin}</p>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>עמדת טעינה:</strong> {spot.evCharger ? 'קיימת ⚡' : 'ללא'}</p>
          <p style={{ fontSize: '14px', margin: 0 }}><strong>סטטוס זמינות:</strong> {spot.isActive ? 'פעיל ✅' : 'לא פעיל ❌'}</p>
        </div>

        {/* טופס אישור הזמנה */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Button
            label={reserving ? 'מבצע הזמנה...' : 'אשר הזמנה ותשלום מאובטח 💳'}
            onClick={handleReserve}
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