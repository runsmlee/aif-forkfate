import { lazy, Suspense, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RecentAnalyses } from './components/RecentAnalyses';
import { Footer } from './components/Footer';
import { AnalysisSkeleton } from './components/Skeleton';
import { useRepoAnalysis } from './hooks/useRepoAnalysis';

const ScoreDisplay = lazy(() =>
  import('./components/ScoreDisplay').then((m) => ({ default: m.ScoreDisplay }))
);

const HowItWorks = lazy(() =>
  import('./components/HowItWorks').then((m) => ({ default: m.HowItWorks }))
);

declare global {
  interface Window {
    aif?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export default function App(): JSX.Element {
  const { history, currentAnalysis, status, error, analyze, reset, clearHistory } = useRepoAnalysis();
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Store ref to the search input in the Hero component
  useEffect(() => {
    const input = document.getElementById('repo-input') as HTMLInputElement | null;
    if (input) {
      inputRef.current = input;
    }
  }, [currentAnalysis]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {status === 'loading' && !currentAnalysis && <AnalysisSkeleton />}

        {status !== 'loading' && !currentAnalysis && (
          <>
            <Hero onAnalyze={handleAnalyze} status={status} />

            {error && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-6" role="alert">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}

            <RecentAnalyses
              history={history}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
            />

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
