import { useState } from 'react';

interface HeaderProps {
  onAddTool: () => void;
}

export function Header({ onAddTool }: HeaderProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group" aria-label="ShareShed home">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 21h18M3 10l9-7 9 7M5 10v11M19 10v11M9 21v-6h6v6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-brand-600 transition-colors">
            ShareShed
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3" aria-label="Main navigation">
          <button
            onClick={onAddTool}
            className="btn-primary text-sm py-2 px-4"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Lend a Tool
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="sm:hidden border-t border-gray-100 bg-white px-4 py-3"
          aria-label="Mobile navigation"
        >
          <button
            onClick={() => {
              onAddTool();
              setMenuOpen(false);
            }}
            className="btn-primary w-full text-sm"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Lend a Tool
          </button>
        </nav>
      )}
    </header>
  );
}
