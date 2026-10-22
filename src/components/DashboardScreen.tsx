import React from 'react';
import RentalRow from './RentalRow';
import StatCard from './StatCard';

interface Rental {
  id: number;
  plateNumber: string;
  timeAgo: string;
  durationMin: number;
  type: string;
  totalEarnings: string;
}

const rentals: Rental[] = [
  { id: 1, plateNumber: '12-345-67', timeAgo: 'לפני שעתיים', durationMin: 90, type: 'השכרה רגילה', totalEarnings: '36.00' },
  { id: 2, plateNumber: '89-012-34', timeAgo: 'אתמול', durationMin: 120, type: 'השכרה רגילה', totalEarnings: '48.00' },
  { id: 3, plateNumber: '55-678-90', timeAgo: 'לפני 3 ימים', durationMin: 45, type: 'השכרה קצרה', totalEarnings: '18.90' },
];

function DashboardScreen() {
  return (
    <div
      style={{
        maxWidth: '1024px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <StatCard title="הכנסות החודש" value="₪612.40" valueColor="#4f46e5" />
        <StatCard title="השכרות פעילות" value="24 השכרות" valueColor="#059669" />
      </div>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
          השכרות אחרונות במערכת
        </h4>
        {rentals.map((rental) => (
          <RentalRow
            key={rental.id}
            plateNumber={rental.plateNumber}
            timeAgo={rental.timeAgo}
            durationMin={rental.durationMin}
            type={rental.type}
            totalEarnings={rental.totalEarnings}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardScreen;