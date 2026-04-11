import { describe, it, expect } from 'vitest';
import { calculateSurvivalScore, buildTree } from '../lib/score-engine';
import type { ForkData } from '../lib/types';

function createMockFork(overrides: Partial<ForkData> = {}): ForkData {
  return {
    id: Math.random(),
    name: 'test-repo',
    owner: 'test-user',
    ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/0',
    fullName: 'test-user/test-repo',
    htmlUrl: 'https://github.com/test-user/test-repo',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    pushedAt: '2024-01-01T00:00:00Z',
    stargazersCount: 5,
    forksCount: 0,
    openIssuesCount: 0,
    description: null,
    parentId: null,
    commitCount: 10,
    isBehind: false,
    isAhead: true,
    divergedCommits: 0,
    branchCount: 1,
    status: 'alive',
    lastCommitDate: new Date(),
    commitFrequency: 2.5,
    activityScore: 50,
    ...overrides,
  };
}

describe('calculateSurvivalScore', () => {
  it('returns zero score for empty forks array', () => {
    const result = calculateSurvivalScore([]);
    expect(result.score).toBe(0);
    expect(result.totalForks).toBe(0);
    expect(result.activeForks).toBe(0);
  });

  it('calculates correct fork counts', () => {
    const forks = [
      createMockFork({ id: 1, status: 'alive' }),
      createMockFork({ id: 2, status: 'alive' }),
      createMockFork({ id: 3, status: 'dormant' }),
      createMockFork({ id: 4, status: 'dead' }),
    ];

    const result = calculateSurvivalScore(forks);
    expect(result.totalForks).toBe(4);
    expect(result.activeForks).toBe(2);
    expect(result.dormantForks).toBe(1);
    expect(result.deadForks).toBe(1);
  });

  it('produces a score between 0 and 100', () => {
    const forks = Array.from({ length: 20 }, (_, i) =>
      createMockFork({ id: i, status: i < 5 ? 'alive' : 'dead', activityScore: i < 5 ? 60 : 5 })
    );
    const result = calculateSurvivalScore(forks);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('counts derivative projects correctly', () => {
    const forks = [
      createMockFork({ id: 1, commitCount: 10, activityScore: 50 }),
      createMockFork({ id: 2, commitCount: 2, activityScore: 10 }),
      createMockFork({ id: 3, commitCount: 8, activityScore: 40 }),
    ];
    const result = calculateSurvivalScore(forks);
    expect(result.derivativeProjects).toBe(2); // forks 1 and 3 have 5+ commits AND score > 30
  });

  it('higher active ratio produces higher score', () => {
    const mostlyAlive = Array.from({ length: 10 }, (_, i) =>
      createMockFork({ id: i, status: i < 8 ? 'alive' : 'dead', activityScore: 60 })
    );
    const mostlyDead = Array.from({ length: 10 }, (_, i) =>
      createMockFork({ id: i + 100, status: i < 2 ? 'alive' : 'dead', activityScore: 60 })
    );

    const aliveResult = calculateSurvivalScore(mostlyAlive);
    const deadResult = calculateSurvivalScore(mostlyDead);
    expect(aliveResult.score).toBeGreaterThan(deadResult.score);
  });
});

describe('buildTree', () => {
  it('creates a root node with the given name', () => {
    const tree = buildTree([], 'owner/repo');
    expect(tree.id).toBe('root');
    expect(tree.name).toBe('owner/repo');
  });

  it('attaches top-level forks as children of root', () => {
    const forks = [
      createMockFork({ id: 1, parentId: null }),
      createMockFork({ id: 2, parentId: null }),
    ];
    const tree = buildTree(forks, 'owner/repo');
    expect(tree.children).toHaveLength(2);
  });

  it('nests child forks under their parents', () => {
    const forks = [
      createMockFork({ id: 1, parentId: null, name: 'parent' }),
      createMockFork({ id: 2, parentId: 1, name: 'child' }),
    ];
    const tree = buildTree(forks, 'owner/repo');
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0]!.children).toHaveLength(1);
    expect(tree.children[0]!.children[0]!.name).toBe('child');
  });
});
