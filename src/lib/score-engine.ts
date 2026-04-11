import type { ForkData, SurvivalScoreResult, TreeNode, HistoricalDataPoint } from './types';

/**
 * Calculate the Fork Survival Score — the core metric.
 *
 * Formula considers:
 * - Activity ratio: What % of forks are still alive
 * - Influence spread: How many forks have meaningful independent development
 * - Depth factor: Longest chain of active forks indicates sustained evolution
 * - Weighted by total volume to avoid small-sample bias
 */
export function calculateSurvivalScore(forks: ForkData[]): SurvivalScoreResult {
  if (forks.length === 0) {
    return {
      score: 0,
      totalForks: 0,
      activeForks: 0,
      dormantForks: 0,
      deadForks: 0,
      derivativeProjects: 0,
      maxChainDepth: 0,
      influenceScore: 0,
    };
  }

  const totalForks = forks.length;
  const activeForks = forks.filter((f) => f.status === 'alive').length;
  const dormantForks = forks.filter((f) => f.status === 'dormant').length;
  const deadForks = forks.filter((f) => f.status === 'dead').length;

  // Derivative projects: forks with independent direction (5+ commits, activity score > 30)
  const derivativeProjects = forks.filter(
    (f) => f.commitCount >= 5 && f.activityScore > 30
  ).length;

  // Activity ratio: percentage of forks that are alive
  const activityRatio = activeForks / totalForks;

  // Influence ratio: how many forks created derivative work
  const influenceRatio = derivativeProjects / totalForks;

  // Engagement quality: average activity score of alive forks
  const aliveForks = forks.filter((f) => f.status === 'alive');
  const avgActivityScore =
    aliveForks.length > 0
      ? aliveForks.reduce((sum, f) => sum + f.activityScore, 0) / aliveForks.length
      : 0;

  // Volume factor: logarithmic scaling to reward scale without linear bias
  const volumeFactor = Math.min(1, Math.log10(totalForks + 1) / 3);

  // Composite score (0-100)
  const rawScore =
    activityRatio * 40 + // 40% weight on activity
    influenceRatio * 30 + // 30% weight on influence
    (avgActivityScore / 100) * 20 + // 20% weight on quality
    volumeFactor * 10; // 10% weight on volume

  const score = Math.round(rawScore * 10) / 10;

  // Max chain depth: longest chain of consecutive forks
  const maxChainDepth = calculateMaxChainDepth(forks);

  // Influence score: separate metric for influence display
  const influenceScore = Math.round(
    (influenceRatio * 60 + volumeFactor * 40) * 10
  ) / 10;

  return {
    score: Math.min(100, Math.max(0, score)),
    totalForks,
    activeForks,
    dormantForks,
    deadForks,
    derivativeProjects,
    maxChainDepth,
    influenceScore: Math.min(100, influenceScore),
  };
}

function calculateMaxChainDepth(forks: ForkData[]): number {
  if (forks.length === 0) return 0;

  // Build adjacency from parent relationships
  const childrenMap = new Map<number, ForkData[]>();
  const rootIds: number[] = [];

  forks.forEach((fork) => {
    if (fork.parentId === null) {
      rootIds.push(fork.id);
    } else {
      const children = childrenMap.get(fork.parentId) ?? [];
      children.push(fork);
      childrenMap.set(fork.parentId, children);
    }
  });

  let maxDepth = 1;
  function dfs(forkId: number, depth: number): void {
    maxDepth = Math.max(maxDepth, depth);
    const children = childrenMap.get(forkId) ?? [];
    children.forEach((child) => dfs(child.id, depth + 1));
  }

  rootIds.forEach((id) => dfs(id, 1));
  // Also start from any fork whose parent isn't in our dataset
  forks.forEach((fork) => {
    if (fork.parentId !== null && !forks.some((f) => f.id === fork.parentId)) {
      dfs(fork.id, 1);
    }
  });

  return maxDepth;
}

/**
 * Build a tree structure from flat fork data for D3 visualization.
 */
export function buildTree(forks: ForkData[], rootName: string): TreeNode {
  const nodeMap = new Map<number, TreeNode>();
  const childrenMap = new Map<number, ForkData[]>();

  // Create all nodes
  forks.forEach((fork) => {
    nodeMap.set(fork.id, {
      id: `fork-${fork.id}`,
      forkId: fork.id,
      name: fork.name,
      owner: fork.owner,
      status: fork.status,
      commitCount: fork.commitCount,
      activityScore: fork.activityScore,
      children: [],
    });

    if (fork.parentId !== null) {
      const siblings = childrenMap.get(fork.parentId) ?? [];
      siblings.push(fork);
      childrenMap.set(fork.parentId, siblings);
    }
  });

  // Build root node
  const root: TreeNode = {
    id: 'root',
    forkId: 0,
    name: rootName,
    owner: '',
    status: 'alive',
    commitCount: 0,
    activityScore: 100,
    children: [],
  };

  // Assign children
  forks.forEach((fork) => {
    const node = nodeMap.get(fork.id)!;
    const parentId = fork.parentId;

    if (parentId === null || !nodeMap.has(parentId)) {
      // Top-level fork or parent not in dataset
      root.children.push(node);
    } else {
      const parent = nodeMap.get(parentId)!;
      parent.children.push(node);
    }
  });

  return root;
}

/**
 * Generate mock historical data for sparkline chart.
 * In production, this would come from a server-side time-series.
 */
export function generateHistoricalData(currentScore: number): HistoricalDataPoint[] {
  const months = 12;
  const data: HistoricalDataPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthLabel = date.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });

    // Create realistic-looking trend toward current score
    const progress = (months - i) / months;
    const noise = (Math.sin(i * 2.5) * 5) + (Math.random() - 0.5) * 8;
    const score = Math.max(0, Math.min(100, currentScore * progress * 0.7 + noise + 15));

    data.push({
      month: monthLabel,
      score: Math.round(score * 10) / 10,
      activeForks: Math.round(score * 1.5),
    });
  }

  // Ensure last point matches current score
  data[data.length - 1]!.score = currentScore;

  return data;
}
