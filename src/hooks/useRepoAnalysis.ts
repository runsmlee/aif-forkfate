import { useState, useCallback } from 'react';
import type { RepoAnalysis, AnalysisStatus, ReliabilityScore } from '../lib/types';
import { analyzeRepo } from '../lib/github-api';
import { computeReliabilityScore } from '../lib/score-engine';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'commitcasualty_history';
const MAX_HISTORY = 20;

export function useRepoAnalysis() {
  const [history, setHistory] = useLocalStorage<RepoAnalysis[]>(STORAGE_KEY, []);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [currentAnalysis, setCurrentAnalysis] = useState<RepoAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (repoInput: string) => {
      const repo = repoInput.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      if (!repo || !repo.includes('/')) {
        setError('Please enter a valid GitHub repository (e.g., facebook/react)');
        return null;
      }

      setStatus('loading');
      setError(null);

      try {
        const data = await analyzeRepo(repo);
        const score: ReliabilityScore = computeReliabilityScore({
          repoData: data.repoData,
          commitCount: data.commitCount,
          contributors: data.contributors,
          openIssues: data.openIssues,
          closedIssues: data.closedIssues,
          latestRelease: data.latestRelease,
        });

        const analysis: RepoAnalysis = {
          repo,
          timestamp: new Date().toISOString(),
          score,
          repoData: data.repoData,
          commitCount: data.commitCount,
          contributorCount: data.contributors.length,
          openIssueCount: data.openIssues.length,
          closedIssueCount: data.closedIssues.length,
          lastCommitDate: data.repoData.pushed_at,
          lastReleaseDate: data.latestRelease?.published_at ?? null,
        };

        setCurrentAnalysis(analysis);
        setStatus('success');

        // Persist to localStorage (dedup by repo name)
        setHistory((prev) => {
          const filtered = prev.filter((a) => a.repo !== repo);
          const updated = [analysis, ...filtered].slice(0, MAX_HISTORY);
          return updated;
        });

        return analysis;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        setStatus('error');
        return null;
      }
    },
    [setHistory]
  );

  const reset = useCallback(() => {
    setCurrentAnalysis(null);
    setStatus('idle');
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    currentAnalysis,
    status,
    error,
    analyze,
    reset,
    clearHistory,
  };
}
