// CommitCasualty — Deterministic reliability scoring engine
import type {
  ReliabilityScore,
  ScoreBreakdown,
  MetricScore,
  GitHubRepo,
  GitHubContributor,
  GitHubIssue,
} from './types';

const MAX_PER_METRIC = 25;

function gradeFromTotal(total: number): ReliabilityScore['grade'] {
  if (total >= 90) return 'A+';
  if (total >= 75) return 'A';
  if (total >= 55) return 'B';
  if (total >= 35) return 'C';
  if (total >= 20) return 'D';
  return 'F';
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(MAX_PER_METRIC, Math.round(score)));
}

// Commit Activity: How active is the project?
// Based on non-merge commits in the last 90 days
function scoreCommitActivity(commitCount: number, stargazers: number): MetricScore {
  // Scale expectations by project popularity
  // Small projects (<100 stars) don't need as many commits
  const isPopular = stargazers >= 100;
  const threshold = isPopular ? 100 : 30;

  let score: number;
  let description: string;

  if (commitCount >= threshold) {
    score = MAX_PER_METRIC;
    description = `Excellent — ${commitCount} commits in 90 days`;
  } else if (commitCount >= threshold * 0.5) {
    score = MAX_PER_METRIC * 0.75;
    description = `Good — ${commitCount} commits in 90 days`;
  } else if (commitCount >= threshold * 0.2) {
    score = MAX_PER_METRIC * 0.5;
    description = `Moderate — ${commitCount} commits in 90 days`;
  } else if (commitCount > 0) {
    score = MAX_PER_METRIC * 0.25;
    description = `Low — only ${commitCount} commits in 90 days`;
  } else {
    score = 0;
    description = 'No commits in the last 90 days';
  }

  return {
    score: clampScore(score),
    max: MAX_PER_METRIC,
    label: 'Commit Activity',
    description,
  };
}

// Issue Health: Are issues being resolved?
// Based on open/closed ratio
function scoreIssueHealth(open: GitHubIssue[], closed: GitHubIssue[]): MetricScore {
  const openCount = open.length;
  const closedCount = closed.length;
  const total = openCount + closedCount;

  let score: number;
  let description: string;

  if (total === 0) {
    // No issues at all — could be new project or very clean
    score = MAX_PER_METRIC * 0.7;
    description = 'No issues tracked yet';
  } else {
    const closeRate = closedCount / total;

    if (closeRate >= 0.85) {
      score = MAX_PER_METRIC;
      description = `Healthy — ${Math.round(closeRate * 100)}% issue close rate`;
    } else if (closeRate >= 0.7) {
      score = MAX_PER_METRIC * 0.8;
      description = `Good — ${Math.round(closeRate * 100)}% issue close rate`;
    } else if (closeRate >= 0.5) {
      score = MAX_PER_METRIC * 0.6;
      description = `Fair — ${Math.round(closeRate * 100)}% issue close rate`;
    } else if (closeRate >= 0.3) {
      score = MAX_PER_METRIC * 0.4;
      description = `Concerning — ${Math.round(closeRate * 100)}% issue close rate`;
    } else {
      score = MAX_PER_METRIC * 0.2;
      description = `Unhealthy — only ${Math.round(closeRate * 100)}% issue close rate`;
    }
  }

  return {
    score: clampScore(score),
    max: MAX_PER_METRIC,
    label: 'Issue Health',
    description,
  };
}

// Contributor Diversity: Is the project supported by many people?
// Based on contributor count and distribution
function scoreContributorDiversity(contributors: GitHubContributor[]): MetricScore {
  const count = contributors.length;

  let score: number;
  let description: string;

  if (count >= 50) {
    score = MAX_PER_METRIC;
    description = `Excellent — ${count} contributors`;
  } else if (count >= 20) {
    score = MAX_PER_METRIC * 0.85;
    description = `Great — ${count} contributors`;
  } else if (count >= 10) {
    score = MAX_PER_METRIC * 0.7;
    description = `Good — ${count} contributors`;
  } else if (count >= 5) {
    score = MAX_PER_METRIC * 0.5;
    description = `Moderate — ${count} contributors`;
  } else if (count >= 2) {
    score = MAX_PER_METRIC * 0.3;
    description = `Low — ${count} contributors`;
  } else if (count === 1) {
    score = MAX_PER_METRIC * 0.15;
    description = 'Single contributor — bus factor risk';
  } else {
    score = 0;
    description = 'No contributor data available';
  }

  // Bonus: check for bus factor (top contributor % of total commits)
  if (count >= 3) {
    const totalCommits = contributors.reduce((sum, c) => sum + c.contributions, 0);
    const topContributor = contributors[0].contributions;
    const topRatio = totalCommits > 0 ? topContributor / totalCommits : 1;

    if (topRatio <= 0.3) {
      // Well distributed — small bonus
      score = clampScore(score + MAX_PER_METRIC * 0.1);
      description += ', well-distributed';
    } else if (topRatio > 0.7) {
      // One-person project concern
      score = clampScore(score - MAX_PER_METRIC * 0.1);
      description += ', concentrated on single maintainer';
    }
  }

  return {
    score: clampScore(score),
    max: MAX_PER_METRIC,
    label: 'Contributor Diversity',
    description,
  };
}

// Freshness: How recently was the project updated?
// Based on days since last commit and last release
function scoreFreshness(
  pushedAt: string,
  latestRelease: { tag_name?: string; published_at: string } | null
): MetricScore {
  const now = Date.now();
  const daysSinceCommit = (now - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24);

  let score: number;
  let description: string;

  if (daysSinceCommit <= 1) {
    score = MAX_PER_METRIC;
    description = 'Updated today — very active';
  } else if (daysSinceCommit <= 7) {
    score = MAX_PER_METRIC * 0.9;
    description = `Updated ${Math.round(daysSinceCommit)} days ago — active`;
  } else if (daysSinceCommit <= 30) {
    score = MAX_PER_METRIC * 0.75;
    description = `Updated ${Math.round(daysSinceCommit)} days ago`;
  } else if (daysSinceCommit <= 90) {
    score = MAX_PER_METRIC * 0.5;
    description = `Updated ${Math.round(daysSinceCommit)} days ago — slowing`;
  } else if (daysSinceCommit <= 180) {
    score = MAX_PER_METRIC * 0.3;
    description = `Updated ${Math.round(daysSinceCommit)} days ago — stale`;
  } else {
    score = MAX_PER_METRIC * 0.1;
    description = `Updated ${Math.round(daysSinceCommit)} days ago — very stale`;
  }

  // Bonus for recent release
  if (latestRelease) {
    const daysSinceRelease =
      (now - new Date(latestRelease.published_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceRelease <= 30) {
      score = clampScore(score + MAX_PER_METRIC * 0.15);
      description += ` | Released ${latestRelease.tag_name}`;
    } else if (daysSinceRelease <= 90) {
      score = clampScore(score + MAX_PER_METRIC * 0.08);
    }
  } else {
    description += ' | No releases';
  }

  return {
    score: clampScore(score),
    max: MAX_PER_METRIC,
    label: 'Freshness',
    description,
  };
}

export function computeReliabilityScore(params: {
  repoData: GitHubRepo;
  commitCount: number;
  contributors: GitHubContributor[];
  openIssues: GitHubIssue[];
  closedIssues: GitHubIssue[];
  latestRelease: { tag_name: string; published_at: string } | null;
}): ReliabilityScore {
  const breakdown: ScoreBreakdown = {
    commitActivity: scoreCommitActivity(params.commitCount, params.repoData.stargazers_count),
    issueHealth: scoreIssueHealth(params.openIssues, params.closedIssues),
    contributorDiversity: scoreContributorDiversity(params.contributors),
    freshness: scoreFreshness(params.repoData.pushed_at, params.latestRelease),
  };

  const total =
    breakdown.commitActivity.score +
    breakdown.issueHealth.score +
    breakdown.contributorDiversity.score +
    breakdown.freshness.score;

  return {
    total,
    grade: gradeFromTotal(total),
    breakdown,
  };
}
