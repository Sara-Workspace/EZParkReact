import React from 'react';

interface ButtonProps {
  label: string;
  background: string;
  color: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

function Button({ label, background, color, onClick, fullWidth }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: background,
        color: color,
        border: 'none',
        borderRadius: '12px',
        fontWeight: 700,
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        padding: fullWidth ? '14px' : '10px 20px',
        fontSize: fullWidth ? '14px' : '12px',
      }}
    >
      {label}
    </button>
  );
}

export default Button;