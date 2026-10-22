import React from 'react';

interface NavigationScreenProps {
  onHome: () => void;
}

function NavigationScreen({ onHome }: NavigationScreenProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
        <h3 className="text-xl font-black text-slate-900">החניה שוריינה עבורך בהצלחה! 🎉</h3>
        <p className="text-xs text-slate-600 mt-1">קוד הכניסה נוצר ופעיל כעת.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
          <span className="text-xs text-slate-400 font-bold block">זמן שנותר להגעה</span>
          <div className="text-4xl font-black text-indigo-600 font-mono my-3">06:42</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
          <span className="text-xs text-slate-400 font-bold block">קוד כניסה לשער</span>
          <div className="text-3xl font-black font-mono my-2 bg-white px-4 py-2 rounded-xl border border-slate-300">
            7 2 8 4
          </div>
        </div>
      </div>

      <button onClick={onHome} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm">
        חזרה למסך הבית
      </button>
    </div>
  );
}

export default NavigationScreen;