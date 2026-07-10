import { describe, it, expect } from 'vitest';
import { computeReliabilityScore, computeManualScore } from '../lib/score-engine';
import type { GitHubRepo, GitHubContributor, GitHubIssue, ManualSignals } from '../lib/types';

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

    expect(breakdown.forkActivity).toBeDefined();
    expect(breakdown.communityVitality).toBeDefined();
    expect(breakdown.ecosystemDiversity).toBeDefined();
    expect(breakdown.evolutionaryFreshness).toBeDefined();

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

    expect(breakdown.ecosystemDiversity.score).toBe(0);
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

    expect(breakdown.communityVitality.score).toBeGreaterThan(0);
    expect(breakdown.communityVitality.description).toContain('No issues');
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

    expect(breakdown.ecosystemDiversity.description.toLowerCase()).toContain('single');
    expect(breakdown.ecosystemDiversity.score).toBeLessThan(10);
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

    expect(breakdown.evolutionaryFreshness.description.toLowerCase()).toContain('stale');
    expect(breakdown.evolutionaryFreshness.score).toBeLessThan(5);
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

describe('computeManualScore', () => {
  it('returns a score between 0 and 100', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 45,
      daysSinceLastCommit: 3,
      openIssues: 12,
      closedIssues: 50,
      contributors: 8,
    };
    const score = computeManualScore(signals);
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.grade).toBeDefined();
  });

  it('returns a valid grade letter', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 45,
      daysSinceLastCommit: 3,
      openIssues: 12,
      closedIssues: 50,
      contributors: 8,
    };
    const { grade } = computeManualScore(signals);
    expect(['A+', 'A', 'B', 'C', 'D', 'F']).toContain(grade);
  });

  it('scores low for inactive repo with zero signals', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 0,
      daysSinceLastCommit: 365,
      openIssues: 50,
      closedIssues: 2,
      contributors: 0,
    };
    const score = computeManualScore(signals);
    expect(score.total).toBeLessThan(30);
  });

  it('scores high for active healthy repo', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 200,
      daysSinceLastCommit: 1,
      openIssues: 5,
      closedIssues: 200,
      contributors: 60,
    };
    const score = computeManualScore(signals);
    expect(score.total).toBeGreaterThan(75);
    expect(score.grade).toMatch(/^[AB]/);
  });

  it('computes all four breakdown metrics', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 45,
      daysSinceLastCommit: 3,
      openIssues: 12,
      closedIssues: 50,
      contributors: 8,
    };
    const { breakdown } = computeManualScore(signals);

    expect(breakdown.forkActivity).toBeDefined();
    expect(breakdown.communityVitality).toBeDefined();
    expect(breakdown.ecosystemDiversity).toBeDefined();
    expect(breakdown.evolutionaryFreshness).toBeDefined();

    for (const metric of Object.values(breakdown)) {
      expect(metric.score).toBeGreaterThanOrEqual(0);
      expect(metric.score).toBeLessThanOrEqual(25);
      expect(metric.label).toBeTruthy();
      expect(metric.description).toBeTruthy();
    }
  });

  it('scores zero for commit activity with no commits', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 0,
      daysSinceLastCommit: 3,
      openIssues: 12,
      closedIssues: 50,
      contributors: 8,
    };
    const { breakdown } = computeManualScore(signals);
    expect(breakdown.forkActivity.score).toBe(0);
    expect(breakdown.forkActivity.description).toContain('No commits');
  });

  it('scores zero for ecosystem diversity with no contributors', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 45,
      daysSinceLastCommit: 3,
      openIssues: 12,
      closedIssues: 50,
      contributors: 0,
    };
    const { breakdown } = computeManualScore(signals);
    expect(breakdown.ecosystemDiversity.score).toBe(0);
  });

  it('handles single contributor with bus factor warning', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 20,
      daysSinceLastCommit: 3,
      openIssues: 5,
      closedIssues: 20,
      contributors: 1,
    };
    const { breakdown } = computeManualScore(signals);
    expect(breakdown.ecosystemDiversity.description.toLowerCase()).toContain('single');
    expect(breakdown.ecosystemDiversity.score).toBeLessThan(10);
  });

  it('computes issue close rate correctly', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 30,
      daysSinceLastCommit: 5,
      openIssues: 10,
      closedIssues: 90,
      contributors: 15,
    };
    const { breakdown } = computeManualScore(signals);
    expect(breakdown.communityVitality.description).toContain('90%');
    expect(breakdown.communityVitality.score).toBe(25); // Max score for 90% close rate
  });

  it('penalizes stale repos in freshness metric', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 0,
      daysSinceLastCommit: 365,
      openIssues: 5,
      closedIssues: 20,
      contributors: 3,
    };
    const { breakdown } = computeManualScore(signals);
    expect(breakdown.evolutionaryFreshness.description.toLowerCase()).toContain('stale');
    expect(breakdown.evolutionaryFreshness.score).toBeLessThanOrEqual(8);
  });

  it('rewards recent commits in freshness metric', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 50,
      daysSinceLastCommit: 0,
      openIssues: 5,
      closedIssues: 20,
      contributors: 10,
    };
    const { breakdown } = computeManualScore(signals);
    expect(breakdown.evolutionaryFreshness.score).toBe(25); // Max for 0 days
  });

  it('is deterministic — same inputs always produce same score', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 45,
      daysSinceLastCommit: 3,
      openIssues: 12,
      closedIssues: 50,
      contributors: 8,
    };
    const score1 = computeManualScore(signals);
    const score2 = computeManualScore(signals);
    expect(score1.total).toBe(score2.total);
    expect(score1.grade).toBe(score2.grade);
  });

  it('assigns A+ grade for total >= 90', () => {
    const signals: ManualSignals = {
      commitsLast90Days: 200,
      daysSinceLastCommit: 0,
      openIssues: 2,
      closedIssues: 200,
      contributors: 60,
    };
    const { grade, total } = computeManualScore(signals);
    expect(total).toBeGreaterThanOrEqual(90);
    expect(grade).toBe('A+');
  });
});
