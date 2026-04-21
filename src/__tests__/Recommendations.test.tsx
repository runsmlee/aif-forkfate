import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Recommendations } from '../components/Recommendations';
import type { ScoreBreakdown } from '../lib/types';

function makeBreakdown(overrides: Partial<ScoreBreakdown> = {}): ScoreBreakdown {
  return {
    commitActivity: { score: 22, max: 25, label: 'Commit Activity', description: 'Excellent' },
    issueHealth: { score: 22, max: 25, label: 'Issue Health', description: 'Excellent' },
    contributorDiversity: { score: 22, max: 25, label: 'Contributor Diversity', description: 'Excellent' },
    freshness: { score: 22, max: 25, label: 'Freshness', description: 'Excellent' },
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
    expect(screen.getByText(/healthy project/i)).toBeInTheDocument();
  });

  it('shows a critical recommendation when commit activity is very low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          commitActivity: { score: 0, max: 25, label: 'Commit Activity', description: 'No commits' },
        })}
      />
    );
    expect(screen.getByText(/commit activity/i)).toBeInTheDocument();
    expect(screen.getByText(/no recent commit/i)).toBeInTheDocument();
  });

  it('shows a warning when issue health is low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          issueHealth: { score: 5, max: 25, label: 'Issue Health', description: 'Low close rate' },
        })}
      />
    );
    expect(screen.getByText(/issue health/i)).toBeInTheDocument();
    expect(screen.getByText(/close rate/i)).toBeInTheDocument();
  });

  it('shows a warning when contributor diversity is low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          contributorDiversity: { score: 8, max: 25, label: 'Contributor Diversity', description: 'Few contributors' },
        })}
      />
    );
    expect(screen.getByText(/limited contributor/i)).toBeInTheDocument();
  });

  it('shows a critical warning for very low contributor diversity', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          contributorDiversity: { score: 2, max: 25, label: 'Contributor Diversity', description: 'Single contributor' },
        })}
      />
    );
    expect(screen.getByText(/bus factor/i)).toBeInTheDocument();
  });

  it('shows a critical recommendation when freshness is very low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          freshness: { score: 3, max: 25, label: 'Freshness', description: 'Very stale' },
        })}
      />
    );
    expect(screen.getByText(/freshness/i)).toBeInTheDocument();
    expect(screen.getByText(/stale/i)).toBeInTheDocument();
  });

  it('shows multiple recommendations when multiple metrics are low', () => {
    render(
      <Recommendations
        breakdown={makeBreakdown({
          commitActivity: { score: 2, max: 25, label: 'Commit Activity', description: 'Very low' },
          freshness: { score: 3, max: 25, label: 'Freshness', description: 'Stale' },
        })}
      />
    );
    expect(screen.getByText(/commit activity/i)).toBeInTheDocument();
    expect(screen.getByText(/freshness/i)).toBeInTheDocument();
  });

  it('renders with accessible structure', () => {
    render(<Recommendations breakdown={makeBreakdown()} />);
    expect(screen.getByRole('region', { name: /recommendations/i })).toBeInTheDocument();
  });

  it('uses appropriate ARIA severity indicators', () => {
    const { container } = render(
      <Recommendations
        breakdown={makeBreakdown({
          commitActivity: { score: 0, max: 25, label: 'Commit Activity', description: 'None' },
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
          issueHealth: { score: 12, max: 25, label: 'Issue Health', description: 'Fair' },
        })}
      />
    );
    expect(screen.getByText(/issue health/i)).toBeInTheDocument();
  });
});
