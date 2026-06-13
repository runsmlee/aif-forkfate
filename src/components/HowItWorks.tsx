import { memo } from 'react';

const SIGNALS = [
  {
    icon: '🔥',
    title: 'Fork Activity',
    description:
      'Counts non-merge commits on the default branch over the last 90 days. Active projects sustain healthier ecosystems.',
    maxScore: 25,
    howToFind: 'GitHub → repo → Commits → count commits in the last 3 months',
  },
  {
    icon: '🐛',
    title: 'Community Vitality',
    description:
      'Measures issue close rate — the ratio of closed issues to total issues. Active issue resolution signals an engaged community.',
    maxScore: 25,
    howToFind: 'GitHub → repo → Issues → note open vs. closed counts',
  },
  {
    icon: '👥',
    title: 'Ecosystem Diversity',
    description:
      'Assesses contributor breadth and distribution. More contributors means lower bus factor risk.',
    maxScore: 25,
    howToFind: 'GitHub → repo → Contributors → count the contributor list',
  },
  {
    icon: '🕐',
    title: 'Evolutionary Freshness',
    description:
      'Checks how recently the project was updated. Stale projects produce dead forks; fresh ones keep evolving.',
    maxScore: 25,
    howToFind: 'GitHub → repo → check the "last commit" date, calculate days since',
  },
];

export const HowItWorks = memo(function HowItWorks(): JSX.Element {
  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50" aria-label="How the scoring works">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Enter five signals from any GitHub repository. The score is computed instantly and deterministically — transparent metrics, no API calls, runs entirely in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
          {SIGNALS.map((metric) => (
            <div
              key={metric.title}
              className="card p-5 hover:shadow-card-hover transition-shadow duration-200"
              role="listitem"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl" aria-hidden="true">{metric.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{metric.title}</h3>
                <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  Max {metric.maxScore}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
                {metric.description}
              </p>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                How to find: {metric.howToFind}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Total score ranges from 0 (F) to 100 (A+). Grades: A+ (90+), A (75+), B (55+), C (35+), D (20+), F (&lt;20).
          </p>
        </div>
      </div>
    </section>
  );
});
