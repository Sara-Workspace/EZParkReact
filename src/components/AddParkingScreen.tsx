interface AddParkingScreenProps {
  onPublished: () => void;
}

function AddParkingScreen({ onPublished }: AddParkingScreenProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h3 className="font-bold text-base text-slate-900">הוספת חניה פרטית להשכרה</h3>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">כתובת החניה</label>
          <div className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs">
            רח' דיזנגוף 120, תל אביב-יפו
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">מחיר מבוקש לדקה</label>
          <div className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs">
            0.42 ₪
          </div>
        </div>

        <button
          onClick={onPublished}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition"
        >
          פרסם חניה להשכרה כעת 🚗
        </button>
      </div>
    </div>
  );
}

export default AddParkingScreen;