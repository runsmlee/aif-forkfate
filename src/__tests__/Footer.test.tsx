import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../components/Footer';

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('CommitCasualty')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/Instantly Quantify Open-Source Reliability/)).toBeInTheDocument();
  });

  it('has the contentinfo role for accessibility', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('mentions deterministic metrics', () => {
    render(<Footer />);
    expect(screen.getByText(/deterministic metrics/i)).toBeInTheDocument();
  });

  it('mentions GitHub API data', () => {
    render(<Footer />);
    expect(screen.getByText(/github api data/i)).toBeInTheDocument();
  });

  it('includes the disclaimer about results varying', () => {
    render(<Footer />);
    expect(screen.getByText(/results may vary/i)).toBeInTheDocument();
  });
});
