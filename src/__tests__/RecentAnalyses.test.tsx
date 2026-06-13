import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecentAnalyses } from '../components/RecentAnalyses';
import type { ManualAnalysis } from '../lib/types';

function makeAnalysis(overrides: Partial<ManualAnalysis> = {}): ManualAnalysis {
  return {
    id: 'test-id-1',
    signals: {
      commitsLast90Days: 50,
      daysSinceLastCommit: 3,
      openIssues: 5,
      closedIssues: 20,
      contributors: 10,
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    score: {
      total: 75,
      grade: 'A',
      breakdown: {
        forkActivity: { score: 20, max: 25, label: 'Fork Activity', description: 'Good' },
        communityVitality: { score: 18, max: 25, label: 'Community Vitality', description: 'Good' },
        ecosystemDiversity: { score: 20, max: 25, label: 'Ecosystem Diversity', description: 'Good' },
        evolutionaryFreshness: { score: 17, max: 25, label: 'Evolutionary Freshness', description: 'Good' },
      },
    },
    label: 'Score 75/100 (A)',
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
    expect(screen.getByText('Recent Scores')).toBeInTheDocument();
  });

  it('renders signal summary from history entries', () => {
    render(
      <RecentAnalyses
        history={[makeAnalysis({ signals: { commitsLast90Days: 45, daysSinceLastCommit: 3, openIssues: 12, closedIssues: 50, contributors: 8 } })]}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText(/45 commits/i)).toBeInTheDocument();
    expect(screen.getByText(/8 contributors/i)).toBeInTheDocument();
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

  it('calls onSelect with entry when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const entry = makeAnalysis();
    render(
      <RecentAnalyses
        history={[entry]}
        onSelect={onSelect}
        onClear={vi.fn()}
      />
    );

    // Click on the entry button (it contains the signal summary text)
    const btn = screen.getByRole('button', { name: /commits/i });
    await user.click(btn);
    expect(onSelect).toHaveBeenCalledWith(entry);
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
          makeAnalysis({ id: '1', score: { ...makeAnalysis().score, total: 85, grade: 'A+' }, signals: { commitsLast90Days: 100, daysSinceLastCommit: 1, openIssues: 5, closedIssues: 50, contributors: 20 } }),
          makeAnalysis({ id: '2', score: { ...makeAnalysis().score, total: 60, grade: 'B' }, signals: { commitsLast90Days: 30, daysSinceLastCommit: 10, openIssues: 20, closedIssues: 30, contributors: 5 } }),
        ]}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('has correct ARIA landmark', () => {
    render(
      <RecentAnalyses history={[makeAnalysis()]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(screen.getByRole('region', { name: /recent analyses/i })).toBeInTheDocument();
  });
});
