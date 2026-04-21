import { lazy, Suspense, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import type { HeroHandle } from './components/Hero';
import { Footer } from './components/Footer';
import { AnalysisSkeleton } from './components/Skeleton';
import { useRepoAnalysis } from './hooks/useRepoAnalysis';

const ScoreDisplay = lazy(() =>
  import('./components/ScoreDisplay').then((m) => ({ default: m.ScoreDisplay }))
);

const HowItWorks = lazy(() =>
  import('./components/HowItWorks').then((m) => ({ default: m.HowItWorks }))
);

const RecentAnalyses = lazy(() =>
  import('./components/RecentAnalyses').then((m) => ({ default: m.RecentAnalyses }))
);

declare global {
  interface Window {
    aif?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export default function App(): JSX.Element {
  const { history, currentAnalysis, status, error, analyze, reset, clearHistory, dismissError } = useRepoAnalysis();
  const heroRef = useRef<HeroHandle>(null);

  const handleAnalyze = (repo: string) => {
    analyze(repo);
    window.aif?.track('analyze', { repo });
  };

  const handleReset = () => {
    window.aif?.track('reset');
    reset();
  };

  const handleSelectHistory = (repo: string) => {
    window.aif?.track('select_history', { repo });
    analyze(repo);
  };

  const handleClearHistory = () => {
    window.aif?.track('clear_history');
    clearHistory();
  };

  // Keyboard shortcut: "/" to focus search input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't capture "/" when user is typing in an input or textarea
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      heroRef.current?.focusInput();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update document title when viewing analysis
  useEffect(() => {
    if (currentAnalysis) {
      document.title = `${currentAnalysis.repo} — Score ${currentAnalysis.score.total}/100 (${currentAnalysis.score.grade}) | CommitCasualty`;
    } else {
      document.title = 'CommitCasualty — Instantly Quantify Open-Source Reliability';
    }
  }, [currentAnalysis]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-md focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <Header />

      <main id="main-content" className="flex-1">
        {status === 'loading' && !currentAnalysis && (
          <div aria-live="polite">
            <AnalysisSkeleton />
          </div>
        )}

        {status !== 'loading' && !currentAnalysis && (
          <>
            <Hero ref={heroRef} onAnalyze={handleAnalyze} status={status} />

            {error && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-6" aria-live="polite">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-400 flex items-start justify-between gap-3" role="alert">
                  <p>{error}</p>
                  <button
                    onClick={dismissError}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors flex-shrink-0"
                    aria-label="Dismiss error"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <Suspense fallback={null}>
              <RecentAnalyses
                history={history}
                onSelect={handleSelectHistory}
                onClear={handleClearHistory}
              />
            </Suspense>

            <Suspense fallback={null}>
              <HowItWorks />
            </Suspense>
          </>
        )}

        {currentAnalysis && (
          <Suspense fallback={<AnalysisSkeleton />}>
            <ScoreDisplay
              analysis={currentAnalysis}
              onReset={handleReset}
            />
          </Suspense>
        )}
      </main>

      <Footer />
    </div>
  );
}
