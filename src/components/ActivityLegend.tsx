export function ActivityLegend(): JSX.Element {
  const items = [
    {
      label: 'Alive',
      description: 'Active within 90 days',
      color: 'bg-active',
      ringColor: 'ring-active/20',
      textColor: 'text-active-dark dark:text-active-light',
    },
    {
      label: 'Dormant',
      description: 'Inactive 90–365 days',
      color: 'bg-amber-400',
      ringColor: 'ring-amber-400/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Dead',
      description: 'No activity 365+ days',
      color: 'bg-gray-300 dark:bg-gray-600',
      ringColor: 'ring-gray-300/20 dark:ring-gray-600/20',
      textColor: 'text-gray-500 dark:text-gray-400',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
        Activity Status
      </span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${item.color} ring-4 ${item.ringColor} ${item.label === 'Alive' ? 'animate-pulse-slow' : ''}`}
            role="img"
            aria-label={`${item.label} indicator`}
          />
          <span className={`font-medium text-sm ${item.textColor}`}>{item.label}</span>
          <span className="text-gray-400 dark:text-gray-500 text-xs hidden sm:inline">
            {item.description}
          </span>
        </div>
      ))}
    </div>
  );
}
