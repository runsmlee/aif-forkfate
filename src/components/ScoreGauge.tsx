import { memo } from 'react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

const GRADE_COLORS: Record<string, string> = {
  'A+': '#10B981',
  A: '#22C55E',
  B: '#3B82F6',
  C: '#F59E0B',
  D: '#F97316',
  F: '#EF4444',
};

function getGradeColor(grade: string): string {
  return GRADE_COLORS[grade] ?? '#9CA3AF';
}

export const ScoreGauge = memo(function ScoreGauge({ score, grade }: ScoreGaugeProps): JSX.Element {
  const radius = 54;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getGradeColor(grade);
  const size = radius * 2;
  const displayScore = Math.min(100, Math.max(0, score));

  return (
    <div className="relative inline-flex items-center justify-center" aria-label={`Score gauge: ${score} out of 100, grade ${grade}`} role="img">
      <svg height={size} width={size} className="-rotate-90" aria-hidden="true">
        <circle stroke="#F3F4F6" fill="transparent" strokeWidth={strokeWidth} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-extrabold" style={{ color }}>{displayScore}</span>
        <span className="text-xs font-bold text-gray-500 mt-0.5">{grade}</span>
      </div>
    </div>
  );
});
