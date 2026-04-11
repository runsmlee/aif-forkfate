import { useMemo } from 'react';
import { useRepoStore } from '../stores/repo-store';
import { buildTree } from '../lib/score-engine';
import type { TreeNode } from '../lib/types';

export function useForkData(): {
  tree: TreeNode | null;
  aliveForks: number;
  dormantForks: number;
  deadForks: number;
} {
  const forks = useRepoStore((s) => s.forks);
  const repo = useRepoStore((s) => s.repo);

  const tree = useMemo(() => {
    if (!repo || forks.length === 0) return null;
    return buildTree(forks, repo.fullName);
  }, [repo, forks]);

  const aliveForks = useMemo(
    () => forks.filter((f) => f.status === 'alive').length,
    [forks]
  );
  const dormantForks = useMemo(
    () => forks.filter((f) => f.status === 'dormant').length,
    [forks]
  );
  const deadForks = useMemo(
    () => forks.filter((f) => f.status === 'dead').length,
    [forks]
  );

  return { tree, aliveForks, dormantForks, deadForks };
}
