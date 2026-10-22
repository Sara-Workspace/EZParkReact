interface StatCardProps {
  title: string;
  value: string;
  valueClassName: string;
}

function StatCard({ title, value, valueClassName }: StatCardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
      <span className="text-xs text-slate-400 font-bold block">{title}</span>
      <div className={`text-2xl font-black ${valueClassName}`}>{value}</div>
    </div>
  );
}

export default StatCard;