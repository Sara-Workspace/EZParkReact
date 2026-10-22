import type { Rental } from '../types';
import RentalRow from './RentalRow';
import StatCard from './StatCard';

interface DashboardScreenProps {
  rentals: Rental[];
}

function DashboardScreen({ rentals }: DashboardScreenProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="הכנסות החודש" value="₪612.40" valueClassName="text-indigo-600" />
        <StatCard title="השכרות פעילות" value="24 השכרות" valueClassName="text-emerald-600" />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
        <h4 className="text-sm font-bold text-slate-900">השכרות אחרונות במערכת</h4>
        {rentals.map((rental) => (
          <RentalRow key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
}

export default DashboardScreen;