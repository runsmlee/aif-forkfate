import { memo } from 'react';

interface MetricCardProps {
  label: string;
  score: number;
  max: number;
  description: string;
  icon: string;
}

function getMetricColor(percentage: number): { bg: string; bar: string; badge: string } {
  if (percentage >= 80) {
    return {
      bg: 'bg-green-50 dark:bg-green-900/20',
      bar: 'bg-green-500',
      badge: 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/40',
    };
  }
  if (percentage >= 60) {
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      bar: 'bg-blue-500',
      badge: 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40',
    };
  }
  if (percentage >= 40) {
    return {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      bar: 'bg-yellow-500',
      badge: 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/40',
    };
  }
  return {
    bg: 'bg-red-50 dark:bg-red-900/20',
    bar: 'bg-red-500',
    badge: 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40',
  };
}

export const MetricCard = memo(function MetricCard({ label, score, max, description, icon }: MetricCardProps): JSX.Element {
  const percentage = Math.round((score / max) * 100);
  const colors = getMetricColor(percentage);

  return (
    <div className="card p-4 sm:p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">{icon}</span>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
          {score}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2.5" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={max} aria-label={`${label}: ${score} of ${max}`}>
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out-expo ${colors.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
});
