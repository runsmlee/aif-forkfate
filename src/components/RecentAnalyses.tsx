import type { RepoAnalysis } from '../lib/types';

interface RecentAnalysesProps {
  history: RepoAnalysis[];
  onSelect: (repo: string) => void;
  onClear: () => void;
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'B':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'C':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'D':
      return 'text-orange-700 bg-orange-50 border-orange-200';
    default:
      return 'text-red-700 bg-red-50 border-red-200';
  }
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentAnalyses({ history, onSelect, onClear }: RecentAnalysesProps): JSX.Element {
  if (history.length === 0) return <></>;

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16" aria-label="Recent analyses">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Analyses</h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Clear analysis history"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-2">
        {history.map((a) => (
          <button
            key={`${a.repo}-${a.timestamp}`}
            onClick={() => onSelect(a.repo)}
            className="w-full card p-3 flex items-center justify-between hover:shadow-md transition-shadow text-left"
          >
            <div className="min-w-0 flex-1 mr-3">
              <p className="text-sm font-medium text-gray-900 truncate">{a.repo}</p>
              <p className="text-xs text-gray-400">{timeAgo(a.timestamp)}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-lg font-bold text-gray-900">{a.score.total}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getGradeColor(a.score.grade)}`}>
                {a.score.grade}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
