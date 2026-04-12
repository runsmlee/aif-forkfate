interface MetricCardProps {
  label: string;
  score: number;
  max: number;
  description: string;
  icon: string;
}

export function MetricCard({ label, score, max, description, icon }: MetricCardProps): JSX.Element {
  const percentage = Math.round((score / max) * 100);
  const color =
    percentage >= 80
      ? 'text-green-600 bg-green-50'
      : percentage >= 60
        ? 'text-blue-600 bg-blue-50'
        : percentage >= 40
          ? 'text-yellow-600 bg-yellow-50'
          : 'text-red-600 bg-red-50';

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">{icon}</span>
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
          {score}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={max} aria-label={`${label}: ${score} of ${max}`}>
        <div
          className="h-2 rounded-full transition-all duration-500 ease-out bg-brand-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
