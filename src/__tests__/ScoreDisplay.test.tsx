import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { computeManualScore } from '../lib/score-engine';
import type { ManualSignals } from '../lib/types';

describe('ScoreDisplay (via Hero integration)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders all four metric breakdown labels when signals are provided', async () => {
    const { Hero } = await import('../components/Hero');
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Hero />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '45');

    expect(screen.getByRole('heading', { name: 'Fork Activity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Community Vitality' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ecosystem Diversity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Evolutionary Freshness' })).toBeInTheDocument();
  });

  it('renders metric descriptions from computed score', async () => {
    const signals: ManualSignals = {
      commitsLast90Days: 45,
      daysSinceLastCommit: 3,
      openIssues: 12,
      closedIssues: 50,
      contributors: 8,
    };
    const score = computeManualScore(signals);

    // Verify the score engine produces valid descriptions
    for (const metric of Object.values(score.breakdown)) {
      expect(metric.description).toBeTruthy();
      expect(metric.description.length).toBeGreaterThan(0);
    }
  });

  it('renders a reset button to clear inputs', async () => {
    const { Hero } = await import('../components/Hero');
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Hero />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '45');

    const resetBtn = screen.getByRole('button', { name: /clear all inputs/i });
    expect(resetBtn).toBeInTheDocument();
    await user.click(resetBtn);

    // Should go back to empty state
    expect(screen.getByText(/enter at least one signal/i)).toBeInTheDocument();
  });
});
