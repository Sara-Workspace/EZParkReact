
interface StatCardProps {
  title: string;
  value: string;
  valueColor: string;
}

function StatCard({ title, value, valueColor }: StatCardProps) {
  return (
    <div
      style={{
        background: '#f6faff',
        border: '1px solid #dfe8f3',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#8fa1b8' }}>
        {title}
      </span>
      <div style={{ fontSize: '24px', fontWeight: 900, color: valueColor }}>{value}</div>
    </div>
  );
}

export default StatCard;