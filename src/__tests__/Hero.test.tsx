import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from '../components/Hero';

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero onAnalyze={vi.fn()} status="idle" />);
    expect(screen.getByRole('heading', { name: /instantly quantify/i })).toBeInTheDocument();
  });

  it('renders the search input with accessible label', () => {
    render(<Hero onAnalyze={vi.fn()} status="idle" />);
    expect(screen.getByLabelText(/github repository/i)).toBeInTheDocument();
  });

  it('renders the analyze button', () => {
    render(<Hero onAnalyze={vi.fn()} status="idle" />);
    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
  });

  it('renders all example repo buttons', () => {
    render(<Hero onAnalyze={vi.fn()} status="idle" />);
    expect(screen.getByText('facebook/react')).toBeInTheDocument();
    expect(screen.getByText('vercel/next.js')).toBeInTheDocument();
    expect(screen.getByText('denoland/deno')).toBeInTheDocument();
    expect(screen.getByText('sveltejs/svelte')).toBeInTheDocument();
    expect(screen.getByText('microsoft/typescript')).toBeInTheDocument();
  });

  it('calls onAnalyze with the input value when form is submitted', async () => {
    const user = userEvent.setup();
    const onAnalyze = vi.fn();
    render(<Hero onAnalyze={onAnalyze} status="idle" />);

    const input = screen.getByLabelText(/github repository/i);
    await user.type(input, 'owner/repo');
    await user.click(screen.getByRole('button', { name: /analyze/i }));

    expect(onAnalyze).toHaveBeenCalledWith('owner/repo');
  });

  it('does not call onAnalyze with empty input', async () => {
    const user = userEvent.setup();
    const onAnalyze = vi.fn();
    render(<Hero onAnalyze={onAnalyze} status="idle" />);

    const btn = screen.getByRole('button', { name: /analyze/i });
    await user.click(btn);

    expect(onAnalyze).not.toHaveBeenCalled();
  });

  it('calls onAnalyze when clicking an example repo', async () => {
    const user = userEvent.setup();
    const onAnalyze = vi.fn();
    render(<Hero onAnalyze={onAnalyze} status="idle" />);

    await user.click(screen.getByText('vercel/next.js'));
    expect(onAnalyze).toHaveBeenCalledWith('vercel/next.js');
  });

  it('shows loading state on the button when status is loading', () => {
    render(<Hero onAnalyze={vi.fn()} status="loading" />);
    const btn = screen.getByRole('button', { name: /analyze/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Analyzing');
  });

  it('disables example repo buttons when loading', () => {
    render(<Hero onAnalyze={vi.fn()} status="loading" />);
    expect(screen.getByText('facebook/react')).toBeDisabled();
    expect(screen.getByText('vercel/next.js')).toBeDisabled();
  });

  it('renders the subtitle description', () => {
    render(<Hero onAnalyze={vi.fn()} status="idle" />);
    expect(screen.getByText(/commit activity/i)).toBeInTheDocument();
    expect(screen.getByText(/issue health/i)).toBeInTheDocument();
  });

  it('has an accessible search landmark', () => {
    render(<Hero onAnalyze={vi.fn()} status="idle" />);
    expect(screen.getByRole('search', { name: /search for a repository/i })).toBeInTheDocument();
  });
});
