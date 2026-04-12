// CommitCasualty — GitHub API integration
import type {
  GitHubRepo,
  GitHubCommit,
  GitHubContributor,
  GitHubIssue,
} from './types';

const GITHUB_API = 'https://api.github.com';
const REQUEST_HEADERS: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json',
};

function apiError(message: string, status: number): Error {
  const err = new Error(message);
  (err as Error & { status: number }).status = status;
  return err;
}

export async function fetchRepo(
  owner: string,
  repo: string
): Promise<GitHubRepo> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: REQUEST_HEADERS,
  });
  if (!res.ok) {
    if (res.status === 404) throw apiError(`Repository ${owner}/${repo} not found`, 404);
    throw apiError(`Failed to fetch repository: ${res.statusText}`, res.status);
  }
  return res.json() as Promise<GitHubRepo>;
}

export async function fetchCommits(
  owner: string,
  repo: string,
  since: string,
  perPage = 100
): Promise<GitHubCommit[]> {
  const url = new URL(`${GITHUB_API}/repos/${owner}/${repo}/commits`);
  url.searchParams.set('since', since);
  url.searchParams.set('per_page', String(perPage));

  const res = await fetch(url.toString(), { headers: REQUEST_HEADERS });
  if (!res.ok) throw apiError(`Failed to fetch commits: ${res.statusText}`, res.status);
  const commits = (await res.json()) as GitHubCommit[];

  // Filter out merge commits for more accurate count
  return commits.filter(
    (c) => !c.commit.message.startsWith('Merge') && !c.commit.message.startsWith(' chore')
  );
}

export async function fetchContributors(
  owner: string,
  repo: string,
  perPage = 30
): Promise<GitHubContributor[]> {
  const url = new URL(`${GITHUB_API}/repos/${owner}/${repo}/contributors`);
  url.searchParams.set('per_page', String(perPage));

  const res = await fetch(url.toString(), { headers: REQUEST_HEADERS });
  if (!res.ok) throw apiError(`Failed to fetch contributors: ${res.statusText}`, res.status);
  return res.json() as Promise<GitHubContributor[]>;
}

export async function fetchIssues(
  owner: string,
  repo: string,
  state: 'open' | 'all' = 'all',
  perPage = 100
): Promise<GitHubIssue[]> {
  const url = new URL(`${GITHUB_API}/repos/${owner}/${repo}/issues`);
  url.searchParams.set('state', state);
  url.searchParams.set('per_page', String(perPage));

  const res = await fetch(url.toString(), { headers: REQUEST_HEADERS });
  if (!res.ok) throw apiError(`Failed to fetch issues: ${res.statusText}`, res.status);
  const issues = (await res.json()) as GitHubIssue[];

  // Filter out pull requests (GitHub includes them in issues API)
  return issues.filter((i) => !i.pull_request);
}

export async function fetchLatestRelease(
  owner: string,
  repo: string
): Promise<{ tag_name: string; published_at: string } | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/releases/latest`,
    { headers: REQUEST_HEADERS }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw apiError(`Failed to fetch release: ${res.statusText}`, res.status);
  return res.json() as Promise<{ tag_name: string; published_at: string }>;
}

export async function analyzeRepo(
  ownerRepo: string
): Promise<{
  repoData: GitHubRepo;
  commitCount: number;
  contributors: GitHubContributor[];
  openIssues: GitHubIssue[];
  closedIssues: GitHubIssue[];
  latestRelease: { tag_name: string; published_at: string } | null;
}> {
  const [owner, repo] = ownerRepo.split('/');
  if (!owner || !repo) throw apiError('Invalid repository format. Use owner/repo', 400);

  // 90 days ago for commit activity
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const [repoData, commits, contributors, openIssues, closedIssues, latestRelease] =
    await Promise.all([
      fetchRepo(owner, repo),
      fetchCommits(owner, repo, since).catch(() => []),
      fetchContributors(owner, repo).catch(() => []),
      fetchIssues(owner, repo, 'open'),
      fetchIssues(owner, repo, 'all'),
      fetchLatestRelease(owner, repo),
    ]);

  const closed = closedIssues.filter((i) => i.state === 'closed');

  return {
    repoData,
    commitCount: commits.length,
    contributors,
    openIssues,
    closedIssues: closed,
    latestRelease,
  };
}
