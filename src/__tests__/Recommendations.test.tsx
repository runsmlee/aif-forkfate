import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Recommendations } from '../components/Recommendations';
import type { ScoreBreakdown } from '../lib/types';

function makeBreakdown(overrides: Partial<ScoreBreakdown> = {}): ScoreBreakdown {
  return {
    forkActivity: { score: 22, max: 25, label: 'Commit Activity', description: 'Excellent' },
    communityVitality: { score: 22, max: 25, label: 'Community Vitality', description: 'Excellent' },
    ecosystemDiversity: { score: 22, max: 25, label: 'Ecosystem Diversity', description: 'Excellent' },
    evolutionaryFreshness: { score: 22, max: 25, label: 'Evolutionary Freshness', description: 'Excellent' },
    ...overrides,
  };
}

describe('Recommendations', () => {
  it('renders the recommendations section', () => {
    render(<Recommendations breakdown={makeBreakdown()} />);
    expect(screen.getByRole('region', { name: /recommendations/i })).toBeInTheDocument();
  });

  it('shows a positive message when all scores are high', () => {
    render(<Recommendations breakdown={makeBreakdown()} />);
    expect(screen.getByText(/reliability signals/i)).toBeInTheDocument();
  });

  it('shows a critical recommendation when commit activity is very low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          forkActivity: { score: 0, max: 25, label: 'Commit Activity', description: 'No commits' },
        })}
      />
    );
    expect(screen.getByText(/Commit Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/this project may be abandoned/i)).toBeInTheDocument();
  });

  it('shows a warning when community vitality is low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          communityVitality: { score: 5, max: 25, label: 'Community Vitality', description: 'Low close rate' },
        })}
      />
    );
    expect(screen.getByText(/Community Vitality/i)).toBeInTheDocument();
    expect(screen.getByText(/close rate/i)).toBeInTheDocument();
  });

  it('shows a warning when ecosystem diversity is low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          ecosystemDiversity: { score: 8, max: 25, label: 'Ecosystem Diversity', description: 'Few contributors' },
        })}
      />
    );
    expect(screen.getByText(/limited ecosystem/i)).toBeInTheDocument();
  });

  it('shows a critical warning for very low ecosystem diversity', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          ecosystemDiversity: { score: 2, max: 25, label: 'Ecosystem Diversity', description: 'Single contributor' },
        })}
      />
    );
    expect(screen.getByText(/bus factor/i)).toBeInTheDocument();
  });

  it('shows a critical recommendation when evolutionary freshness is very low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          evolutionaryFreshness: { score: 3, max: 25, label: 'Evolutionary Freshness', description: 'Very stale' },
        })}
      />
    );
    expect(screen.getByText(/Evolutionary Freshness/i)).toBeInTheDocument();
    expect(screen.getByText(/stale/i)).toBeInTheDocument();
  });

  it('shows multiple recommendations when multiple metrics are low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          forkActivity: { score: 2, max: 25, label: 'Commit Activity', description: 'Very low' },
          evolutionaryFreshness: { score: 3, max: 25, label: 'Evolutionary Freshness', description: 'Stale' },
        })}
      />
    );
    expect(screen.getByText(/Commit Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Evolutionary Freshness/i)).toBeInTheDocument();
  });

  it('renders with accessible structure', () => {
    render(<Recommendations breakdown={makeBreakdown()} />);
    expect(screen.getByRole('region', { name: /recommendations/i })).toBeInTheDocument();
  });

  it('uses appropriate ARIA severity indicators', () => {
    const { container } = render(
      <Recommendations
        breakdown={makeBreakdown({
          forkActivity: { score: 0, max: 25, label: 'Commit Activity', description: 'None' },
        })}
      />
    );
    // Should have at least one item with critical styling
    expect(container.querySelector('[data-severity="critical"]')).toBeInTheDocument();
  });

  it('shows improvement suggestions for moderate scores', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          communityVitality: { score: 12, max: 25, label: 'Community Vitality', description: 'Fair' },
        })}
      />
    );
    expect(screen.getAllByText(/Community Vitality/i).length).toBeGreaterThan(0);
  });
});
