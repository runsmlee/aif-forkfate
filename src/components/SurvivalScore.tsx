import { useRepoStore } from '../stores/repo-store';
import { useEffect, useState, useRef } from 'react';

export function SurvivalScore(): JSX.Element {
  const scoreResult = useRepoStore((s) => s.scoreResult);
  const repo = useRepoStore((s) => s.repo);
  const loading = useRepoStore((s) => s.loading);
  const [displayScore, setDisplayScore] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Animate the score counter
  useEffect(() => {
    if (!scoreResult) {
      setDisplayScore(0);
      return;
    }

    const targetScore = scoreResult.score;
    const startScore = displayScore;
    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime: number): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentScore = startScore + (targetScore - startScore) * eased;

      setDisplayScore(Math.round(currentScore * 10) / 10);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scoreResult]);

  if (loading) {
    return (
      <div className="card text-center py-10" aria-busy="true">
        <div className="skeleton h-4 w-32 mx-auto mb-4" />
        <div className="skeleton h-16 w-48 mx-auto mb-4" />
        <div className="skeleton h-4 w-64 mx-auto" />
      </div>
    );
  }

  if (!scoreResult || !repo) {
    return <></>;
  }

  const scoreColor =
    scoreResult.score >= 40
      ? 'text-active-dark dark:text-active-light'
      : scoreResult.score >= 20
        ? 'text-amber-500 dark:text-amber-400'
        : 'text-brand';

  const scoreBg =
    scoreResult.score >= 40
      ? 'bg-active-50 dark:bg-active/5'
      : scoreResult.score >= 20
        ? 'bg-amber-50 dark:bg-amber-500/5'
        : 'bg-brand-50 dark:bg-brand/5';

  const scoreBorder =
    scoreResult.score >= 40
      ? 'border-active/20 dark:border-active/10'
      : scoreResult.score >= 20
        ? 'border-amber-500/20 dark:border-amber-500/10'
        : 'border-brand/20 dark:border-brand/10';

  return (
    <div className={`card text-center py-8 md:py-12 relative overflow-hidden ${scoreBg} border ${scoreBorder}`}>
      {/* Subtle radial glow behind score */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full ${scoreBg} blur-3xl opacity-60`} />
      </div>
      <div className="relative">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
          Fork Survival Score
        </p>
        <div className="flex items-baseline justify-center gap-0.5">
          <span
            className={`metric-value text-6xl md:text-8xl ${scoreColor} transition-colors duration-500`}
            aria-live="polite"
            aria-atomic="true"
          >
            {displayScore.toFixed(1)}
          </span>
          <span className={`text-2xl md:text-3xl font-semibold ${scoreColor} opacity-80`}>%</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
          of forks from <span className="font-semibold text-gray-700 dark:text-gray-300">{repo.fullName}</span> show
          sustained evolutionary activity — a key indicator of open-source reliability
        </p>
      </div>
    </div>
  );
}
