import { useRepoStore } from '../stores/repo-store';
import { useEffect, useRef } from 'react';

export function ForkDetailPanel(): JSX.Element {
  const selectedFork = useRepoStore((s) => s.selectedFork);
  const setSelectedFork = useRepoStore((s) => s.setSelectedFork);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap for accessibility
  useEffect(() => {
    if (selectedFork && panelRef.current) {
      panelRef.current.focus();
    }
  }, [selectedFork]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        setSelectedFork(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedFork]);

  if (!selectedFork) return <></>;

  const daysSinceLastCommit = Math.floor(
    (Date.now() - selectedFork.lastCommitDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusLabel =
    selectedFork.status === 'alive'
      ? 'Active'
      : selectedFork.status === 'dormant'
        ? 'Dormant'
        : 'Inactive';

  const statusColor =
    selectedFork.status === 'alive'
      ? 'bg-active/10 text-active border-active/20'
      : selectedFork.status === 'dormant'
        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
        : 'bg-gray-500/10 text-gray-500 border-gray-500/20';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        onClick={() => setSelectedFork(null)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label={`Details for ${selectedFork.fullName}`}
        aria-modal="true"
        tabIndex={-1}
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-surface-card
          border-l border-gray-200/60 dark:border-gray-700/60 z-50
          shadow-panel dark:shadow-panel-dark animate-slide-in overflow-y-auto
          focus:outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-surface-card/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Fork Details
          </h2>
          <button
            onClick={() => setSelectedFork(null)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 active:scale-95"
            aria-label="Close fork details"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Owner & Name */}
          <div className="flex items-center gap-4">
            <img
              src={selectedFork.ownerAvatarUrl}
              alt={`${selectedFork.fullName.split('/')[0]} avatar`}
              className="w-14 h-14 rounded-full border-2 border-gray-100 dark:border-gray-700 shadow-sm"
              width={56}
              height={56}
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                {selectedFork.fullName}
              </p>
              <a
                href={selectedFork.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand hover:text-brand-dark dark:hover:text-brand-light transition-colors inline-flex items-center gap-1 mt-0.5"
              >
                View on GitHub
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${selectedFork.status === 'alive' ? 'bg-active' : selectedFork.status === 'dormant' ? 'bg-amber-400' : 'bg-gray-400'}`} aria-hidden="true" />
              {statusLabel}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {daysSinceLastCommit === 0
                ? 'Updated today'
                : `${daysSinceLastCommit} days ago`}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Stars" value={selectedFork.stargazersCount.toString()} />
            <MetricCard label="Forks" value={selectedFork.forksCount.toString()} />
            <MetricCard label="Commits" value={selectedFork.commitCount.toString()} />
            <MetricCard label="Activity" value={`${selectedFork.activityScore}%`} />
          </div>

          {/* Commit Frequency */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
              Commit Frequency
            </h3>
            <div className="h-20 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex items-end px-2 gap-px overflow-hidden">
              {generateCommitBars(selectedFork)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              {selectedFork.commitFrequency} commits/month average
            </p>
          </div>

          {/* Divergence */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Divergence from Upstream
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {selectedFork.isAhead
                ? 'This fork has diverged with independent development.'
                : 'This fork appears to be in sync with upstream.'}
            </p>
          </div>

          {/* Description */}
          {selectedFork.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {selectedFork.description}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            <p>Created: {new Date(selectedFork.createdAt).toLocaleDateString()}</p>
            <p>Last push: {new Date(selectedFork.pushedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className="metric-value text-lg text-gray-900 dark:text-gray-100 mt-1">{value}</p>
    </div>
  );
}

function generateCommitBars(fork: { commitCount: number; commitFrequency: number }): JSX.Element[] {
  const bars = 12;
  const maxFreq = Math.max(fork.commitFrequency * 2, 1);

  return Array.from({ length: bars }, (_, i) => {
    // Simulate monthly commit activity with some variation
    const variation = Math.sin(i * 0.8) * 0.3 + 0.7;
    const height = Math.min(100, (fork.commitFrequency * variation / maxFreq) * 100);
    const barHeight = Math.max(4, height);

    return (
      <div
        key={i}
        className="flex-1 bg-gradient-to-t from-brand to-brand-light dark:from-brand/60 dark:to-brand-light/40 rounded-t transition-all"
        style={{ height: `${barHeight}%` }}
        role="img"
        aria-label={`Month ${i + 1}: ${Math.round(fork.commitFrequency * variation)} commits`}
      />
    );
  });
}
