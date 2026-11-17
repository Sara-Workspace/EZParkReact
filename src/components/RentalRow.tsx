

interface RentalRowProps {
  plateNumber: string;
  timeAgo: string;
  durationMin: number;
  type: string;
  totalEarnings: string;
}

function RentalRow({ plateNumber, timeAgo, durationMin, type, totalEarnings }: RentalRowProps) {
  return (
    <div
      style={{
        background: 'white',
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            background: '#ecfdf5',
            color: '#059669',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          🚗
        </div>
        <div>
          <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
            לוחית רישוי: {plateNumber}
          </h5>
          <p style={{ fontSize: '10px', color: '#64748b' }}>
            {timeAgo} • {durationMin} דקות {type}
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#059669' }}>
          +₪{totalEarnings}
        </span>
        <span style={{ display: 'block', fontSize: '9px', color: '#94a3b8' }}>הושלם בהצלחה</span>
      </div>
    </div>
  );
}

export default RentalRow;