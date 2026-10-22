interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const accounts: string[] = ['driver@parking.co.il', 'owner@parking.co.il'];

function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">בחירת חשבון</h2>
        {accounts.map((email) => (
          <button
            key={email}
            onClick={() => {
              onLoginSuccess(email);
              onClose();
            }}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs"
          >
            {email}
          </button>
        ))}
        <button onClick={onClose} className="w-full bg-slate-100 py-3 rounded-xl text-xs">
          ביטול
        </button>
      </div>
    </div>
  );
}

export default AuthModal;