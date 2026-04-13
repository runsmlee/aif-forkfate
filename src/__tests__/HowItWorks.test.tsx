import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HowItWorks } from '../components/HowItWorks';

describe('HowItWorks', () => {
  it('renders the section heading', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/how it works/i)).toBeInTheDocument();
  });

  it('describes all four scoring metrics', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Commit Activity')).toBeInTheDocument();
    expect(screen.getByText('Issue Health')).toBeInTheDocument();
    expect(screen.getByText('Contributor Diversity')).toBeInTheDocument();
    expect(screen.getByText('Freshness')).toBeInTheDocument();
  });

  it('explains what each metric measures', () => {
    render(<HowItWorks />);
    // Each metric card has a description — check that descriptions exist
    // Commit Activity: mentions commits and 90 days
    expect(screen.getByText(/non-merge commits over the last 90 days/i)).toBeInTheDocument();
    // Issue Health: mentions ratio of closed
    expect(screen.getByText(/ratio of closed to total/i)).toBeInTheDocument();
    // Contributor Diversity: mentions community
    expect(screen.getByText(/breadth of community support/i)).toBeInTheDocument();
    // Freshness: mentions release
    expect(screen.getByText(/recent release exists/i)).toBeInTheDocument();
  });

  it('mentions that scores are deterministic', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/deterministic/i)).toBeInTheDocument();
  });

  it('uses a semantic section element', () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector('section');
    expect(section).toBeTruthy();
    expect(section?.getAttribute('aria-label')).toBeTruthy();
  });
});
