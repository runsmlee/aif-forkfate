import { useState, useMemo, useCallback, useEffect, useRef, type ChangeEvent } from 'react';
import type { ManualSignals, ReliabilityScore } from '../lib/types';
import { computeManualScore } from '../lib/score-engine';
import { ScoreGauge } from './ScoreGauge';
import { MetricCard } from './MetricCard';
import { Recommendations } from './Recommendations';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface SignalField {
  key: keyof ManualSignals;
  label: string;
  hint: string;
  min: number;
  max: number;
  placeholder: string;
}

const SIGNAL_FIELDS: SignalField[] = [
  {
    key: 'commitsLast90Days',
    label: 'Commits (last 90 days)',
    hint: 'Count non-merge commits on the default branch in the last 90 days',
    min: 0,
    max: 10000,
    placeholder: 'e.g. 45',
  },
  {
    key: 'daysSinceLastCommit',
    label: 'Days since last commit',
    hint: 'Days since the most recent push to the default branch',
    min: 0,
    max: 3650,
    placeholder: 'e.g. 3',
  },
  {
    key: 'openIssues',
    label: 'Open issues',
    hint: 'Current number of open issues (exclude pull requests)',
    min: 0,
    max: 100000,
    placeholder: 'e.g. 12',
  },
  {
    key: 'closedIssues',
    label: 'Closed issues',
    hint: 'Total number of closed issues in the repository',
    min: 0,
    max: 100000,
    placeholder: 'e.g. 50',
  },
  {
    key: 'contributors',
    label: 'Contributors',
    hint: 'Number of users who have committed to the repository',
    min: 0,
    max: 10000,
    placeholder: 'e.g. 8',
  },
];

const METRIC_ICONS = ['🔥', '🐛', '👥', '🕐'];

const EMPTY_SIGNALS: ManualSignals = {
  commitsLast90Days: 0,
  daysSinceLastCommit: 0,
  openIssues: 0,
  closedIssues: 0,
  contributors: 0,
};

function hasAnySignal(signals: ManualSignals): boolean {
  return (
    signals.commitsLast90Days > 0 ||
    signals.daysSinceLastCommit > 0 ||
    signals.openIssues > 0 ||
    signals.closedIssues > 0 ||
    signals.contributors > 0
  );
}

function parseSignalInput(value: string): number {
  if (value === '') return 0;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

export interface HeroProps {
  onScoreComputed?: (score: ReliabilityScore, signals: ManualSignals) => void;
  initialSignals?: ManualSignals;
}

export function Hero({ onScoreComputed, initialSignals }: HeroProps): JSX.Element {
  const [signals, setSignals] = useState<ManualSignals>(initialSignals ?? EMPTY_SIGNALS);
  const [inputValues, setInputValues] = useState<Record<keyof ManualSignals, string>>({
    commitsLast90Days: initialSignals?.commitsLast90Days ? String(initialSignals.commitsLast90Days) : '',
    daysSinceLastCommit: initialSignals?.daysSinceLastCommit ? String(initialSignals.daysSinceLastCommit) : '',
    openIssues: initialSignals?.openIssues ? String(initialSignals.openIssues) : '',
    closedIssues: initialSignals?.closedIssues ? String(initialSignals.closedIssues) : '',
    contributors: initialSignals?.contributors ? String(initialSignals.contributors) : '',
  });

  const active = hasAnySignal(signals);

  const score: ReliabilityScore | null = useMemo(() => {
    if (!active) return null;
    const result = computeManualScore(signals);
    return result;
  }, [signals, active]);

  // Track previous signals to detect changes (avoid notifying on mount with empty signals)
  const prevSignalsRef = useRef<ManualSignals>(signals);

  // Notify parent when score changes — use useEffect to avoid setState-during-render
  useEffect(() => {
    if (!onScoreComputed) return;
    if (signals === prevSignalsRef.current) return;
    prevSignalsRef.current = signals;

    if (hasAnySignal(signals)) {
      const newScore = computeManualScore(signals);
      onScoreComputed(newScore, signals);
    }
  }, [signals, onScoreComputed]);

  const handleSignalChange = useCallback(
    (key: keyof ManualSignals, rawValue: string) => {
      const numValue = parseSignalInput(rawValue);
      setInputValues((prev) => ({ ...prev, [key]: rawValue }));
      setSignals((prev) => ({ ...prev, [key]: numValue }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setSignals(EMPTY_SIGNALS);
    setInputValues({
      commitsLast90Days: '',
      daysSinceLastCommit: '',
      openIssues: '',
      closedIssues: '',
      contributors: '',
    });
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6" aria-label="Open-source reliability calculator">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            How reliable is that repo?
            <span className="text-brand-500 block sm:inline sm:ml-2">Score it in seconds.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Enter five signals from any GitHub repo to get an instant reliability score. Deterministic, runs in your browser.
          </p>
        </div>

        {/* Signal inputs */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          role="group"
          aria-label="Repository signal inputs"
        >
          {SIGNAL_FIELDS.map((field) => (
            <div
              key={field.key}
              className={field.key === 'contributors' ? 'sm:col-span-2 sm:max-w-xs' : ''}
            >
              <label
                htmlFor={`signal-${field.key}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                {field.label}
              </label>
              <input
                id={`signal-${field.key}`}
                type="number"
                inputMode="numeric"
                min={field.min}
                max={field.max}
                value={inputValues[field.key]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSignalChange(field.key, e.target.value)
                }
                placeholder={field.placeholder}
                aria-describedby={`hint-${field.key}`}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm tabular-nums transition-shadow"
                autoComplete="off"
              />
              <p id={`hint-${field.key}`} className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {field.hint}
              </p>
            </div>
          ))}
        </div>

        {/* Live score display */}
        {score && active ? (
          <div className="animate-fade-up">
            {/* Score gauge + grade */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
              <ScoreGauge score={score.total} grade={score.grade} />
              <div className="flex flex-col items-start">
                <span
                  className={`text-4xl sm:text-5xl font-extrabold ${
                    score.grade === 'A+' || score.grade === 'A'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : score.grade === 'B'
                        ? 'text-blue-600 dark:text-blue-400'
                        : score.grade === 'C'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : score.grade === 'D'
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-red-600 dark:text-red-400'
                  }`}
                  aria-label={`Reliability grade: ${score.grade}`}
                >
                  {score.grade}
                </span>
                <LiveScoreCounter total={score.total} />
              </div>
            </div>

            {/* Metric breakdown */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
              aria-label="Score breakdown by category"
            >
              {Object.values(score.breakdown).map((metric, i) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  score={metric.score}
                  max={metric.max}
                  description={metric.description}
                  icon={METRIC_ICONS[i] ?? '📊'}
                />
              ))}
            </div>

            {/* Recommendations */}
            <Recommendations breakdown={score.breakdown} />

            {/* Reset button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleReset}
                className="btn-secondary text-sm"
                aria-label="Clear all inputs and reset score"
              >
                Reset Calculator
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Enter at least one signal above to see the reliability score.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Displays the animated total score counter */
function LiveScoreCounter({ total }: { total: number }): JSX.Element {
  const animatedTotal = useAnimatedCounter(total, 600);
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 tabular-nums">
      {animatedTotal}/100
    </p>
  );
}
