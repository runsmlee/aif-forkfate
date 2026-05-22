import { memo } from 'react';

export const Footer = memo(function Footer(): JSX.Element {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-4 sm:px-6" role="contentinfo">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          <span className="font-semibold text-gray-500 dark:text-gray-400">ForkFate</span>
          {' '}— See Which Forks Survived
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
          Fork Survival Scores are computed from real GitHub API data using deterministic metrics.
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
          Results may vary based on GitHub API availability and data freshness.
        </p>
      </div>
    </footer>
  );
});
