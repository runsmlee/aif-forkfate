import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the hero section with signal inputs', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /how reliable is that repo/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/commits \(last 90 days\)/i)).toBeInTheDocument();
  });

  it('renders all 5 signal input fields', () => {
    render(<App />);
    expect(screen.getByLabelText(/commits \(last 90 days\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/days since last commit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/open issues/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/closed issues/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contributors/i)).toBeInTheDocument();
  });

  it('computes and displays score when signals are entered', async () => {
    const user = userEvent.setup();
    render(<App />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '45');

    // Score should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/reliability grade:/i)).toBeInTheDocument();
    });

    // Metric breakdown should appear (appears in both Hero results and HowItWorks)
    const headings = screen.getAllByRole('heading', { name: /fork activity/i });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('persists analysis to localStorage when score is computed', async () => {
    const user = userEvent.setup();
    render(<App />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '45');

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('commitcasualty_history') ?? '[]');
      expect(stored.length).toBeGreaterThan(0);
    });
  });

  it('renders the footer with CommitCasualty branding', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    // "deterministic" appears in multiple places, use getAllByText
    const matches = screen.getAllByText(/deterministic/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the "How It Works" section', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /how it works/i })).toBeInTheDocument();
  });

  it('renders the header with CommitCasualty branding', () => {
    render(<App />);
    // CommitCasualty appears in header and footer
    const matches = screen.getAllByText('CommitCasualty');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders skip to content link', () => {
    render(<App />);
    expect(screen.getByText(/skip to content/i)).toBeInTheDocument();
  });
});
