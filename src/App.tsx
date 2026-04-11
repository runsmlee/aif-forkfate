import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolList } from './components/ToolList';
import { ToolDetail } from './components/ToolDetail';
import { AddToolForm } from './components/AddToolForm';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { useTools } from './hooks/useTools';

export default function App(): JSX.Element {
  const {
    tools,
    selectedTool,
    setSelectedTool,
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    view,
    setView,
    addTool,
    borrowTool,
  } = useTools();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onAddTool={() => setView('add')} />

      <main className="flex-1">
        {view === 'home' && (
          <>
            <Hero onBrowseTools={() => setView('browse')} />
            <HowItWorks />

            {/* Preview: Featured tools */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12" aria-label="Featured tools">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recently Added</h2>
                <button
                  onClick={() => setView('browse')}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.slice(0, 3).map((tool) => (
                  <div
                    key={tool.id}
                    className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTool(tool)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTool(tool);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${tool.name} — ${tool.available ? 'Available' : 'Borrowed'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug pr-2">
                        {tool.name}
                      </h3>
                      {tool.available ? (
                        <span className="flex-shrink-0 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          Free
                        </span>
                      ) : (
                        <span className="flex-shrink-0 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          Borrowed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{tool.description.slice(0, 80)}…</p>
                    <p className="text-xs text-gray-400">
                      {tool.owner.name} · {tool.owner.distance}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'browse' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <ToolList
              tools={tools}
              query={query}
              onQueryChange={setQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onSelectTool={setSelectedTool}
            />
          </div>
        )}

        {view === 'add' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <AddToolForm
              onSubmit={(data) => {
                addTool(data);
              }}
              onCancel={() => setView('home')}
            />
          </div>
        )}
      </main>

      {/* Tool detail modal */}
      {selectedTool && (
        <ToolDetail
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          onBorrow={borrowTool}
        />
      )}

      <Footer />
    </div>
  );
}
