import type { RepoAnalysis } from '../lib/types';
import { MetricCard } from './MetricCard';
import { ScoreGauge } from './ScoreGauge';
import { ShareButton } from './ShareButton';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface ScoreDisplayProps {
  analysis: RepoAnalysis;
  onReset: () => void;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

function formatDate(iso: string | null): string {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const gradeColors: Record<string, string> = {
  'A+': 'from-green-400 to-emerald-600',
  A: 'from-green-500 to-green-700',
  B: 'from-blue-400 to-blue-600',
  C: 'from-yellow-400 to-yellow-600',
  D: 'from-orange-400 to-orange-600',
  F: 'from-red-400 to-red-600',
};

const METRIC_ICONS = ['🔥', '🐛', '👥', '🕐'];

export function ScoreDisplay({ analysis, onReset }: ScoreDisplayProps): JSX.Element {
  const { score, repoData } = analysis;
  const metrics = Object.values(score.breakdown);
  const animatedTotal = useAnimatedCounter(score.total, 1000);

  return (
    <section className="py-12 px-4 sm:px-6" aria-label="Reliability analysis results">
      <div className="max-w-2xl mx-auto">
        {/* Score header */}
        <div className="text-center mb-10">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <a
              href={repoData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              {analysis.repo}
            </a>
          </p>
          {repoData.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              {repoData.description}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 mb-3">
            <ScoreGauge score={score.total} grade={score.grade} />
            <div className="flex flex-col items-start">
              <span
                className={`text-5xl sm:text-6xl font-extrabold bg-gradient-to-br ${gradeColors[score.grade] ?? 'from-gray-400 to-gray-600'} bg-clip-text text-transparent`}
                aria-label={`Reliability grade: ${score.grade}`}
              >
                {score.grade}
              </span>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {animatedTotal}/100
              </p>
            </div>
          </div>
        </div>

        {/* Repo stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="card p-3 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatNumber(repoData.stargazers_count)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Stars</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatNumber(repoData.forks_count)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Forks</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{repoData.language ?? 'N/A'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Language</p>
          </div>
        </div>

        {/* Metric breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8" aria-label="Score breakdown by category">
          {metrics.map((metric, i) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              score={metric.score}
              max={metric.max}
              description={metric.description}
              icon={METRIC_ICONS[i] ?? '📊'}
            />
          ))}
        </div>

        {/* Additional details */}
        <div className="card p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-8">
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Last Commit:</span> {formatDate(analysis.lastCommitDate)}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Last Release:</span> {formatDate(analysis.lastReleaseDate)}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Commits (90d):</span> {analysis.commitCount}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Contributors:</span> {analysis.contributorCount}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Open / Closed Issues:</span> {analysis.openIssueCount} / {analysis.closedIssueCount}</p>
          {repoData.license && (
            <p><span className="font-medium text-gray-700 dark:text-gray-300">License:</span> {repoData.license.spdx_id}</p>
          )}
        </div>

        {/* Share + Reset */}
        <div className="flex items-center justify-center gap-3">
          <ShareButton analysis={analysis} />
          <button onClick={onReset} className="btn-secondary">
            Analyze Another Repository
          </button>
        </div>
      </div>
    </section>
  );
}
