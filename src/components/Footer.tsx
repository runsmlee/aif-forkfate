import { memo } from 'react';

export const Footer = memo(function Footer(): JSX.Element {
  return (
    <footer className="border-t border-gray-100 py-8 px-4 sm:px-6" role="contentinfo">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-500">CommitCasualty</span>
          {' '}— Instantly Quantify Open-Source Reliability
        </p>
        <p className="text-xs text-gray-300 mt-2">
          Scores are computed from real GitHub API data. No AI involved — just deterministic metrics.
        </p>
      </div>
    </footer>
  );
});
