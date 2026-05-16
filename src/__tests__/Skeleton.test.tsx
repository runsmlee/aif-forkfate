import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, AnalysisSkeleton } from '../components/Skeleton';

describe('Skeleton', () => {
  it('renders a skeleton element with shimmer animation', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toBeTruthy();
    // Shimmer animation is on the inner child div
    const shimmerEl = el.querySelector('[class*="animate-shimmer"]');
    expect(shimmerEl).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-32');
  });

  it('is hidden from screen readers', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('AnalysisSkeleton', () => {
  it('renders a loading skeleton with aria-busy', () => {
    render(<AnalysisSkeleton />);
    const section = screen.getByRole('region', { name: /loading analysis/i });
    expect(section).toBeTruthy();
    expect(section.getAttribute('aria-busy')).toBe('true');
  });
});
