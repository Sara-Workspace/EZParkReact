import React from 'react';

interface ScreenSectionProps {
  title: string;
  children: React.ReactNode;
}

function ScreenSection({ title, children }: ScreenSectionProps) {
  return (
    <section
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
      }}
    >
      <h2
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#4f46e5',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default ScreenSection;