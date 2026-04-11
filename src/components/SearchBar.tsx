interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: { value: string; label: string }[];
}

export function SearchBar({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchBarProps): JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row gap-3" role="search" aria-label="Search tools">
      {/* Text search */}
      <div className="relative flex-1">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="tool-search"
          type="search"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
            transition-colors"
        />
      </div>

      {/* Category filter */}
      <div>
        <label htmlFor="category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700
            bg-white
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
            transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
