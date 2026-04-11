import { useState, useCallback, type FormEvent } from 'react';
import { useRepoStore } from '../stores/repo-store';

export function RepoInput(): JSX.Element {
  const repoUrl = useRepoStore((s) => s.repoUrl);
  const setRepoUrl = useRepoStore((s) => s.setRepoUrl);
  const loading = useRepoStore((s) => s.loading);
  const loadingProgress = useRepoStore((s) => s.loadingProgress);
  const loadingTotal = useRepoStore((s) => s.loadingTotal);
  const error = useRepoStore((s) => s.error);
  const analyze = useRepoStore((s) => s.analyze);

  const [touched, setTouched] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setTouched(true);
      if (repoUrl.trim()) {
        analyze();
      }
    },
    [analyze, repoUrl]
  );

  const progressPercent =
    loadingTotal > 0 ? Math.round((loadingProgress / loadingTotal) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} role="search" aria-label="Analyze GitHub repository">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <label htmlFor="repo-url" className="sr-only">
              GitHub Repository URL
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <input
              id="repo-url"
              type="url"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full pl-11 pr-4 h-12 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:ring-2 focus:ring-brand/30 focus:border-brand
                hover:border-gray-300 dark:hover:border-gray-600
                transition-all duration-200 text-base shadow-card"
              disabled={loading}
              aria-describedby={error ? 'repo-error' : undefined}
              aria-invalid={error ? 'true' : 'false'}
              autoComplete="url"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repoUrl.trim()}
            className="h-12 px-8 bg-brand hover:bg-brand-dark active:bg-brand-dark text-white font-semibold rounded-xl
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200 focus:ring-2 focus:ring-brand/40 focus:ring-offset-2
              dark:focus:ring-offset-gray-900 min-w-[140px] flex items-center justify-center gap-2
              shadow-brand hover:shadow-md active:scale-[0.98]"
            aria-label={loading ? 'Analyzing repository...' : 'Analyze repository'}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                Analyze
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>

        {loading && loadingTotal > 0 && (
          <div className="mt-4" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Loading forks: {loadingProgress} / {loadingTotal}
            </p>
          </div>
        )}

        {error && (
          <div
            id="repo-error"
            role="alert"
            className="mt-4 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl"
          >
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {touched && !loading && !error && repoUrl.trim() === '' && (
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Please enter a GitHub repository URL to analyze.
          </p>
        )}
      </form>
    </div>
  );
}
