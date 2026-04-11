import type { ForkData } from '../lib/types';

interface ForkNodeProps {
  fork: ForkData;
  onClick: (fork: ForkData) => void;
}

const statusConfig = {
  alive: {
    label: 'Alive',
    dotClass: 'bg-active',
    textClass: 'text-active',
    ringClass: 'ring-active/20',
  },
  dormant: {
    label: 'Dormant',
    dotClass: 'bg-dormant',
    textClass: 'text-dormant',
    ringClass: 'ring-dormant/20',
  },
  dead: {
    label: 'Dead',
    dotClass: 'bg-dead',
    textClass: 'text-gray-500 dark:text-gray-400',
    ringClass: 'ring-gray-500/20',
  },
} as const;

export function ForkNode({ fork, onClick }: ForkNodeProps): JSX.Element {
  const config = statusConfig[fork.status];

  return (
    <button
      onClick={() => onClick(fork)}
      className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700
        hover:border-brand/50 dark:hover:border-brand/50 hover:shadow-sm
        transition-all duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-1
        dark:focus:ring-offset-gray-900 group"
      aria-label={`${fork.owner}/${fork.name} — ${config.label}, ${fork.commitCount} commits`}
    >
      <div className="flex items-start gap-3">
        <img
          src={fork.ownerAvatarUrl}
          alt={`${fork.owner}'s avatar`}
          className="w-8 h-8 rounded-full"
          loading="lazy"
          width={32}
          height={32}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand transition-colors">
              {fork.owner}/{fork.name}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 text-xs ${config.textClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
              {config.label}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {fork.stargazersCount} ★
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {fork.commitCount} commits
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
            {fork.activityScore}
          </span>
        </div>
      </div>
    </button>
  );
}
