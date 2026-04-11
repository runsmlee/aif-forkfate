import type { Tool } from '../lib/types';
import { CATEGORY_LABELS, CONDITION_LABELS } from '../lib/types';

interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}

const CONDITION_COLORS: Record<string, string> = {
  excellent: 'bg-green-50 text-green-700',
  good: 'bg-blue-50 text-blue-700',
  fair: 'bg-amber-50 text-amber-700',
  worn: 'bg-gray-100 text-gray-600',
};

const CATEGORY_ICONS: Record<string, string> = {
  'power-tools': '⚡',
  'hand-tools': '🔧',
  garden: '🌱',
  workshop: '🔨',
  measuring: '📐',
  safety: '🦺',
};

export function ToolCard({ tool, onSelect }: ToolCardProps): JSX.Element {
  return (
    <article className="card p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      <button
        onClick={() => onSelect(tool)}
        className="w-full text-left"
        aria-label={`${tool.name} — ${tool.available ? 'Available' : 'Currently borrowed'}`}
      >
        {/* Image placeholder */}
        <div className="w-full h-36 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-4xl">
          {CATEGORY_ICONS[tool.category] ?? '🔧'}
        </div>

        {/* Availability badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {CATEGORY_LABELS[tool.category]}
          </span>
          {tool.available ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
              Borrowed
            </span>
          )}
        </div>

        {/* Tool name */}
        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors leading-snug">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {tool.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
              {tool.owner.avatarInitials}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">{tool.owner.name}</p>
              <p className="text-xs text-gray-400">{tool.owner.distance}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CONDITION_COLORS[tool.condition] ?? 'bg-gray-100 text-gray-600'}`}>
            {CONDITION_LABELS[tool.condition]}
          </span>
        </div>
      </button>
    </article>
  );
}
