import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the ForkFate header', () => {
    render(<App />);
    expect(screen.getByText('ForkFate')).toBeInTheDocument();
  });

  it('renders the hero text when no data is loaded', () => {
    render(<App />);
    expect(screen.getByText(/Reveal Your Fork/)).toBeInTheDocument();
  });

  it('renders the repo URL input', () => {
    render(<App />);
    expect(screen.getByLabelText('GitHub Repository URL')).toBeInTheDocument();
  });

  it('renders the analyze button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Analyze repository/i })).toBeInTheDocument();
  });

  it('renders the dark mode toggle', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Switch to/i })).toBeInTheDocument();
  });

  it('has accessible landmark regions', () => {
    render(<App />);
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBeGreaterThanOrEqual(0);
  });
});
