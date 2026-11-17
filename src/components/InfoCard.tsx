import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div
      style={{
        background: '#f6faff',
        border: '1px solid #dfe8f3',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#8fa1b8' }}>
        {title}
      </span>
      {children}
    </div>
  );
}

export default InfoCard;