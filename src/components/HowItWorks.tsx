import { memo } from 'react';

const METRICS = [
  {
    icon: '🔥',
    title: 'Fork Activity',
    description:
      'Measures how actively the project is being developed by counting non-merge commits over the last 90 days. Active projects sustain healthier fork ecosystems.',
    maxScore: 25,
  },
  {
    icon: '🐛',
    title: 'Community Vitality',
    description:
      'Evaluates whether the community is engaged by analyzing the ratio of closed to total issues. Active issue resolution signals a living fork ecosystem.',
    maxScore: 25,
  },
  {
    icon: '👥',
    title: 'Ecosystem Diversity',
    description:
      'Assesses the breadth of contributor support by counting contributors and checking whether development effort is distributed across the ecosystem.',
    maxScore: 25,
  },
  {
    icon: '🕐',
    title: 'Evolutionary Freshness',
    description:
      'Checks how recently the project evolved and whether a recent release exists. Stale projects produce dead forks; fresh ones produce evolving forks.',
    maxScore: 25,
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
            We analyze real GitHub API data to compute a Fork Survival Score out of 100.
            All scoring is deterministic — transparent metrics that reveal which forks thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
          {METRICS.map((metric) => (
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
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {metric.description}
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
