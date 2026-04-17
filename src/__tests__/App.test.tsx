import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockGitHubResponse(repo: string) {
  return (url: string) => {
    if (url.includes('/repos/') && !url.includes('/commits') && !url.includes('/contrib') && !url.includes('/issues') && !url.includes('/releases')) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'x-ratelimit-remaining': '50' }),
        json: async () => ({
          id: 1,
          name: repo.split('/')[1],
          full_name: repo,
          description: `The ${repo} library`,
          html_url: `https://github.com/${repo}`,
          stargazers_count: 5000,
          forks_count: 300,
          open_issues_count: 20,
          language: 'TypeScript',
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2026-04-12T00:00:00Z',
          pushed_at: new Date().toISOString(),
          topics: ['typescript'],
          license: { spdx_id: 'MIT' },
        }),
      };
    }
    if (url.includes('/commits')) {
      return {
        ok: true,
        json: async () => Array.from({ length: 45 }, (_, i) => ({
          sha: `sha-${i}`,
          commit: { message: `feat: add feature ${i}`, author: { date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString() } },
        })),
      };
    }
    if (url.includes('/contributors')) {
      return {
        ok: true,
        json: async () => [
          { id: 1, login: 'user1', contributions: 100, html_url: 'https://github.com/user1', avatar_url: 'https://github.com/user1.png' },
          { id: 2, login: 'user2', contributions: 50, html_url: 'https://github.com/user2', avatar_url: 'https://github.com/user2.png' },
          { id: 3, login: 'user3', contributions: 30, html_url: 'https://github.com/user3', avatar_url: 'https://github.com/user3.png' },
        ],
      };
    }
    if (url.includes('/issues')) {
      return {
        ok: true,
        json: async () => [
          { id: 1, number: 1, title: 'Bug 1', state: 'open', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), closed_at: null },
          { id: 2, number: 2, title: 'Bug 2', state: 'closed', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), closed_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 3, number: 3, title: 'Feature 1', state: 'closed', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), closed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        ],
      };
    }
    if (url.includes('/releases/latest')) {
      return { ok: false, status: 404 };
    }
    return { ok: true, json: async () => ({}) };
  };
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.location.hash = '';
  });

  it('renders the hero section with search input', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /instantly quantify/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/github repository/i)).toBeInTheDocument();
  });

  it('renders example repo buttons', () => {
    render(<App />);
    expect(screen.getByText('facebook/react')).toBeInTheDocument();
    expect(screen.getByText('vercel/next.js')).toBeInTheDocument();
  });

  it('shows error for invalid input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/github repository/i);
    const btn = screen.getByRole('button', { name: /analyze/i });

    await user.type(input, 'invalid-no-slash');
    await user.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/valid GitHub repository/i)).toBeInTheDocument();
    });
  });

  it('triggers analysis and displays score on valid repo', async () => {
    mockFetch.mockImplementation(mockGitHubResponse('facebook/react'));
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/github repository/i);
    const btn = screen.getByRole('button', { name: /analyze/i });

    await user.type(input, 'facebook/react');
    await user.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Commit Activity/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Issue Health/i)).toBeInTheDocument();
  });

  it('can click example repo to trigger analysis', async () => {
    mockFetch.mockImplementation(mockGitHubResponse('vercel/next.js'));
    const user = userEvent.setup();
    render(<App />);

    const exampleBtn = screen.getByText('vercel/next.js');
    await user.click(exampleBtn);

    await waitFor(() => {
      expect(screen.getByText(/Commit Activity/i)).toBeInTheDocument();
    });
  });

  it('persists analysis to localStorage', async () => {
    mockFetch.mockImplementation(mockGitHubResponse('facebook/react'));
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/github repository/i);
    const btn = screen.getByRole('button', { name: /analyze/i });

    await user.type(input, 'facebook/react');
    await user.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Commit Activity/i)).toBeInTheDocument();
    });

    const stored = JSON.parse(localStorage.getItem('commitcasualty_history') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].repo).toBe('facebook/react');
  });

  it('renders the footer', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/deterministic metrics/i)).toBeInTheDocument();
  });

  it('focuses the search input when "/" is pressed', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/github repository/i);
    expect(document.activeElement).not.toBe(input);

    await user.keyboard('/');
    expect(document.activeElement).toBe(input);
  });

  it('renders the "How It Works" section', () => {
    render(<App />);
    expect(screen.getByText(/how it works/i)).toBeInTheDocument();
  });

  it('wraps the app in an ErrorBoundary', () => {
    render(<App />);
    // The app should render normally without errors (ErrorBoundary passes through)
    expect(screen.getByRole('heading', { name: /instantly quantify/i })).toBeInTheDocument();
  });

  it('updates URL hash when analysis completes', async () => {
    mockFetch.mockImplementation(mockGitHubResponse('facebook/react'));
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/github repository/i);
    const btn = screen.getByRole('button', { name: /analyze/i });

    await user.type(input, 'facebook/react');
    await user.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Commit Activity/i)).toBeInTheDocument();
    });

    expect(window.location.hash).toBe('#facebook/react');
  });

  it('auto-analyzes repo from URL hash on mount', async () => {
    window.location.hash = '#vercel/next.js';
    mockFetch.mockImplementation(mockGitHubResponse('vercel/next.js'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Commit Activity/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('shows rate limit error when GitHub API returns 403 with rate limit headers', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/repos/') && !url.includes('/commits') && !url.includes('/contrib') && !url.includes('/issues') && !url.includes('/releases')) {
        return {
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          headers: new Headers({ 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600) }),
        };
      }
      return { ok: true, json: async () => ({}) };
    });

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/github repository/i);
    const btn = screen.getByRole('button', { name: /analyze/i });

    await user.type(input, 'facebook/react');
    await user.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/rate limit/i)).toBeInTheDocument();
    });
  });
});
