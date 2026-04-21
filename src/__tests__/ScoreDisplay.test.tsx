import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreDisplay } from '../components/ScoreDisplay';
import type { ReliabilityScore, RepoAnalysis } from '../lib/types';

const mockScore: ReliabilityScore = {
  total: 78,
  grade: 'A',
  breakdown: {
    commitActivity: {
      score: 20,
      max: 25,
      label: 'Commit Activity',
      description: 'Good — 47 commits in 90 days',
    },
    issueHealth: {
      score: 22,
      max: 25,
      label: 'Issue Health',
      description: 'Good — 82% issue close rate',
    },
    contributorDiversity: {
      score: 18,
      max: 25,
      label: 'Contributor Diversity',
      description: 'Moderate — 8 contributors',
    },
    freshness: {
      score: 18,
      max: 25,
      label: 'Freshness',
      description: 'Updated 5 days ago',
    },
  },
};

const mockAnalysis: RepoAnalysis = {
  repo: 'facebook/react',
  timestamp: '2026-04-12T12:00:00Z',
  score: mockScore,
  repoData: {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'The library for web and native user interfaces.',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 225000,
    forks_count: 46000,
    open_issues_count: 300,
    language: 'JavaScript',
    created_at: '2013-05-24T00:00:00Z',
    updated_at: '2026-04-12T00:00:00Z',
    pushed_at: '2026-04-11T00:00:00Z',
    topics: ['javascript', 'ui', 'frontend'],
    license: { spdx_id: 'MIT' },
  },
  commitCount: 47,
  contributorCount: 8,
  openIssueCount: 55,
  closedIssueCount: 250,
  lastCommitDate: '2026-04-11T00:00:00Z',
  lastReleaseDate: '2026-04-01T00:00:00Z',
};

describe('ScoreDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the total score after animation', async () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    // After animation completes, score 78 should be visible
    await waitFor(() => {
      expect(screen.getByText('78')).toBeInTheDocument();
    }, { timeout: 3000 });
    // Grade "A" appears in both the ScoreGauge and the large grade display
    const gradeElements = screen.getAllByText('A');
    expect(gradeElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all four metric breakdowns', () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Commit Activity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Issue Health' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contributor Diversity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Freshness' })).toBeInTheDocument();
  });

  it('renders metric descriptions', () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    expect(screen.getByText('Good — 47 commits in 90 days')).toBeInTheDocument();
    expect(screen.getByText('Good — 82% issue close rate')).toBeInTheDocument();
  });

  it('renders repo name and link', () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    expect(screen.getByText('facebook/react')).toBeInTheDocument();
  });

  it('renders star and fork counts', () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    expect(screen.getByText(/225K/)).toBeInTheDocument();
    expect(screen.getByText(/46K/)).toBeInTheDocument();
  });

  it('renders repo description', () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    expect(screen.getByText('The library for web and native user interfaces.')).toBeInTheDocument();
  });

  it('renders a reset button', async () => {
    const onReset = vi.fn();
    render(<ScoreDisplay analysis={mockAnalysis} onReset={onReset} />);
    const btn = screen.getByRole('button', { name: /analyze another/i });
    await userEvent.click(btn);
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('renders a share button', () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    expect(screen.getByRole('button', { name: /share score/i })).toBeInTheDocument();
  });

  it('renders license information when available', () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    expect(screen.getByText(/MIT/)).toBeInTheDocument();
  });

  it('shows the animated total score counter', async () => {
    render(<ScoreDisplay analysis={mockAnalysis} onReset={() => {}} />);
    // Wait for animation to complete — the total should appear as "78/100"
    await waitFor(() => {
      expect(screen.getByText('78/100')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
