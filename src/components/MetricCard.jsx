const MetricCard = ({ title, value, unit, icon, color = 'primary', subtitle }) => {
  const colorClasses = {
    primary: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${colorClasses[color]} transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80">{title}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          {unit && <span className="text-lg opacity-70">{unit}</span>}
        </div>
        {subtitle && (
          <p className="text-sm mt-2 opacity-80">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

