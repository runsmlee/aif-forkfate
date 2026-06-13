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
    expect(screen.getByText(/non-merge commits on the default branch over the last 90 days/i)).toBeInTheDocument();
    // Community Vitality: mentions issue close rate
    expect(screen.getByText(/issue close rate/i)).toBeInTheDocument();
    // Ecosystem Diversity: mentions contributor breadth
    expect(screen.getByText(/contributor breadth/i)).toBeInTheDocument();
    // Evolutionary Freshness: mentions recently updated
    expect(screen.getByText(/how recently the project was updated/i)).toBeInTheDocument();
  });

  it('provides instructions on how to find each signal', () => {
    render(<HowItWorks />);
    // "How to find:" appears multiple times (once per metric)
    const howToFind = screen.getAllByText(/how to find:/i);
    expect(howToFind.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/github → repo → commits/i)).toBeInTheDocument();
    expect(screen.getByText(/github → repo → issues/i)).toBeInTheDocument();
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
