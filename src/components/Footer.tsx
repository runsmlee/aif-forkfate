export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-gray-200 mt-16" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10l9-7 9 7M5 10v11M19 10v11M9 21v-6h6v6" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">ShareShed</span>
        </div>
        <p className="text-xs text-gray-400">
          Dead simple neighborhood tool lending. Built with ❤ for communities.
        </p>
      </div>
    </footer>
  );
}
