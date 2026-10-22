import type { Parking } from '../types';
import ParkingCard from './ParkingCard';

interface SearchMapScreenProps {
  parkings: Parking[];
  onSelectParking: (parking: Parking) => void;
}

function SearchMapScreen({ parkings, onSelectParking }: SearchMapScreenProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
        <div className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 w-80">
          רח' הרצל 14, תל אביב-יפו
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">הכל ({parkings.length})</span>
          <span className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs">מקורה בלבד ☂️</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-[420px] bg-slate-200 rounded-2xl border border-slate-300 p-4 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-600 bg-white/80 p-2 rounded-xl inline-block w-fit">
            📍 מפת חניות אינטראקטיבית (תצוגה סטטית)
          </div>
          <div className="flex justify-center items-center h-full">
            <button
              onClick={() => onSelectParking(parkings[0])}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg"
            >
              ₪{parkings[0].pricePerMin.toFixed(2)} / דקה • לחץ לבחירת {parkings[0].title}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase">חניות קרובות ביותר</h4>
          {parkings.map((parking) => (
            <ParkingCard key={parking.id} parking={parking} onSelect={onSelectParking} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchMapScreen;