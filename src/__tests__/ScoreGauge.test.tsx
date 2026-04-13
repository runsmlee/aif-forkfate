import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreGauge } from '../components/ScoreGauge';

describe('ScoreGauge', () => {
  it('renders the score number', () => {
    render(<ScoreGauge score={78} grade="A" />);
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('renders the grade letter', () => {
    render(<ScoreGauge score={78} grade="A" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders an SVG gauge element', () => {
    const { container } = render(<ScoreGauge score={78} grade="A" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('uses accessible labeling', () => {
    render(<ScoreGauge score={78} grade="A" />);
    // Should have an accessible label describing the score
    const gauge = screen.getByRole('img');
    expect(gauge).toBeTruthy();
  });

  it('renders correctly for low scores', () => {
    render(<ScoreGauge score={15} grade="D" />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('renders correctly for high scores', () => {
    render(<ScoreGauge score={95} grade="A+" />);
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('A+')).toBeInTheDocument();
  });

  it('renders correctly for zero score', () => {
    render(<ScoreGauge score={0} grade="F" />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });
});
