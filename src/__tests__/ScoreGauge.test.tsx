import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ScoreGauge } from '../components/ScoreGauge';

describe('ScoreGauge', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the score number after animation', async () => {
    render(<ScoreGauge score={78} grade="A" />);
    await waitFor(() => {
      expect(screen.getByText('78')).toBeInTheDocument();
    }, { timeout: 3000 });
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

  it('renders correctly for low scores', async () => {
    render(<ScoreGauge score={15} grade="D" />);
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
    }, { timeout: 3000 });
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('renders correctly for high scores', async () => {
    render(<ScoreGauge score={95} grade="A+" />);
    await waitFor(() => {
      expect(screen.getByText('95')).toBeInTheDocument();
    }, { timeout: 3000 });
    expect(screen.getByText('A+')).toBeInTheDocument();
  });

  it('renders correctly for zero score', () => {
    render(<ScoreGauge score={0} grade="F" />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });
});
