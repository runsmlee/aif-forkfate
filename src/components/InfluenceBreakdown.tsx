import { useRepoStore } from '../stores/repo-store';

export function InfluenceBreakdown(): JSX.Element {
  const scoreResult = useRepoStore((s) => s.scoreResult);
  const loading = useRepoStore((s) => s.loading);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="skeleton h-4 w-16 mb-2" />
            <div className="skeleton h-8 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!scoreResult) return <></>;

  const metrics = [
    {
      label: 'Total Forks',
      value: scoreResult.totalForks,
      color: 'text-gray-900 dark:text-gray-100',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
    },
    {
      label: 'Active Forks',
      value: scoreResult.activeForks,
      color: 'text-active-dark dark:text-active-light',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Derivative Projects',
      value: scoreResult.derivativeProjects,
      subtitle: '5+ independent commits',
      color: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      label: 'Chain Depth',
      value: scoreResult.maxChainDepth,
      subtitle: 'Longest fork chain',
      color: 'text-purple-600 dark:text-purple-400',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="card text-center group">
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${metric.color} bg-gray-50 dark:bg-gray-800 mb-3 opacity-60`}>
            {metric.icon}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-1">
            {metric.label}
          </p>
          <p className={`metric-value text-2xl ${metric.color}`}>
            {metric.value.toLocaleString()}
          </p>
          {metric.subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {metric.subtitle}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
