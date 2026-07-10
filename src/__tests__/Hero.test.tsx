import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from '../components/Hero';

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { name: /how reliable is that repo/i })).toBeInTheDocument();
  });

  it('renders all 5 signal input fields', () => {
    render(<Hero />);
    expect(screen.getByLabelText(/commits \(last 90 days\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/days since last commit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/open issues/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/closed issues/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contributors/i)).toBeInTheDocument();
  });

  it('renders input fields with correct types and placeholders', () => {
    render(<Hero />);
    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i) as HTMLInputElement;
    expect(commitsInput.type).toBe('number');
    expect(commitsInput.placeholder).toBe('e.g. 45');
  });

  it('renders the subtitle description about reliability scoring', () => {
    render(<Hero />);
    expect(screen.getByText(/enter five signals/i)).toBeInTheDocument();
  });

  it('has an accessible calculator landmark', () => {
    render(<Hero />);
    expect(screen.getByRole('group', { name: /repository signal inputs/i })).toBeInTheDocument();
  });

  it('shows empty state placeholder when no inputs are filled', () => {
    render(<Hero />);
    expect(screen.getByText(/enter at least one signal/i)).toBeInTheDocument();
  });

  it('computes and displays score when a signal is entered', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '45');

    // Score display should appear (grade label)
    expect(screen.getByLabelText(/reliability grade:/i)).toBeInTheDocument();
  });

  it('shows metric breakdown cards when score is computed', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '45');

    expect(screen.getByRole('heading', { name: /commit activity/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /community vitality/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ecosystem diversity/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /evolutionary freshness/i })).toBeInTheDocument();
  });

  it('calls onScoreComputed when signal values change', async () => {
    const onScoreComputed = vi.fn();
    const user = userEvent.setup();
    render(<Hero onScoreComputed={onScoreComputed} />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '45');

    // onScoreComputed should be called for each digit typed (4, 45)
    expect(onScoreComputed).toHaveBeenCalled();
    const lastCall = onScoreComputed.mock.calls[onScoreComputed.mock.calls.length - 1];
    expect(lastCall[1].commitsLast90Days).toBe(45);
    expect(lastCall[0].total).toBeGreaterThan(0);
  });

  it('has a reset button that clears all inputs', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i) as HTMLInputElement;
    await user.type(commitsInput, '45');
    expect(commitsInput.value).toBe('45');

    // Reset button should appear after entering data
    const resetBtn = screen.getByRole('button', { name: /clear all inputs/i });
    await user.click(resetBtn);

    // After reset, the empty state should show again
    expect(screen.getByText(/enter at least one signal/i)).toBeInTheDocument();
  });

  it('displays reliability band label (Critical/Warning/Healthy) when score is shown', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const commitsInput = screen.getByLabelText(/commits \(last 90 days\)/i);
    await user.type(commitsInput, '100');

    // A high commit count should produce a score with a visible reliability band
    const band = screen.getByLabelText(/reliability band:/i);
    expect(band).toBeInTheDocument();
    expect(band.textContent).toMatch(/Healthy|Warning|Critical/);
  });

  it('renders hint text for each signal input', () => {
    render(<Hero />);
    expect(screen.getByText(/count non-merge commits/i)).toBeInTheDocument();
    expect(screen.getByText(/days since the most recent push/i)).toBeInTheDocument();
    expect(screen.getByText(/current number of open issues/i)).toBeInTheDocument();
    expect(screen.getByText(/total number of closed issues/i)).toBeInTheDocument();
    expect(screen.getByText(/number of users who have committed/i)).toBeInTheDocument();
  });
});
