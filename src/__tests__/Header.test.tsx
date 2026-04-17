import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../components/Header';

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders the brand name', () => {
    render(<Header />);
    expect(screen.getByText('CommitCasualty')).toBeInTheDocument();
  });

  it('renders a dark mode toggle button', () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(toggle).toBeInTheDocument();
  });

  it('toggles dark mode class on html element when clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // After toggling to dark, button label changes to "Switch to light mode"
    const lightToggle = screen.getByRole('button', { name: /switch to light mode/i });
    await user.click(lightToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('renders a link to GitHub', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders a home link', () => {
    render(<Header />);
    const home = screen.getByRole('link', { name: /commitcasualty home/i });
    expect(home).toBeInTheDocument();
  });
});
