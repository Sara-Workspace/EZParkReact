interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-bold rounded-lg ${isActive ? 'bg-indigo-600' : 'bg-slate-800'}`}
    >
      {label}
    </button>
  );
}

export default TabButton;