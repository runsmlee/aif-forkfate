import type { Tool } from '../lib/types';
import { ToolCard } from './ToolCard';
import { SearchBar } from './SearchBar';
import { CATEGORY_LABELS, type ToolCategory } from '../lib/types';

interface ToolListProps {
  tools: Tool[];
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onSelectTool: (tool: Tool) => void;
}

const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function ToolList({
  tools,
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  onSelectTool,
}: ToolListProps): JSX.Element {
  const filteredTools = tools.filter((tool) => {
    const matchesQuery =
      query === '' ||
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === '' || tool.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <section id="tools" aria-label="Available tools">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Browse Tools</h2>
        <p className="text-sm text-gray-500">
          {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} available near you
        </p>
      </div>

      <SearchBar
        query={query}
        onQueryChange={onQueryChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={CATEGORIES}
      />

      {filteredTools.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No tools found</h3>
          <p className="text-sm text-gray-500 mb-4">
            Try adjusting your search or filter to find what you need.
          </p>
          <button
            onClick={() => {
              onQueryChange('');
              onCategoryChange('');
            }}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
          ))}
        </div>
      )}
    </section>
  );
}
