interface RentalRowProps {
  plateNumber: string;
  timeAgo: string;
  durationMin: number;
  type: string;
  totalEarnings: string;
  statusLabel?: string;
  isActive?: boolean;
  isIncome?: boolean;
}

function RentalRow({
  plateNumber,
  timeAgo,
  durationMin,
  type,
  totalEarnings,
  statusLabel = 'הושלם בהצלחה',
  isActive = false,
  isIncome = true,
}: RentalRowProps) {
  const amountColor = isActive ? '#d97706' : isIncome ? '#059669' : '#dc2626';
  const sign = isIncome ? '+' : '-';

  return (
    <div
      style={{
        background: 'white',
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid #dfe8f3',
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
            background: isActive ? '#fef3c7' : isIncome ? '#ecfdf5' : '#fef2f2',
            color: amountColor,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          {isIncome ? '🏠' : '🚗'}
        </div>
        <div>
          <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0a2540', margin: 0 }}>
            {plateNumber}{' '}
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#5a6b82' }}>
              ({isIncome ? 'השכרת חניה שלי' : 'חניתי אצל אחר'})
            </span>
          </h5>
          <p style={{ fontSize: '11px', color: '#5a6b82', margin: '3px 0 0 0' }}>
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
            color: amountColor,
          }}
        >
          {sign}{totalEarnings} ₪
        </span>
        <span style={{ display: 'block', fontSize: '10px', color: '#8fa1b8' }}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export default RentalRow;