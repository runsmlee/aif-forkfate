import { memo } from 'react';
import type { ScoreBreakdown, MetricScore } from '../lib/types';

interface Recommendation {
  metric: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

function getRecommendationForMetric(metric: MetricScore): Recommendation | null {
  const pct = (metric.score / metric.max) * 100;

  switch (metric.label) {
    case 'Commit Activity':
      if (pct < 10) {
        return { metric: 'Commit Activity', severity: 'critical', message: 'No recent commits detected — the project may be abandoned. Consider checking if a fork is actively maintained.' };
      }
      if (pct < 40) {
        return { metric: 'Commit Activity', severity: 'warning', message: 'Low commit activity — verify the project is still being actively maintained before adopting.' };
      }
      if (pct < 70) {
        return { metric: 'Commit Activity', severity: 'info', message: 'Moderate commit activity — acceptable for smaller projects but worth monitoring.' };
      }
      return null;

    case 'Issue Health':
      if (pct < 25) {
        return { metric: 'Issue Health', severity: 'critical', message: 'Very low issue close rate — issues may not be getting attention from maintainers.' };
      }
      if (pct < 50) {
        return { metric: 'Issue Health', severity: 'warning', message: 'Below-average issue close rate — check if open issues are being triaged and addressed.' };
      }
      if (pct < 75) {
        return { metric: 'Issue Health', severity: 'info', message: 'Fair issue health — some issues may be lingering without resolution.' };
      }
      return null;

    case 'Contributor Diversity':
      if (pct < 15) {
        return { metric: 'Contributor Diversity', severity: 'critical', message: 'Very few contributors — high bus factor risk. The project may not survive if the maintainer leaves.' };
      }
      if (pct < 40) {
        return { metric: 'Contributor Diversity', severity: 'warning', message: 'Limited contributor base — the project may depend on a small team for all development.' };
      }
      if (pct < 70) {
        return { metric: 'Contributor Diversity', severity: 'info', message: 'Moderate contributor diversity — consider whether the community is growing.' };
      }
      return null;

    case 'Freshness':
      if (pct < 15) {
        return { metric: 'Freshness', severity: 'critical', message: 'Project is stale — dependencies may have security vulnerabilities. Verify compatibility before using.' };
      }
      if (pct < 40) {
        return { metric: 'Freshness', severity: 'warning', message: 'The project hasn\'t been updated recently — check for compatible dependencies and potential issues.' };
      }
      if (pct < 75) {
        return { metric: 'Freshness', severity: 'info', message: 'Moderate freshness — the project is active but not frequently updated.' };
      }
      return null;

    default:
      return null;
  }
}

function getRecommendations(breakdown: ScoreBreakdown): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const metric of Object.values(breakdown)) {
    const rec = getRecommendationForMetric(metric);
    if (rec) {
      recommendations.push(rec);
    }
  }

  return recommendations;
}

const severityStyles: Record<string, { container: string; badge: string; icon: string }> = {
  critical: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    badge: 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40',
    icon: '⚠️',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    badge: 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/40',
    icon: '💡',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    badge: 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40',
    icon: 'ℹ️',
  },
};

interface RecommendationsProps {
  breakdown: ScoreBreakdown;
}

export const Recommendations = memo(function Recommendations({ breakdown }: RecommendationsProps): JSX.Element {
  const recommendations = getRecommendations(breakdown);

  if (recommendations.length === 0) {
    return (
      <section className="mt-8" aria-label="Recommendations">
        <div className="card p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">✅</span>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              This is a healthy project with strong reliability across all metrics.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8" aria-label="Recommendations">
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
        Recommendations
      </h3>
      <div className="space-y-2">
        {recommendations.map((rec) => {
          const styles = severityStyles[rec.severity];
          return (
            <div
              key={rec.metric}
              className={`rounded-lg border p-3 ${styles.container}`}
              data-severity={rec.severity}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5 flex-shrink-0" aria-hidden="true">{styles.icon}</span>
                <div className="min-w-0">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${styles.badge}`}>
                    {rec.metric}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {rec.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});
