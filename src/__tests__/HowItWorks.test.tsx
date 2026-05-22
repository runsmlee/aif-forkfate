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
    expect(screen.getByText('Fork Activity')).toBeInTheDocument();
    expect(screen.getByText('Community Vitality')).toBeInTheDocument();
    expect(screen.getByText('Ecosystem Diversity')).toBeInTheDocument();
    expect(screen.getByText('Evolutionary Freshness')).toBeInTheDocument();
  });

  it('explains what each metric measures', () => {
    render(<HowItWorks />);
    // Fork Activity: mentions commits and 90 days
    expect(screen.getByText(/non-merge commits over the last 90 days/i)).toBeInTheDocument();
    // Community Vitality: mentions issue resolution
    expect(screen.getByText(/issue resolution/i)).toBeInTheDocument();
    // Ecosystem Diversity: mentions contributor support
    expect(screen.getByText(/contributor support/i)).toBeInTheDocument();
    // Evolutionary Freshness: mentions evolving forks
    expect(screen.getByText(/fresh ones produce evolving forks/i)).toBeInTheDocument();
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
