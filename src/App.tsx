import { useEffect } from 'react';
import { RepoInput } from './components/RepoInput';
import { SurvivalScore } from './components/SurvivalScore';
import { EvolutionTree } from './components/EvolutionTree';
import { ForkDetailPanel } from './components/ForkDetailPanel';
import { InfluenceBreakdown } from './components/InfluenceBreakdown';
import { ActivityLegend } from './components/ActivityLegend';
import { ShareCard } from './components/ShareCard';
import { useRepoStore } from './stores/repo-store';
import type { ForkData } from './lib/types';

export default function App(): JSX.Element {
  const repo = useRepoStore((s) => s.repo);
  const forks = useRepoStore((s) => s.forks);
  const loading = useRepoStore((s) => s.loading);
  const scoreResult = useRepoStore((s) => s.scoreResult);
  const darkMode = useRepoStore((s) => s.darkMode);
  const toggleDarkMode = useRepoStore((s) => s.toggleDarkMode);
  const reset = useRepoStore((s) => s.reset);

  // Apply dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const hasData = repo !== null && forks.length > 0;

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-surface-card/90 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-brand">
                <svg
                  className="w-4.5 h-4.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                ForkFate
              </h1>
            </div>
            {hasData && (
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand-light transition-colors ml-1 flex items-center gap-1"
                aria-label="Start new analysis"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                New Analysis
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasData && (
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline truncate max-w-[200px] font-medium">
                {repo.fullName}
              </span>
            )}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Hero Section */}
        {!hasData && !loading && (
          <div className="text-center mb-10 md:mb-16 pt-8 md:pt-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand/10 text-brand dark:text-brand-light text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              Open-source fork analysis
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
              Reveal Your Fork{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark dark:from-brand-light dark:to-brand">
                Survival Score
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Paste any GitHub repo URL and discover which forks are thriving,
              evolving independently, or fading away.
            </p>
          </div>
        )}

        {/* Input Section */}
        <section aria-label="Repository analysis input" className={hasData || loading ? 'mb-8' : 'mb-10 md:mb-16'}>
          <RepoInput />
        </section>

        {/* Loading skeleton for the full page */}
        {loading && (
          <div className="space-y-8">
            <div className="card animate-pulse">
              <div className="skeleton h-10 w-32 mx-auto mb-3" />
              <div className="skeleton h-20 w-48 mx-auto mb-3" />
              <div className="skeleton h-4 w-64 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="skeleton h-3 w-16 mb-3" />
                  <div className="skeleton h-8 w-12" />
                </div>
              ))}
            </div>
            <div className="card animate-pulse">
              <div className="skeleton h-6 w-40 mb-4" />
              <div className="skeleton h-96 w-full" />
            </div>
          </div>
        )}

        {/* Results */}
        {hasData && !loading && (
          <div className="space-y-8 animate-stagger">
            {/* Score Hero */}
            <section aria-label="Fork Survival Score">
              <SurvivalScore />
            </section>

            {/* Influence Breakdown */}
            <section aria-label="Influence breakdown metrics">
              <InfluenceBreakdown />
            </section>

            {/* Activity Legend + Tree */}
            <section aria-label="Evolutionary tree and activity legend">
              <div className="mb-4">
                <ActivityLegend />
              </div>
              <EvolutionTree />
            </section>

            {/* Share Card */}
            {scoreResult && (
              <section aria-label="Share report card">
                <ShareCard />
              </section>
            )}

            {/* Fork List */}
            <section aria-label="All forks">
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    All Forks
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tabular-nums">
                    {forks.length} total
                  </span>
                </div>
                <div className="space-y-1 max-h-[600px] overflow-y-auto -mx-1 px-1">
                  {forks
                    .sort((a, b) => b.activityScore - a.activityScore)
                    .map((fork) => (
                      <ForkListItem key={fork.id} fork={fork} />
                    ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 dark:border-gray-800/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            ForkFate — Open-source fork survival analysis.
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600">
            Data from GitHub API
          </p>
        </div>
      </footer>

      {/* Detail Panel */}
      <ForkDetailPanel />
    </div>
  );
}

function ForkListItem({ fork }: { fork: ForkData }): JSX.Element {
  const setSelectedFork = useRepoStore((s) => s.setSelectedFork);

  const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    alive: {
      bg: 'bg-active-50 dark:bg-active/10',
      text: 'text-active-dark dark:text-active-light',
      dot: 'bg-active',
      label: 'Active',
    },
    dormant: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-400',
      label: 'Dormant',
    },
    dead: {
      bg: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-400 dark:text-gray-500',
      dot: 'bg-gray-300 dark:bg-gray-600',
      label: 'Inactive',
    },
  };

  const config = statusConfig[fork.status] ?? statusConfig.dead;

  return (
    <button
      onClick={() => setSelectedFork(fork)}
      className="w-full text-left flex items-center gap-4 p-3 rounded-xl
        hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-150
        focus:ring-2 focus:ring-brand/40 focus:ring-offset-1 dark:focus:ring-offset-gray-900
        group"
      aria-label={`${fork.fullName} — ${config.label}, ${fork.commitCount} commits`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot} ${fork.status === 'alive' ? 'animate-pulse-slow' : ''}`}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
          {fork.fullName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ★ {fork.stargazersCount}
          </span>
          <span className="text-gray-200 dark:text-gray-700" aria-hidden="true">·</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {fork.commitCount} commits
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        <span className="text-sm font-mono font-semibold text-gray-500 dark:text-gray-400 tabular-nums min-w-[2.5rem] text-right">
          {fork.activityScore}
        </span>
        <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
