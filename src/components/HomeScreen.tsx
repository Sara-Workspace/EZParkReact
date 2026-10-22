import { SCREEN_SEARCH, SCREEN_ADD, SCREEN_DASHBOARD } from '../constants';

interface HomeScreenProps {
  onNavigate: (screenNumber: number) => void;
  onOpenAuth: () => void;
  userEmail: string;
}

function HomeScreen({ onNavigate, onOpenAuth, userEmail }: HomeScreenProps) {
  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl shadow-xl mb-4">
          🅿️
        </div>
        <h2 className="text-3xl font-black text-slate-900">ברוכים הבאים לחניה בקליק • פארקי</h2>
        <p className="text-sm text-slate-500 mt-2">פלטפורמה חכמה למציאת חניות פרטיות והשכרת החניה שלך</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">אני מחפש חניה פנויה</h3>
            <p className="text-xs text-slate-300 mb-6">אתר חניות פרטיות קרובות ליעד במפה, השווה מחירים והזמן בלחיצת כפתור.</p>
          </div>
          <button 
            onClick={() => onNavigate(SCREEN_SEARCH)} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition"
          >
            התחל בחיפוש חניה במפה ←
          </button>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between border border-emerald-500/30">
          <div>
            <h3 className="text-xl font-bold mb-2">יש לי חניה להשכיר (פארקי)</h3>
            <p className="text-xs text-slate-300 mb-6">הפוך את החניה הפרטית למקור הכנסה נוסף בזמנים שאינך משתמש בה.</p>
          </div>
          <button 
            onClick={() => onNavigate(SCREEN_ADD)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm transition"
          >
            הוסף חניה חדשה להשכרה ←
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">התחברות למערכת</h4>
          <p className="text-xs text-slate-500">מחובר כעת: <span className="font-mono text-indigo-600">{userEmail}</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={onOpenAuth} className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs">
            החלף חשבון / התחבר מחדש
          </button>
          <button onClick={() => onNavigate(SCREEN_DASHBOARD)} className="bg-indigo-50 text-indigo-700 font-bold px-5 py-2.5 rounded-xl text-xs">
            לוח בקרה והכנסות
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;