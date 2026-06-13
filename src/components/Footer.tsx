import { memo } from 'react';

export const Footer = memo(function Footer(): JSX.Element {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-4 sm:px-6" role="contentinfo">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          <span className="font-semibold text-gray-500 dark:text-gray-400">CommitCasualty</span>
          {' '}— Open-Source Reliability Score
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
          Scores are computed deterministically from five signals you provide. No API calls, runs entirely in your browser.
        </p>
      </div>
    </footer>
  );
});
