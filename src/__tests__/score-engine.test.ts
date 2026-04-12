import { describe, it, expect } from 'vitest';
import { computeReliabilityScore } from '../lib/score-engine';
import type { GitHubRepo, GitHubContributor, GitHubIssue } from '../lib/types';

const makeRepo = (overrides: Partial<GitHubRepo> = {}): GitHubRepo => ({
  id: 1,
  name: 'test-repo',
  full_name: 'owner/test-repo',
  description: 'A test repo',
  html_url: 'https://github.com/owner/test-repo',
  stargazers_count: 500,
  forks_count: 50,
  open_issues_count: 10,
  language: 'TypeScript',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
  pushed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  topics: [],
  license: { spdx_id: 'MIT' },
  ...overrides,
});

const makeContributor = (contributions: number, login = 'user'): GitHubContributor => ({
  id: 1,
  login,
  contributions,
  html_url: `https://github.com/${login}`,
  avatar_url: `https://github.com/${login}.png`,
});

const makeIssue = (state: 'open' | 'closed', daysAgo = 30): GitHubIssue => ({
  id: 1,
  number: 1,
  title: 'Test issue',
  state,
  created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  closed_at: state === 'closed' ? new Date(Date.now() - (daysAgo - 5) * 24 * 60 * 60 * 1000).toISOString() : null,
});

describe('computeReliabilityScore', () => {
  it('returns a score between 0 and 100', () => {
    const score = computeReliabilityScore({
      repoData: makeRepo(),
      commitCount: 50,
      contributors: [makeContributor(30), makeContributor(20, 'user2')],
      openIssues: [makeIssue('open')],
      closedIssues: [makeIssue('closed'), makeIssue('closed'), makeIssue('closed')],
      latestRelease: { tag_name: 'v1.0.0', published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    });

    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.grade).toBeDefined();
  });

  it('returns a valid grade letter', () => {
    const { grade } = computeReliabilityScore({
      repoData: makeRepo(),
      commitCount: 50,
      contributors: [makeContributor(30)],
      openIssues: [],
      closedIssues: [makeIssue('closed')],
      latestRelease: null,
    });

    expect(['A+', 'A', 'B', 'C', 'D', 'F']).toContain(grade);
  });

  it('scores low for inactive repo', () => {
    const score = computeReliabilityScore({
      repoData: makeRepo({
        pushed_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      }),
      commitCount: 0,
      contributors: [],
      openIssues: [makeIssue('open', 200), makeIssue('open', 180)],
      closedIssues: [],
      latestRelease: null,
    });

    expect(score.total).toBeLessThan(30);
    expect(score.grade).toMatch(/^[DF]$/);
  });

  it('scores high for active, healthy repo', () => {
    const contributors = Array.from({ length: 30 }, (_, i) =>
      makeContributor(100 - i * 3, `user${i}`)
    );

    const score = computeReliabilityScore({
      repoData: makeRepo({
        pushed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        stargazers_count: 1000,
      }),
      commitCount: 150,
      contributors,
      openIssues: [makeIssue('open', 5)],
      closedIssues: Array.from({ length: 50 }, () => makeIssue('closed')),
      latestRelease: { tag_name: 'v2.0.0', published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    });

    expect(score.total).toBeGreaterThan(75);
  });

  it('scores all four breakdown metrics', () => {
    const { breakdown } = computeReliabilityScore({
      repoData: makeRepo(),
      commitCount: 30,
      contributors: [makeContributor(50), makeContributor(30, 'user2'), makeContributor(20, 'user3')],
      openIssues: [makeIssue('open')],
      closedIssues: [makeIssue('closed'), makeIssue('closed')],
      latestRelease: { tag_name: 'v1.0', published_at: new Date().toISOString() },
    });

    expect(breakdown.commitActivity).toBeDefined();
    expect(breakdown.issueHealth).toBeDefined();
    expect(breakdown.contributorDiversity).toBeDefined();
    expect(breakdown.freshness).toBeDefined();

    for (const metric of Object.values(breakdown)) {
      expect(metric.score).toBeGreaterThanOrEqual(0);
      expect(metric.score).toBeLessThanOrEqual(25);
      expect(metric.label).toBeTruthy();
      expect(metric.description).toBeTruthy();
    }
  });

  it('handles empty contributors gracefully', () => {
    const { breakdown } = computeReliabilityScore({
      repoData: makeRepo(),
      commitCount: 5,
      contributors: [],
      openIssues: [],
      closedIssues: [],
      latestRelease: null,
    });

    expect(breakdown.contributorDiversity.score).toBe(0);
  });

  it('handles no issues gracefully', () => {
    const { breakdown } = computeReliabilityScore({
      repoData: makeRepo(),
      commitCount: 50,
      contributors: [makeContributor(30)],
      openIssues: [],
      closedIssues: [],
      latestRelease: null,
    });

    expect(breakdown.issueHealth.score).toBeGreaterThan(0);
    expect(breakdown.issueHealth.description).toContain('No issues');
  });

  it('penalizes single-contributor repos', () => {
    const { breakdown } = computeReliabilityScore({
      repoData: makeRepo(),
      commitCount: 20,
      contributors: [makeContributor(100)],
      openIssues: [],
      closedIssues: [makeIssue('closed')],
      latestRelease: null,
    });

    expect(breakdown.contributorDiversity.description.toLowerCase()).toContain('single');
    expect(breakdown.contributorDiversity.score).toBeLessThan(10);
  });

  it('penalizes very stale repos', () => {
    const { breakdown } = computeReliabilityScore({
      repoData: makeRepo({
        pushed_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      }),
      commitCount: 0,
      contributors: [makeContributor(10)],
      openIssues: [],
      closedIssues: [makeIssue('closed')],
      latestRelease: null,
    });

    expect(breakdown.freshness.description.toLowerCase()).toContain('stale');
    expect(breakdown.freshness.score).toBeLessThan(5);
  });

  it('assigns A+ grade for total >= 90', () => {
    // Create a scenario that should yield 90+ total
    const contributors = Array.from({ length: 60 }, (_, i) =>
      makeContributor(50 - i, `user${i}`)
    );

    const { grade } = computeReliabilityScore({
      repoData: makeRepo({
        pushed_at: new Date().toISOString(),
        stargazers_count: 5000,
      }),
      commitCount: 200,
      contributors,
      openIssues: [makeIssue('open', 2)],
      closedIssues: Array.from({ length: 80 }, () => makeIssue('closed', 10)),
      latestRelease: { tag_name: 'v3.0', published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    });

    expect(grade).toBe('A+');
  });
});
