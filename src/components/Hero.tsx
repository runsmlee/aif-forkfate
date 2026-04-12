import { useState, type FormEvent } from 'react';
import { EXAMPLE_REPOS } from '../lib/types';

interface HeroProps {
  onAnalyze: (repo: string) => void;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export function Hero({ onAnalyze, status }: HeroProps): JSX.Element {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (value) {
      onAnalyze(value);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleExample = (repo: string) => {
    setInput(repo);
    onAnalyze(repo);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6" aria-label="Search for a repository">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          Instantly Quantify
          <span className="text-brand-500 block sm:inline sm:ml-2">Open-Source Reliability</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-lg mx-auto">
          Enter any GitHub repository to get a real-time reliability score based on commit activity,
          issue health, contributor diversity, and freshness.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
          <label htmlFor="repo-input" className="sr-only">
            GitHub Repository (owner/repo)
          </label>
          <div className="flex gap-2">
            <div className={`flex-1 relative ${shake ? 'animate-shake' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <input
                id="repo-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. facebook/react"
                aria-label="GitHub repository (owner/repo)"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm sm:text-base transition-shadow"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary whitespace-nowrap min-w-[100px]"
              aria-label="Analyze repository"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0-3.042 1.135-5.824 3-7.938l3-2.647z" />
                  </svg>
                  Analyzing…
                </span>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-2" aria-label="Example repositories">
          <span className="text-xs text-gray-400 py-1">Try:</span>
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo}
              onClick={() => handleExample(repo)}
              disabled={status === 'loading'}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-colors disabled:opacity-50"
            >
              {repo}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
