import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
        {title}
      </span>
      {children}
    </div>
  );
}

export default InfoCard;