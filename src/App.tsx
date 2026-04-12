import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ScoreDisplay } from './components/ScoreDisplay';
import { RecentAnalyses } from './components/RecentAnalyses';
import { Footer } from './components/Footer';
import { useRepoAnalysis } from './hooks/useRepoAnalysis';

declare global {
  interface Window {
    aif?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export default function App(): JSX.Element {
  const { history, currentAnalysis, status, error, analyze, reset, clearHistory } = useRepoAnalysis();

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {!currentAnalysis && (
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
          </>
        )}

        {currentAnalysis && (
          <ScoreDisplay
            analysis={currentAnalysis}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
