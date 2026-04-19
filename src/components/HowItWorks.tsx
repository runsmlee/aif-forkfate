import { memo } from 'react';

const METRICS = [
  {
    icon: '🔥',
    title: 'Commit Activity',
    description:
      'Measures how active a project is by counting non-merge commits over the last 90 days. Expectations scale with project popularity.',
    maxScore: 25,
  },
  {
    icon: '🐛',
    title: 'Issue Health',
    description:
      'Evaluates whether issues are being resolved by analyzing the ratio of closed to total issues. A healthy project closes issues regularly.',
    maxScore: 25,
  },
  {
    icon: '👥',
    title: 'Contributor Diversity',
    description:
      'Assesses the breadth of community support by counting contributors and checking whether commit distribution is healthy across the team.',
    maxScore: 25,
  },
  {
    icon: '🕐',
    title: 'Freshness',
    description:
      'Checks how recently the project was last updated and whether a recent release exists. Stale projects lose points over time.',
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
            We analyze real GitHub API data to compute a reliability score out of 100.
            All scoring is deterministic — no AI involved, just transparent metrics.
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
