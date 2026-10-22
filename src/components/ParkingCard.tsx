import React from 'react';

interface ParkingCardProps {
  id: number;
  title: string;
  distance: string;
  walkTime: string;
  rating: number;
  pricePerMin: string;
}

function ParkingCard({ id, title, distance, walkTime, rating, pricePerMin }: ParkingCardProps) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            background: '#eef2ff',
            color: '#4f46e5',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 900,
          }}
        >
          {id}
        </div>
        <div>
          <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{title}</h5>
          <p style={{ fontSize: '10px', color: '#64748b' }}>
            {distance} • {walkTime} • ⭐ {rating}
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#4f46e5' }}>
          ₪{pricePerMin}
        </span>
        <span style={{ display: 'block', fontSize: '9px', color: '#94a3b8' }}>לדקה</span>
      </div>
    </div>
  );
}

export default ParkingCard;