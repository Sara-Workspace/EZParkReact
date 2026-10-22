import type { Parking } from '../types';

interface DetailsScreenProps {
  parking: Parking;
  onConfirm: () => void;
  onBack: () => void;
}

function DetailsScreen({ parking, onConfirm, onBack }: DetailsScreenProps) {
  const estimatedPrice = parking.pricePerMin * 120;
  const total = estimatedPrice - 5;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <button onClick={onBack} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          ← חזרה למפה
        </button>
        <h3 className="font-bold text-base text-slate-900">{parking.title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-400 block">מחיר לדקה</span>
          <span className="text-2xl font-black text-indigo-600">₪{parking.pricePerMin.toFixed(2)}</span>
          <p className="text-xs text-slate-600 mt-4">
            {parking.isCovered ? 'חניה מקורה עם שער חשמלי אוטומטי.' : 'חניה לא מקורה.'}
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="bg-indigo-50 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span>הערכת זמן (120 דקות)</span>
              <span className="font-bold">₪{estimatedPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>הנחת מנוי</span>
              <span>-₪5.00</span>
            </div>
            <div className="border-t border-indigo-200 pt-2 flex justify-between font-black text-sm">
              <span>סך הכל:</span>
              <span className="text-indigo-600">₪{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition mt-4"
          >
            אשר הזמנה ותשלום מאובטח 💳
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsScreen;