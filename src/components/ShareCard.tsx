import { useRepoStore } from '../stores/repo-store';
import { useState, useCallback } from 'react';

export function ShareCard(): JSX.Element {
  const scoreResult = useRepoStore((s) => s.scoreResult);
  const repo = useRepoStore((s) => s.repo);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!repo || !scoreResult) return;

    const shareText = `🐛 ForkFate Report: ${repo.fullName}\n` +
      `Survival Score: ${scoreResult.score}%\n` +
      `Total Forks: ${scoreResult.totalForks} | Active: ${scoreResult.activeForks}\n` +
      `Analyze your repo: forkfate.dev`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text area
      const textarea = document.querySelector<HTMLTextAreaElement>('#share-text');
      textarea?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [repo, scoreResult]);

  if (!scoreResult || !repo) return <></>;

  const scoreColor =
    scoreResult.score >= 40
      ? 'text-active-dark dark:text-active-light border-active/30'
      : scoreResult.score >= 20
        ? 'text-amber-500 border-amber-500/30'
        : 'text-brand border-brand/30';

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Share Report
      </h2>

      {/* OG Card Preview */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-1.5">
              ForkFate Report
            </p>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
              {repo.fullName}
            </p>
          </div>
          <div className={`text-right border-l-2 pl-4 ${scoreColor}`}>
            <p className="metric-value text-3xl">{scoreResult.score}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Survival</p>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{scoreResult.totalForks}</span> forks
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-active-dark dark:text-active-light">{scoreResult.activeForks}</span> active
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{scoreResult.derivativeProjects}</span> derivatives
          </span>
        </div>
      </div>

      {/* Share Actions */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-4
            bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
            rounded-xl text-sm font-medium transition-all duration-200
            focus:ring-2 focus:ring-brand/40 focus:ring-offset-1 dark:focus:ring-offset-gray-900
            active:scale-[0.98]"
          aria-label={copied ? 'Copied to clipboard' : 'Copy share text'}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-active-dark dark:text-active-light">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Report
            </>
          )}
        </button>
        <button
          onClick={() => {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `ForkFate: ${repo.fullName} has a ${scoreResult.score}% fork survival score with ${scoreResult.activeForks} active forks!`
            )}&hashtags=ForkFate`;
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          className="h-11 w-11 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
            rounded-xl transition-all duration-200
            focus:ring-2 focus:ring-brand/40 focus:ring-offset-1 dark:focus:ring-offset-gray-900
            active:scale-[0.98]"
          aria-label="Share on Twitter"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
      </div>

      <textarea
        id="share-text"
        className="sr-only"
        readOnly
        value={`ForkFate Report: ${repo.fullName}\nSurvival Score: ${scoreResult.score}%\nTotal Forks: ${scoreResult.totalForks} | Active: ${scoreResult.activeForks}`}
        aria-hidden="true"
      />
    </div>
  );
}
