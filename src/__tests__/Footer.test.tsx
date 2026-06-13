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
    expect(screen.getByText(/Open-Source Reliability Score/)).toBeInTheDocument();
  });

  it('has the contentinfo role for accessibility', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('mentions deterministic scoring', () => {
    render(<Footer />);
    expect(screen.getByText(/deterministic/i)).toBeInTheDocument();
  });

  it('mentions browser-based computation', () => {
    render(<Footer />);
    expect(screen.getByText(/runs entirely in your browser/i)).toBeInTheDocument();
  });
});
