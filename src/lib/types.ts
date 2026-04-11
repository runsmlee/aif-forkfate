export interface ForkData {
  id: number;
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  fullName: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  description: string | null;
  parentId: number | null;
  commitCount: number;
  isBehind: boolean;
  isAhead: boolean;
  divergedCommits: number;
  branchCount: number;
  status: ForkStatus;
  lastCommitDate: Date;
  commitFrequency: number; // commits per month
  activityScore: number; // 0-100
}

export type ForkStatus = 'alive' | 'dormant' | 'dead';

export interface RepoData {
  id: number;
  name: string;
  owner: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  stargazersCount: number;
  forksCount: number;
  watchersCount: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  language: string | null;
  license: string | null;
}

export interface SurvivalScoreResult {
  score: number; // 0-100
  totalForks: number;
  activeForks: number;
  dormantForks: number;
  deadForks: number;
  derivativeProjects: number; // forks with 5+ independent commits
  maxChainDepth: number;
  influenceScore: number;
}

export interface TreeNode {
  id: string;
  forkId: number;
  name: string;
  owner: string;
  status: ForkStatus;
  commitCount: number;
  activityScore: number;
  children: TreeNode[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface HistoricalDataPoint {
  month: string;
  score: number;
  activeForks: number;
}
