import React from 'react';
import ParkingCard from './ParkingCard';

interface Parking {
  id: number;
  title: string;
  distance: string;
  walkTime: string;
  rating: number;
  pricePerMin: string;
}

const parkings: Parking[] = [
  { id: 1, title: 'חניון הרצל 14', distance: "200 מ'", walkTime: "3 דק' הליכה", rating: 4.8, pricePerMin: '0.40' },
  { id: 2, title: 'חניה פרטית ברוטשילד', distance: "350 מ'", walkTime: "5 דק' הליכה", rating: 4.5, pricePerMin: '0.35' },
  { id: 3, title: 'חניון שוק הכרמל', distance: "500 מ'", walkTime: "7 דק' הליכה", rating: 4.2, pricePerMin: '0.28' },
  { id: 4, title: 'חניה מקורה בדיזנגוף', distance: "650 מ'", walkTime: "9 דק' הליכה", rating: 4.6, pricePerMin: '0.45' },
];

function SearchMapScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
        <div
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e293b',
            width: '320px',
          }}
        >
          רח' הרצל 14, תל אביב-יפו
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              padding: '8px 12px',
              background: '#4f46e5',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            הכל ({parkings.length})
          </span>
          <span
            style={{
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          >
            מקורה בלבד ☂️
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div
          style={{
            height: '420px',
            background: '#e2e8f0',
            border: '1px solid #cbd5e1',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#475569',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '8px',
              borderRadius: '12px',
              width: 'fit-content',
            }}
          >
            📍 מפת חניות אינטראקטיבית (תצוגה סטטית)
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                background: '#4f46e5',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              ₪0.40 / דקה • חניון הרצל 14
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
            חניות קרובות ביותר
          </h4>
          {parkings.map((parking) => (
            <ParkingCard
              key={parking.id}
              id={parking.id}
              title={parking.title}
              distance={parking.distance}
              walkTime={parking.walkTime}
              rating={parking.rating}
              pricePerMin={parking.pricePerMin}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchMapScreen;