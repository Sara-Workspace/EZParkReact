import React from 'react';
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 700,
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
        background: isActive ? '#4f46e5' : '#1e293b',
      }}
    >
      {label}
    </button>
  );
}

export default TabButton;