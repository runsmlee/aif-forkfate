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
    case 'Fork Activity':
      if (pct < 10) {
        return { metric: 'Fork Activity', severity: 'critical', message: 'No recent commits detected — forks of this project are likely dead. Consider finding an actively maintained fork.' };
      }
      if (pct < 40) {
        return { metric: 'Fork Activity', severity: 'warning', message: 'Low fork activity — most forks may be dormant. Verify whether active forks exist before depending on this project.' };
      }
      if (pct < 70) {
        return { metric: 'Fork Activity', severity: 'info', message: 'Moderate fork activity — some forks are actively maintained but the ecosystem is not thriving.' };
      }
      return null;

    case 'Community Vitality':
      if (pct < 25) {
        return { metric: 'Community Vitality', severity: 'critical', message: 'Very low issue close rate — the community is not engaged. Fork ecosystems need active communities to survive.' };
      }
      if (pct < 50) {
        return { metric: 'Community Vitality', severity: 'warning', message: 'Below-average community vitality — check if forks have their own active issue trackers.' };
      }
      if (pct < 75) {
        return { metric: 'Community Vitality', severity: 'info', message: 'Fair community vitality — engagement could be stronger to sustain a healthy fork tree.' };
      }
      return null;

    case 'Ecosystem Diversity':
      if (pct < 15) {
        return { metric: 'Ecosystem Diversity', severity: 'critical', message: 'Very few contributors — high bus factor risk. The fork ecosystem may collapse if the maintainer leaves.' };
      }
      if (pct < 40) {
        return { metric: 'Ecosystem Diversity', severity: 'warning', message: 'Limited ecosystem diversity — the project depends on a small team. Fork survival depends on maintainer continuity.' };
      }
      if (pct < 70) {
        return { metric: 'Ecosystem Diversity', severity: 'info', message: 'Moderate ecosystem diversity — the contributor base could be broader to support a thriving fork tree.' };
      }
      return null;

    case 'Evolutionary Freshness':
      if (pct < 15) {
        return { metric: 'Evolutionary Freshness', severity: 'critical', message: 'Project is stale — forks are likely dead or diverging. Dependencies may have security vulnerabilities.' };
      }
      if (pct < 40) {
        return { metric: 'Evolutionary Freshness', severity: 'warning', message: 'The project hasn\'t evolved recently — forks may be stagnating or forking without upstreaming changes.' };
      }
      if (pct < 75) {
        return { metric: 'Evolutionary Freshness', severity: 'info', message: 'Moderate evolutionary freshness — the project is active but not rapidly evolving.' };
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
              This is a healthy project with strong fork survival potential across all metrics.
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
