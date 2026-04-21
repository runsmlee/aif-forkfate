import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../components/MetricCard';

describe('MetricCard', () => {
  it('renders the label and score', () => {
    render(<MetricCard label="Commit Activity" score={20} max={25} description="Good activity" icon="🔥" />);
    expect(screen.getByText('Commit Activity')).toBeInTheDocument();
    expect(screen.getByText('20/25')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<MetricCard label="Test" score={15} max={25} description="Moderate score" icon="📊" />);
    expect(screen.getByText('Moderate score')).toBeInTheDocument();
  });

  it('hides the icon from screen readers', () => {
    render(<MetricCard label="Test" score={10} max={25} description="Low" icon="🐛" />);
    expect(screen.getByText('🐛')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a progress bar with correct ARIA attributes', () => {
    render(<MetricCard label="Freshness" score={18} max={25} description="Active" icon="🕐" />);
    const progressbar = screen.getByRole('progressbar', { name: 'Freshness: 18 of 25' });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '18');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '25');
  });

  it('applies green color for high scores (>=80%)', () => {
    const { container } = render(<MetricCard label="Test" score={21} max={25} description="Excellent" icon="✅" />);
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
  });

  it('applies blue color for good scores (>=60%)', () => {
    const { container } = render(<MetricCard label="Test" score={16} max={25} description="Good" icon="👍" />);
    expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
  });

  it('applies yellow color for moderate scores (>=40%)', () => {
    const { container } = render(<MetricCard label="Test" score={11} max={25} description="Moderate" icon="⚠️" />);
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument();
  });

  it('applies red color for low scores (<40%)', () => {
    const { container } = render(<MetricCard label="Test" score={5} max={25} description="Poor" icon="❌" />);
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
  });

  it('handles zero score', () => {
    render(<MetricCard label="Test" score={0} max={25} description="None" icon="∅" />);
    expect(screen.getByText('0/25')).toBeInTheDocument();
  });
});
