import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, AnalysisSkeleton } from '../components/Skeleton';

describe('Skeleton', () => {
  it('renders a skeleton element', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.className).toContain('animate-pulse');
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
