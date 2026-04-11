import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the ShareShed brand in the header', () => {
    render(<App />);
    const brandElements = screen.getAllByText('ShareShed');
    expect(brandElements.length).toBeGreaterThanOrEqual(1);
    // First occurrence is in the header
    expect(brandElements[0]).toBeInTheDocument();
  });

  it('renders the hero section with main tagline', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent('Borrow Tools from');
  });

  it('renders the Browse Tools CTA', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /browse tools/i })
    ).toBeInTheDocument();
  });

  it('renders the Lend a Tool button', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /lend a tool/i })
    ).toBeInTheDocument();
  });

  it('renders the How It Works section', () => {
    render(<App />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders featured tools on the home page', () => {
    render(<App />);
    expect(screen.getByText('Recently Added')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<App />);
    expect(
      screen.getByText(/dead simple neighborhood tool lending/i)
    ).toBeInTheDocument();
  });
});
