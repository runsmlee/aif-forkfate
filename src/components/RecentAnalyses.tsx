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
      return 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800';
    case 'B':
      return 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800';
    case 'C':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800';
    case 'D':
      return 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30 dark:border-orange-800';
    default:
      return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800';
  }
}

function getScoreColor(grade: string): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-green-600 dark:text-green-400';
    case 'B':
      return 'text-blue-600 dark:text-blue-400';
    case 'C':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'D':
      return 'text-orange-600 dark:text-orange-400';
    default:
      return 'text-red-600 dark:text-red-400';
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
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 animate-fade-in" aria-label="Recent analyses">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Analyses</h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 -mr-2 rounded hover:bg-red-50 dark:hover:bg-red-900/10"
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
            className="w-full card p-3 flex items-center justify-between hover:shadow-card-hover active:shadow-card transition-all duration-200 text-left group"
          >
            <div className="min-w-0 flex-1 mr-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{a.repo}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(a.timestamp)}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-lg font-bold tabular-nums ${getScoreColor(a.score.grade)}`}>{a.score.total}</span>
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
