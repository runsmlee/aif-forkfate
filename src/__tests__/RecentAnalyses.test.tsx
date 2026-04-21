import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecentAnalyses } from '../components/RecentAnalyses';
import type { RepoAnalysis } from '../lib/types';

function makeAnalysis(overrides: Partial<RepoAnalysis> = {}): RepoAnalysis {
  return {
    repo: 'owner/repo',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    score: {
      total: 75,
      grade: 'A',
      breakdown: {
        commitActivity: { score: 20, max: 25, label: 'Commit Activity', description: 'Good' },
        issueHealth: { score: 18, max: 25, label: 'Issue Health', description: 'Good' },
        contributorDiversity: { score: 20, max: 25, label: 'Contributor Diversity', description: 'Good' },
        freshness: { score: 17, max: 25, label: 'Freshness', description: 'Good' },
      },
    },
    repoData: {
      id: 1,
      name: 'repo',
      full_name: 'owner/repo',
      description: 'Test repo',
      html_url: 'https://github.com/owner/repo',
      stargazers_count: 100,
      forks_count: 10,
      open_issues_count: 5,
      language: 'TypeScript',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2026-04-01T00:00:00Z',
      pushed_at: new Date().toISOString(),
      topics: [],
      license: null,
    },
    commitCount: 50,
    contributorCount: 10,
    openIssueCount: 5,
    closedIssueCount: 20,
    lastCommitDate: new Date().toISOString(),
    lastReleaseDate: null,
    ...overrides,
  };
}

describe('RecentAnalyses', () => {
  it('renders nothing when history is empty', () => {
    const { container } = render(
      <RecentAnalyses history={[]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the section heading when history exists', () => {
    render(
      <RecentAnalyses history={[makeAnalysis()]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(screen.getByText('Recent Analyses')).toBeInTheDocument();
  });

  it('renders repo names from history', () => {
    render(
      <RecentAnalyses
        history={[makeAnalysis({ repo: 'facebook/react' })]}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('facebook/react')).toBeInTheDocument();
  });

  it('renders score and grade for each entry', () => {
    render(
      <RecentAnalyses history={[makeAnalysis()]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders the clear history button', () => {
    render(
      <RecentAnalyses history={[makeAnalysis()]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /clear analysis history/i })).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(
      <RecentAnalyses history={[makeAnalysis()]} onSelect={vi.fn()} onClear={onClear} />
    );

    await user.click(screen.getByRole('button', { name: /clear analysis history/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls onSelect with repo name when entry is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <RecentAnalyses
        history={[makeAnalysis({ repo: 'vercel/next.js' })]}
        onSelect={onSelect}
        onClear={vi.fn()}
      />
    );

    await user.click(screen.getByText('vercel/next.js'));
    expect(onSelect).toHaveBeenCalledWith('vercel/next.js');
  });

  it('displays time ago for recent entries', () => {
    render(
      <RecentAnalyses
        history={[makeAnalysis({ timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString() })]}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('3m ago')).toBeInTheDocument();
  });

  it('renders multiple history entries', () => {
    render(
      <RecentAnalyses
        history={[
          makeAnalysis({ repo: 'facebook/react', score: { ...makeAnalysis().score, total: 85, grade: 'A+' } }),
          makeAnalysis({ repo: 'denoland/deno', score: { ...makeAnalysis().score, total: 60, grade: 'B' } }),
        ]}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('facebook/react')).toBeInTheDocument();
    expect(screen.getByText('denoland/deno')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('renders score delta when previous score is available', () => {
    render(
      <RecentAnalyses
        history={[
          makeAnalysis({
            repo: 'facebook/react',
            previousScore: 70,
            score: { ...makeAnalysis().score, total: 85, grade: 'A+' },
          }),
        ]}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('+15')).toBeInTheDocument();
  });

  it('renders negative score delta for score decrease', () => {
    render(
      <RecentAnalyses
        history={[
          makeAnalysis({
            repo: 'facebook/react',
            previousScore: 90,
            score: { ...makeAnalysis().score, total: 78, grade: 'A' },
          }),
        ]}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('-12')).toBeInTheDocument();
  });

  it('has correct ARIA landmark', () => {
    render(
      <RecentAnalyses history={[makeAnalysis()]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(screen.getByRole('region', { name: /recent analyses/i })).toBeInTheDocument();
  });
});
