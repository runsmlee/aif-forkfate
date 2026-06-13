import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { useManualAnalysis } from './hooks/useRepoAnalysis';
import type { ManualSignals, ReliabilityScore } from './lib/types';

const HowItWorks = lazy(() =>
  import('./components/HowItWorks').then((m) => ({ default: m.HowItWorks }))
);

const RecentAnalyses = lazy(() =>
  import('./components/RecentAnalyses').then((m) => ({ default: m.RecentAnalyses }))
);

export default function App(): JSX.Element {
  const { history, saveToHistory, clearHistory } = useManualAnalysis();
  const [initialSignals, setInitialSignals] = useState<ManualSignals | undefined>(undefined);

  const handleScoreComputed = useCallback(
    (score: ReliabilityScore, signals: ManualSignals) => {
      // Auto-save to history when score is computed with real data
      const hasData =
        signals.commitsLast90Days > 0 ||
        signals.daysSinceLastCommit > 0 ||
        signals.openIssues > 0 ||
        signals.closedIssues > 0 ||
        signals.contributors > 0;
      if (hasData) {
        saveToHistory(score, signals);
      }
    },
    [saveToHistory]
  );

  const handleSelectHistory = useCallback(
    (entry: { signals: ManualSignals }) => {
      setInitialSignals(entry.signals);
      window.aif?.track('select_history');
    },
    []
  );

  // Track page_view on mount
  useEffect(() => {
    window.aif?.track('page_view', { path: window.location.pathname });
  }, []);

  // Update document title
  useEffect(() => {
    document.title = 'CommitCasualty — Open-Source Reliability Score';
  }, []);

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
        <Hero
          key={initialSignals ? JSON.stringify(initialSignals) : 'default'}
          onScoreComputed={handleScoreComputed}
          initialSignals={initialSignals}
        />

        <Suspense fallback={null}>
          <RecentAnalyses
            history={history}
            onSelect={handleSelectHistory}
            onClear={clearHistory}
          />
        </Suspense>

        <Suspense fallback={null}>
          <HowItWorks />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
