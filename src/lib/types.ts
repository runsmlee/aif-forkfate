// CommitCasualty — Types for open-source reliability analysis

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  license: { spdx_id: string } | null;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

export interface GitHubContributor {
  id: number;
  login: string;
  contributions: number;
  html_url: string;
  avatar_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  closed_at: string | null;
  pull_request?: { html_url: string };
}

export interface RepoAnalysis {
  repo: string;
  timestamp: string;
  score: ReliabilityScore;
  repoData: GitHubRepo;
  commitCount: number;
  contributorCount: number;
  openIssueCount: number;
  closedIssueCount: number;
  lastCommitDate: string | null;
  lastReleaseDate: string | null;
}

export interface ReliabilityScore {
  total: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  commitActivity: MetricScore;
  issueHealth: MetricScore;
  contributorDiversity: MetricScore;
  freshness: MetricScore;
}

export interface MetricScore {
  score: number; // 0-25
  max: number;
  label: string;
  description: string;
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export const EXAMPLE_REPOS = [
  'facebook/react',
  'vercel/next.js',
  'denoland/deno',
  'sveltejs/svelte',
  'microsoft/typescript',
] as const;

export type ExampleRepo = (typeof EXAMPLE_REPOS)[number];
