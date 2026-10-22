import React from 'react';
import type { Rental } from '../types';

interface RentalRowProps {
  rental: Rental;
}

function RentalRow({ rental }: RentalRowProps) {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs">
          🚗
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-900">לוחית רישוי: {rental.plateNumber}</h5>
          <p className="text-[10px] text-slate-500">{rental.timeAgo} • {rental.durationMin} דקות {rental.type}</p>
        </div>
      </div>
      <div className="text-left">
        <span className="block text-xs font-black text-emerald-600">+₪{rental.totalEarnings.toFixed(2)}</span>
        <span className="block text-[9px] text-slate-400">הושלם בהצלחה</span>
      </div>
    </div>
  );
}

export default RentalRow;