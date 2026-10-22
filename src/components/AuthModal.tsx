import React from 'react';

import Button from './Button';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const accounts: string[] = ['driver@parking.co.il', 'owner@parking.co.il'];

function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        background: 'rgba(2, 6, 23, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          maxWidth: '448px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center' }}>בחירת חשבון</h2>
        {accounts.map((email) => (
          <Button
            key={email}
            label={email}
            onClick={() => {
              onLoginSuccess(email);
              onClose();
            }}
            background="#4f46e5"
            color="white"
            fullWidth={true}
          />
        ))}
        <Button
          label="ביטול"
          onClick={onClose}
          background="#f1f5f9"
          color="#0f172a"
          fullWidth={true}
        />
      </div>
    </div>
  );
}

export default AuthModal;