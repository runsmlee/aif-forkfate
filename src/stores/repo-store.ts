import { create } from 'zustand';
import type { ForkData, RepoData, SurvivalScoreResult } from '../lib/types';
import { calculateSurvivalScore } from '../lib/score-engine';
import { fetchRepoAndForks } from '../lib/github-api';

interface RepoState {
  // Input state
  repoUrl: string;
  setRepoUrl: (url: string) => void;

  // Loading state
  loading: boolean;
  loadingProgress: number;
  loadingTotal: number;
  error: string | null;

  // Data
  repo: RepoData | null;
  forks: ForkData[];
  scoreResult: SurvivalScoreResult | null;

  // UI state
  selectedFork: ForkData | null;
  setSelectedFork: (fork: ForkData | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Actions
  analyze: (url?: string) => Promise<void>;
  reset: () => void;
}

export const useRepoStore = create<RepoState>((set, get) => ({
  // Initial state
  repoUrl: '',
  loading: false,
  loadingProgress: 0,
  loadingTotal: 0,
  error: null,
  repo: null,
  forks: [],
  scoreResult: null,
  selectedFork: null,
  darkMode: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false,

  setRepoUrl: (url: string) => set({ repoUrl: url }),

  setSelectedFork: (fork: ForkData | null) => set({ selectedFork: fork }),

  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ darkMode: newDarkMode });
  },

  analyze: async (url?: string) => {
    const targetUrl = url ?? get().repoUrl;
    if (!targetUrl.trim()) {
      set({ error: 'Please enter a GitHub repository URL' });
      return;
    }

    set({
      loading: true,
      error: null,
      forks: [],
      repo: null,
      scoreResult: null,
      selectedFork: null,
      loadingProgress: 0,
      loadingTotal: 0,
    });

    try {
      const { repo, forks } = await fetchRepoAndForks(targetUrl, (loaded, total) => {
        set({ loadingProgress: loaded, loadingTotal: total });
      });

      const scoreResult = calculateSurvivalScore(forks);

      set({
        repo,
        forks,
        scoreResult,
        loading: false,
        repoUrl: targetUrl,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      set({ error: message, loading: false });
    }
  },

  reset: () =>
    set({
      repoUrl: '',
      loading: false,
      loadingProgress: 0,
      loadingTotal: 0,
      error: null,
      repo: null,
      forks: [],
      scoreResult: null,
      selectedFork: null,
    }),
}));
