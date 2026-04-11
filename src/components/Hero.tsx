interface HeroProps {
  onBrowseTools: () => void;
}

export function Hero({ onBrowseTools }: HeroProps): JSX.Element {
  return (
    <section className="pt-12 pb-16 md:pt-20 md:pb-24 text-center px-4" aria-label="Welcome">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden="true" />
          Your neighborhood tool library
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Borrow Tools from{' '}
          <span className="text-brand-500">Your Neighbors</span>
        </h1>

        <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
          Why buy a ladder you&apos;ll use once? ShareShed connects you with tools nearby —
          free to borrow, simple to lend.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBrowseTools}
            className="btn-primary text-base px-8 py-3.5"
          >
            Browse Tools
          </button>
          <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors">
            How it works →
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 flex items-center justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">42</p>
            <p className="text-xs text-gray-500 font-medium">Tools Available</p>
          </div>
          <div className="w-px h-8 bg-gray-200" aria-hidden="true" />
          <div>
            <p className="text-2xl font-bold text-gray-900">18</p>
            <p className="text-xs text-gray-500 font-medium">Neighbors Sharing</p>
          </div>
          <div className="w-px h-8 bg-gray-200" aria-hidden="true" />
          <div>
            <p className="text-2xl font-bold text-gray-900">127</p>
            <p className="text-xs text-gray-500 font-medium">Borrows This Month</p>
          </div>
        </div>
      </div>
    </section>
  );
}
