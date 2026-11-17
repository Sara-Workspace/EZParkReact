interface RentalRowProps {
  plateNumber: string;
  timeAgo: string;
  durationMin: number;
  type: string;
  totalEarnings: string;
  statusLabel?: string;
  isActive?: boolean;
}

function RentalRow({
  plateNumber,
  timeAgo,
  durationMin,
  type,
  totalEarnings,
  statusLabel = 'הושלם בהצלחה',
  isActive = false,
}: RentalRowProps) {
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
            background: isActive ? '#fef3c7' : '#ecfdf5',
            color: isActive ? '#d97706' : '#059669',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          🚗
        </div>
        <div>
          <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {plateNumber}
          </h5>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0 0' }}>
            {timeAgo} • {durationMin} דקות • {type}
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <span
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 900,
            color: isActive ? '#d97706' : '#059669',
          }}
        >
          {totalEarnings} נק׳
        </span>
        <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8' }}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export default RentalRow;