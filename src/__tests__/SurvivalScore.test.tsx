import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SurvivalScore } from '../components/SurvivalScore';
import { useRepoStore } from '../stores/repo-store';
import type { SurvivalScoreResult, RepoData } from '../lib/types';

// Mock store for component testing
function setStoreState(overrides: Partial<{
  scoreResult: SurvivalScoreResult | null;
  repo: RepoData | null;
  loading: boolean;
}>): void {
  useRepoStore.setState(overrides);
}

describe('SurvivalScore', () => {
  it('renders nothing when no data is available', () => {
    setStoreState({ scoreResult: null, repo: null, loading: false });
    const { container } = render(<SurvivalScore />);
    expect(container.innerHTML).toBe('');
  });

  it('renders loading skeleton when loading', () => {
    setStoreState({ scoreResult: null, repo: null, loading: true });
    render(<SurvivalScore />);
    const card = document.querySelector('[aria-busy="true"]');
    expect(card).toBeInTheDocument();
  });

  it('renders the score when data is available', () => {
    setStoreState({
      loading: false,
      repo: {
        id: 1,
        name: 'react',
        owner: 'facebook',
        fullName: 'facebook/react',
        htmlUrl: 'https://github.com/facebook/react',
        description: 'A JavaScript library for building UIs',
        stargazersCount: 200000,
        forksCount: 40000,
        watchersCount: 6000,
        createdAt: '2013-05-24T17:06:39Z',
        updatedAt: '2024-01-01T00:00:00Z',
        pushedAt: '2024-01-01T00:00:00Z',
        language: 'JavaScript',
        license: 'MIT',
      },
      scoreResult: {
        score: 34.2,
        totalForks: 40000,
        activeForks: 5000,
        dormantForks: 15000,
        deadForks: 20000,
        derivativeProjects: 800,
        maxChainDepth: 5,
        influenceScore: 45.0,
      },
    });

    render(<SurvivalScore />);
    expect(screen.getByText('Fork Survival Score')).toBeInTheDocument();
    expect(screen.getByText(/facebook\/react/)).toBeInTheDocument();
  });
});
