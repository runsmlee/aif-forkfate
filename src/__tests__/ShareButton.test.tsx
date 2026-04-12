import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareButton } from '../components/ShareButton';
import type { RepoAnalysis } from '../lib/types';

const mockAnalysis: RepoAnalysis = {
  repo: 'facebook/react',
  timestamp: '2026-04-12T12:00:00Z',
  score: {
    total: 78,
    grade: 'A',
    breakdown: {
      commitActivity: { score: 20, max: 25, label: 'Commit Activity', description: 'Good — 47 commits' },
      issueHealth: { score: 22, max: 25, label: 'Issue Health', description: 'Healthy — 85% close rate' },
      contributorDiversity: { score: 18, max: 25, label: 'Contributor Diversity', description: 'Moderate — 8 contributors' },
      freshness: { score: 18, max: 25, label: 'Freshness', description: 'Updated 5 days ago' },
    },
  },
  repoData: {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'UI library',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 225000,
    forks_count: 46000,
    open_issues_count: 300,
    language: 'JavaScript',
    created_at: '2013-05-24T00:00:00Z',
    updated_at: '2026-04-12T00:00:00Z',
    pushed_at: '2026-04-11T00:00:00Z',
    topics: [],
    license: { spdx_id: 'MIT' },
  },
  commitCount: 47,
  contributorCount: 8,
  openIssueCount: 55,
  closedIssueCount: 250,
  lastCommitDate: '2026-04-11T00:00:00Z',
  lastReleaseDate: null,
};

describe('ShareButton', () => {
  it('renders a share button with correct label', () => {
    render(<ShareButton analysis={mockAnalysis} />);
    expect(screen.getByRole('button', { name: /share score/i })).toBeInTheDocument();
  });

  it('shows "Copied!" feedback after clicking when share API unavailable', async () => {
    // Ensure share API is unavailable so clipboard path is used
    Object.defineProperty(navigator, 'share', { value: undefined, writable: true, configurable: true });

    const user = userEvent.setup();
    render(<ShareButton analysis={mockAnalysis} />);
    const btn = screen.getByRole('button', { name: /share score/i });
    await user.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    // Verify aria-label updates
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });

  it('uses Web Share API when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, writable: true, configurable: true });

    const user = userEvent.setup();
    render(<ShareButton analysis={mockAnalysis} />);
    const btn = screen.getByRole('button', { name: /share score/i });
    await user.click(btn);

    await waitFor(() => {
      expect(share).toHaveBeenCalledOnce();
    });
    expect(share.mock.calls[0][0].title).toContain('facebook/react');
    // Should NOT show "Copied!" since share succeeded
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });

  it('falls back to clipboard when share is cancelled', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('User cancelled', 'AbortError'));
    Object.defineProperty(navigator, 'share', { value: share, writable: true, configurable: true });

    const user = userEvent.setup();
    render(<ShareButton analysis={mockAnalysis} />);
    const btn = screen.getByRole('button', { name: /share score/i });
    await user.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });
});
