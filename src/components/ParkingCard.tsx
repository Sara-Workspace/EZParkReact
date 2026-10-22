import type { Parking } from '../types';

interface ParkingCardProps {
  parking: Parking;
  onSelect: (parking: Parking) => void;
}

function ParkingCard({ parking, onSelect }: ParkingCardProps) {
  return (
    <div
      onClick={() => onSelect(parking)}
      className="bg-white hover:border-indigo-500 border border-slate-200 rounded-xl p-3 shadow-sm cursor-pointer transition flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm">
          {parking.id}
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-900">{parking.title}</h5>
          <p className="text-[10px] text-slate-500">
            {parking.distance} • {parking.walkTime} • ⭐ {parking.rating}
          </p>
        </div>
      </div>
      <div className="text-left">
        <span className="block text-xs font-black text-indigo-600">₪{parking.pricePerMin.toFixed(2)}</span>
        <span className="block text-[9px] text-slate-400">לדקה</span>
      </div>
    </div>
  );
}

export default ParkingCard;